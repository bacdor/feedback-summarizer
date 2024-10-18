import { Json } from '@/types_db';
import OpenAI from 'openai';

const openai = new OpenAI();

// analyzePositiveFeedback,
// analyzeComplaints,
// solutionRequests,
// analyzeResponders,
// quantitativeAnalysis,
// analyzeTrendsOverTime, // later
// compareWithCompetitors, // later
// alignWithGoals,// later
// chatAI

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

export async function solutionRequests(data: Json, responseCount: number) {
  const systemPrompt = `
      You are an expert in sentiment analysis and thematic extraction. Your job is to analyze user feedback looking for request and complaints.
      Find most frequently occuring requests and complaints. Don't cite, just collect them and then categorize by type.

      Based on the given feedback, provide user with detailed solution ideas using easy-to-read language. 
      Rate impact for each in a scale 1-3.
      You will provide output in format in json format like:
      
      {
        "responses": {
          "request": [request or complaint: short comment],
          "solution": [solution],
          "impact": [impact]
        }
      }

      Don't change responses, request, solution, impact names even if you add a complaint.
      You will be provided with set of questions and answers.
      No more than 7 responses.
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

  const result = JSON.stringify({
    responses: chatResult.responses.map(
      (response: { request: string; solution: string; impact: number }) => ({
        request: response.request,
        solution: response.solution,
        impact: response.impact
      })
    ),
    count: responseCount
  });

  return result;
}

export async function analyzeResponders(data: Json) {
  const parsedData = JSON.parse(data as string);

  const responderMap = new Map();

  parsedData.forEach((item: any) => {
    let nonNegativeCount = 0;
    let sentimentSum = 0;
    let sentimentCount = 0;
    let ratingSum = 0;
    let ratingCount = 0;
    let questionAnswerPairs: { question: string; answer: string }[] = [];

    item.responses.forEach((response: any) => {
      if (['text', 'multiple_choice'].includes(response.question_type)) {
        if (parseInt(response.sentiment) >= 3) nonNegativeCount++;
        sentimentSum += parseInt(response.sentiment);
        sentimentCount++;
      } else if (response.question_type === 'rating') {
        if (parseInt(response.answer) >= 3) nonNegativeCount++;
        ratingSum += parseInt(response.answer);
        ratingCount++;
      }
      questionAnswerPairs.push({
        question: response.question_text,
        answer: response.answer
      });
    });

    const responder = responderMap.get(item.email) || {
      email: item.email,
      nonNegativeCount: 0,
      responseCount: 0,
      sentimentSum: 0,
      sentimentCount: 0,
      ratingSum: 0,
      ratingCount: 0,
      questionAnswerPairs: []
    };

    responder.nonNegativeCount += nonNegativeCount;
    responder.responseCount += item.responses.length;
    responder.sentimentSum += sentimentSum;
    responder.sentimentCount += sentimentCount;
    responder.ratingSum += ratingSum;
    responder.ratingCount += ratingCount;
    responder.questionAnswerPairs =
      responder.questionAnswerPairs.concat(questionAnswerPairs);

    responderMap.set(item.email, responder);
  });

  const responders = Array.from(responderMap.values()).map((responder) => ({
    email: responder.email,
    nonNegativePercentage:
      (responder.nonNegativeCount / responder.responseCount) * 100,
    responseCount: responder.responseCount,
    averageSentiment:
      responder.sentimentCount > 0
        ? responder.sentimentSum / responder.sentimentCount
        : null,
    averageRating:
      responder.ratingCount > 0
        ? responder.ratingSum / responder.ratingCount
        : null,
    questionAnswerPairs: responder.questionAnswerPairs
  }));

  console.log(JSON.stringify({ responders }));

  // Extract emails and question-answer pairs from responders
  const extractedData = responders.map((responder) => ({
    email: responder.email,
    questionAnswerPairs: responder.questionAnswerPairs
  }));

  console.log(JSON.stringify(extractedData));

  const systemPrompt = `
    You are an expert in psychological sentiment analysis. 
    Your job is to analyze user feedback to determine what was the overall sentiment, main issues and other main themes.
    Your answer should consist of text, 2 sentences.

    For each email, based on the user's feedback, provide informations using easy-to-read language. Don't use direct referance.
    You will provide output in format in json format like:
    
    {
      "responses": [
        {
          "email": [email],
          "analysis": [analysis]
        }
      ]
    }

    You will be provided with set of questions and answers.
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
        content: JSON.stringify(extractedData)
      }
    ],
    temperature: 0,
    max_tokens: 800
  });

  const chatResult = JSON.parse(response.choices[0].message.content || '{}');
  const result = JSON.stringify({
    responders: responders
      .map((responder) => {
        const aiAnalysis = chatResult.responses.find(
          (r: { email: string }) => r.email === responder.email
        );
        return {
          ...responder,
          analysis: aiAnalysis ? aiAnalysis.analysis : null,
          questionAnswerPairs: undefined // Remove questionAnswerPairs
        };
      })
      .sort((a, b) => b.nonNegativePercentage - a.nonNegativePercentage)
  });

  return result;
}

export async function quantitativeAnalysis(data: Json) {
  const parsedData = JSON.parse(data as string);

  const emails = new Set();
  const ratingQuestions = new Map();
  const multipleChoiceQuestions = new Map();
  const textQuestions = new Map();
  let totalAnsweredQuestions = 0;

  parsedData.forEach((item: any) => {
    emails.add(item.email);
    item.responses.forEach((response: any) => {
      const { question_text, answer, question_type } = response;
      totalAnsweredQuestions++;

      if (question_type === 'rating') {
        if (!ratingQuestions.has(question_text)) {
          ratingQuestions.set(question_text, { sum: 0, count: 0, answers: [] });
        }
        const question = ratingQuestions.get(question_text);
        question.sum += parseInt(answer);
        question.count++;
        question.answers.push({ email: item.email, answer: parseInt(answer) });
      } else if (question_type === 'multiple_choice') {
        if (!multipleChoiceQuestions.has(question_text)) {
          multipleChoiceQuestions.set(question_text, []);
        }
        multipleChoiceQuestions.get(question_text).push({
          email: item.email,
          answer: answer
        });
      } else if (question_type === 'text') {
        if (!textQuestions.has(question_text)) {
          textQuestions.set(question_text, []);
        }
        textQuestions.get(question_text).push({ email: item.email, answer });
      }
    });
  });

  const result = JSON.stringify({
    overall: {
      numberOfAnsweredQuestions: totalAnsweredQuestions,
      numberOfSubmissions: parsedData.length,
      numberOfResponders: emails.size,
      emails: Array.from(emails)
    },
    ratingQuestions: {
      numberOfQuestions: ratingQuestions.size,
      questions: Array.from(ratingQuestions).map(([question, data]) => ({
        question,
        averageRating: data.sum / data.count,
        answers: data.answers
      }))
    },
    multipleChoiceQuestions: {
      numberOfQuestions: multipleChoiceQuestions.size,
      questions: Array.from(multipleChoiceQuestions).map(
        ([question, answers]) => {
          const choiceCounts = answers.reduce(
            (acc: { [key: string]: number }, curr: { answer: string }) => {
              acc[curr.answer] = (acc[curr.answer] || 0) + 1;
              return acc;
            },
            {}
          );

          return {
            question,
            answers: Object.entries(choiceCounts).map(([choice, count]) => ({
              choice,
              count: count as number,
              percentage: ((count as number) / answers.length) * 100,
              emails: answers
                .filter((a: { answer: string }) => a.answer === choice)
                .map((a: { email: any }) => a.email)
            }))
          };
        }
      )
    },
    textQuestions: {
      numberOfQuestions: textQuestions.size,
      questions: Array.from(textQuestions).map(([question, answers]) => ({
        question,
        answers
      }))
    }
  });

  return result;
}

export async function chatAI(data: Json, userMessage: string) {
  const systemPrompt = `
    You are a helpful AI assistant. Your role is to provide informative and engaging responses to user queries.
    Please be concise, accurate, and friendly in your responses.
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
        content: userMessage
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  });

  return response.choices[0].message.content;
}
