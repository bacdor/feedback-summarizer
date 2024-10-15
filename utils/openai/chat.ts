import { Json } from '@/types_db';
import OpenAI from 'openai';

const openai = new OpenAI();

// analyzePositiveFeedback,
// analyzeComplaints,
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
        if (rating >= 3) {
          if (rating >= 4) {
            highRatingCount++;
          }
          happyUsers[item.email].positiveCount++;
        }
      } else {
        otherResponses.push(response);
        let sentimentScore;
        if (response.sentiment === undefined) {
          sentimentScore = parseInt(await analyzeSentiment(response.answer));
        } else {
          sentimentScore = parseInt(response.sentiment);
        }
        if (sentimentScore >= 3) {
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

  const systemPrompt = `
      You are an expert in sentiment analysis and thematic extraction. Your job is to analyze user feedback based on tone focusing on positives.
      You will be provided with set of questions and answers.

      Based on the given feedback, provide user with detailed analysis, be specific, focus on the most frequently occuring themes.
      You will provide output in format in json format like:
      

      {
          "keyThemes": {
            "1": "Key positive theme 1: comment",
            "2": "Key positive theme 2: comment",
            "3": "Key positive theme 3: comment",
            "4": "Key positive theme 4: comment",
            "5": "Key positive theme 5: comment"
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
}

export async function analyzeComplaints(data: Json) {
  const parsedData = JSON.parse(data as string);
  const ratingResponses: { [key: string]: { sum: number; count: number } } = {};
  const otherResponses: any[] = [];
  let totalAnswers = 0;
  let lowRatingCount = 0;
  let negativeAnswersCount = 0;
  const unhappyUsers: {
    [email: string]: { negativeCount: number; totalCount: number };
  } = {};

  for (const item of parsedData) {
    if (!unhappyUsers[item.email]) {
      unhappyUsers[item.email] = { negativeCount: 0, totalCount: 0 };
    }
    for (const response of item.responses) {
      totalAnswers++;
      unhappyUsers[item.email].totalCount++;
      if (response.question_type === 'rating') {
        if (!ratingResponses[response.question_text]) {
          ratingResponses[response.question_text] = { sum: 0, count: 0 };
        }
        const rating = parseInt(response.answer);
        ratingResponses[response.question_text].sum += rating;
        ratingResponses[response.question_text].count++;
        if (rating <= 2) {
          lowRatingCount++;
          unhappyUsers[item.email].negativeCount++;
        }
      } else {
        otherResponses.push(response);
        let sentimentScore;
        if (response.sentiment === undefined) {
          sentimentScore = parseInt(await analyzeSentiment(response.answer));
        } else {
          sentimentScore = parseInt(response.sentiment);
        }
        console.log(
          response.answer + ' : ' + sentimentScore + ' || ' + response.sentiment
        );
        if (sentimentScore <= 2) {
          negativeAnswersCount++;
          unhappyUsers[item.email].negativeCount++;
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

  const unhappyUsersPercentage = Object.fromEntries(
    Object.entries(unhappyUsers).map(
      ([email, { negativeCount, totalCount }]) => [
        email,
        {
          percentage:
            100 - (totalCount > 0 ? (negativeCount / totalCount) * 100 : 0),
          totalCount: totalCount
        }
      ]
    )
  );

  const systemPrompt = `
      You are an expert in sentiment analysis and thematic extraction. Your job is to analyze user feedback based on tone focusing on complaints and negative feedback.
      You will be provided with set of questions and answers.

      Based on the given feedback, provide user with detailed analysis, be specific, focus on the most frequently occuring themes.
      You will provide output in format in json format like:
      

      {
          "keyThemes": {
            "1": "Key complaint theme 1: comment",
            "2": "Key complaint theme 2: comment",
            "3": "Key complaint theme 3: comment",
            "4": "Key complaint theme 4: comment",
            "5": "Key complaint theme 5: comment"
          },
          "summary": "Based on the analyzed feedback, provide a concise summary of the overall negative sentiment and key complaint themes identified.
          (Don't mention that overall feedback is negative, it's obvious because you are analyzing only complaints)",
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
  const negativePercentage =
    ((negativeAnswersCount + lowRatingCount) / totalAnswers) * 100;

  const lowRatedQuestions = Object.entries(averageRatingResponses)
    .filter(([_, rating]) => rating.average <= 3)
    .sort((a, b) => a[1].average - b[1].average);

  const unhappiestUsers = Object.entries(unhappyUsersPercentage)
    .filter(([_, score]) => score.percentage <= 50)
    .sort((a, b) => a[1].percentage - b[1].percentage)
    .slice(0, 3);

  const result = JSON.stringify({
    negativePercentage: negativePercentage.toFixed(2),
    keyThemes: chatResult.keyThemes,
    summary: chatResult.summary,
    lowRatedQuestions: lowRatedQuestions.map(([question, rating]) => ({
      question,
      rating: rating.average.toFixed(2),
      count: rating.count
    })),
    unhappiestUsers: unhappiestUsers.map(([email, score]) => ({
      email,
      score: score.percentage.toFixed(2),
      count: score.totalCount
    }))
  });

  return result;
}
