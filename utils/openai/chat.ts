import { Json } from '@/types_db';
import OpenAI from 'openai';

const openai = new OpenAI();

// analyzePositiveFeedback,
// analyzeNegativeThemes,
// categorizeFeedbackByType,
// categorizeFeedbackByTone,
// performQuantitativeAnalysis, // later
// analyzeTrendsOverTime, // later
// compareWithCompetitors, // later
// alignWithGoals,
// assessActionability // later

export const analyzeSentiment = async (text: string) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'Analyze the positivity of the following text. Assign a score from 1 to 5, where:\n' +
          '1: Very negative\n' +
          '2: Somewhat negative\n' +
          '3: Neutral\n' +
          '4: Somewhat positive\n' +
          '5: Very positive' +
          'Your responses should be only a number'
      },
      {
        role: 'user',
        content: text
      }
    ],
    temperature: 0,
    max_tokens: 10
  });

  return response.choices[0].message.content?.trim() || '0';
};

export async function analyzePositiveFeedback(data: Json) {
  const parsedData = JSON.parse(data as string);
  const ratingResponses: { [key: string]: { sum: number; count: number } } = {};
  const otherResponses: any[] = [];
  let totalAnswers = 0;
  let highRatingCount = 0;
  let positiveAnswersCount = 0;
  const happyUsers: {
    [email: string]: { positiveCount: number; totalCount: number };
  } = {};

  for (const item of parsedData) {
    if (!happyUsers[item.email]) {
      happyUsers[item.email] = { positiveCount: 0, totalCount: 0 };
    }
    for (const response of item.responses) {
      totalAnswers++;
      happyUsers[item.email].totalCount++;
      if (response.question_type === 'rating') {
        if (!ratingResponses[response.question_text]) {
          ratingResponses[response.question_text] = { sum: 0, count: 0 };
        }
        const rating = parseInt(response.answer);
        ratingResponses[response.question_text].sum += rating;
        ratingResponses[response.question_text].count++;
        if (rating >= 4) {
          if (rating >= 4) {
            highRatingCount++;
          }
          happyUsers[item.email].positiveCount++;
        }
      } else {
        otherResponses.push(response);
        const sentimentScore = parseInt(
          await analyzeSentiment(response.answer)
        );
        if (sentimentScore >= 4) {
          if (sentimentScore >= 4) {
            positiveAnswersCount++;
          }
          happyUsers[item.email].positiveCount++;
        }
      }
    }
  }

  const averageRatingResponses = Object.entries(ratingResponses).reduce(
    (acc, [question, { sum, count }]) => {
      acc[question] = {
        average: sum / count,
        count: count
      };
      return acc;
    },
    {} as { [key: string]: { average: number; count: number } }
  );

  const happyUsersPercentage = Object.fromEntries(
    Object.entries(happyUsers).map(([email, { positiveCount, totalCount }]) => [
      email,
      {
        percentage: totalCount > 0 ? (positiveCount / totalCount) * 100 : 0,
        totalCount: totalCount
      }
    ])
  );

  const updatedData = JSON.stringify({
    ratingResponses: averageRatingResponses,
    otherResponses,
    happyUsers: happyUsersPercentage
  });

  const systemPrompt = `
      You are an expert in sentiment analysis and thematic extraction. Your job is to analyze user feedback based on tone focusing on positives.
      You will be provided with set of questions and answers.

      Based on the given feedback, you will provide output in format in json format like:
      

      {
          "keyThemes": {
            "1": "Key theme 1",
            "2": "Key theme 2",
            "3": "Key theme 3",
            "4": "Key theme 4",
            "5": "Key theme 5"
          },
          "summary": "Based on the analyzed feedback, provide a concise summary of the overall sentiment and key themes identified.
          (Don't mention that overall feedback is positive, it's obious because you are analyzing only positives)",
      }

      Do not wrap the json codes in JSON markers.
    `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: JSON.stringify(data)
      }
    ],
    temperature: 0,
    max_tokens: 800
  });

  const chatResult = JSON.parse(response.choices[0].message.content || '{}');
  const positivePercentage =
    ((positiveAnswersCount + highRatingCount) / totalAnswers) * 100;

  const highRatedQuestions = Object.entries(averageRatingResponses)
    .filter(([_, rating]) => rating.average >= 3.6)
    .sort((a, b) => b[1].average - a[1].average);

  const happiestUsers = Object.entries(happyUsersPercentage)
    .filter(([_, score]) => score.percentage >= 50)
    .sort((a, b) => b[1].percentage - a[1].percentage)
    .slice(0, 3);

  const result = JSON.stringify({
    positivePercentage: positivePercentage.toFixed(2),
    keyThemes: chatResult.keyThemes,
    summary: chatResult.summary,
    highRatedQuestions: highRatedQuestions.map(([question, rating]) => ({
      question,
      rating: rating.average.toFixed(2),
      count: rating.count
    })),
    happiestUsers: happiestUsers.map(([email, score]) => ({
      email,
      score: score.percentage.toFixed(2),
      count: score.totalCount
    }))
  });

  return result;

  // return response.choices[0].message.content;
}

export async function analyzeNegativeThemes(text: string) {
  const systemPrompt = `
      You are an expert in sentiment analysis and thematic extraction. Your job is to analyze user feedback, focusing specifically on recurring negative themes.

      For each question-answer pair, identify:
      1. Negative themes or points of dissatisfaction.
      2. Recurring negative themes across multiple responses.

      Your analysis should group similar responses and highlight common areas where users express frustration or criticize the product or experience. Be concise but thorough in your thematic analysis.
      `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: text
      }
    ],
    temperature: 0.2,
    max_tokens: 800
  });

  return response.choices[0].message.content;
}

export async function categorizeFeedbackByType(text: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a feedback analyzer. You will be provided with users feedback about an app. ' +
          'Categorize feedback by type and provide summarization for each based on the following tips along with some examples. ' +
          'Product/Feature Feedback: What do people think about the features and usability of your app? ' +
          'Are there any feature requests or issues that are repeatedly mentioned? ' +
          'User Experience (UX): How easy is it for users to navigate your app? ' +
          'Are they frustrated by any specific parts of the interface or workflow? ' +
          'Performance Issues: Are users mentioning performance problems like speed, bugs, or crashes? ' +
          'Support and Communication: How do users feel about the level of support they are receiving? ' +
          'Are they satisfied with how quickly their issues are addressed?'
      },
      {
        role: 'user',
        content: text
      }
    ],
    temperature: 0.2,
    max_tokens: 800
  });

  return response.choices[0].message.content;
}

export async function categorizeFeedbackByTone(text: string) {
  const systemPrompt = `
      You are an expert in sentiment analysis and thematic extraction. Your job is to analyze user feedback and categorize it into three types: positive, negative, or neutral.

      For each question-answer pair:
      1. Determine if the feedback is positive, negative, or neutral.
      2. Provide a brief explanation of why the feedback falls into that category.
      3. Extract themes from the feedback, focusing on recurring elements in both positive and negative categories.

      Your analysis should clearly separate positive, negative, and neutral feedback, and for recurring themes in both positive and negative categories, group similar responses together.
      `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: text
      }
    ],
    temperature: 0.2,
    max_tokens: 800
  });

  return response.choices[0].message.content;
}

export async function alignWithGoals(text: string) {
  const systemPrompt = `
      You are an expert in sentiment analysis and thematic extraction. Your job is to analyze user feedback and categorize it into three types: positive, negative, or neutral.

      `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: text
      }
    ],
    temperature: 0.2,
    max_tokens: 800
  });

  return response.choices[0].message.content;
}
