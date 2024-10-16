// pages/api/analyze.js
import {
  analyzePositiveFeedback,
  analyzeComplaints,
  solutionRequests,
  analyzeResponders,
  quantitativeAnalysis
  // analyzeTrendsOverTime, // later
  // compareWithCompetitors, // later
  // alignWithGoals // later
  // assessActionability // later
} from '@/utils/openai/chat';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { surveyResponsesForId, title } = await req.json(); // Get title from request body

  try {
    let analysisResult;

    // Call the appropriate function based on the title
    switch (title) {
      case 'Positive Feedback':
        // const parsedJson = JSON.parse(surveyResponsesForId);
        const simplifiedData = surveyResponsesForId.map((item: any) => ({
          email: item.email,
          responses: item.responses.map((response: any) => ({
            question_text: response.question_text,
            answer: response.answer,
            question_type: response.question_type,
            sentiment: response.sentiment
          }))
        }));
        analysisResult = await analyzePositiveFeedback(
          JSON.stringify(simplifiedData)
        );
        break;
      case 'Complaints':
        const simplifiedData2 = surveyResponsesForId.map((item: any) => ({
          email: item.email,
          responses: item.responses.map((response: any) => ({
            question_text: response.question_text,
            answer: response.answer,
            question_type: response.question_type,
            sentiment: response.sentiment
          }))
        }));
        analysisResult = await analyzeComplaints(
          JSON.stringify(simplifiedData2)
        );
        break;
      case 'Solution Requests':
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - 14);

        let responseCount = 0;

        const simplifiedData3 = surveyResponsesForId
          .filter((item: any) => new Date(item.submitted_at) >= daysAgo)
          .map((item: any) => {
            responseCount += item.responses.length;
            return {
              responses: item.responses.map((response: any) => ({
                question: response.question_text,
                answer: response.answer
              }))
            };
          });
        analysisResult = await solutionRequests(
          JSON.stringify(simplifiedData3),
          responseCount
        );
        break;
      case 'Responders':
        const simplifiedData4 = surveyResponsesForId.map((item: any) => ({
          email: item.email,
          responses: item.responses.map((response: any) => ({
            question_text: response.question_text,
            answer: response.answer,
            question_type: response.question_type,
            sentiment: response.sentiment
          }))
        }));
        analysisResult = await analyzeResponders(
          JSON.stringify(simplifiedData4)
        );
        break;
      case 'Quantitative Analysis': // later
        const simplifiedData5 = surveyResponsesForId.map((item: any) => ({
          email: item.email,
          responses: item.responses.map((response: any) => ({
            question_text: response.question_text,
            answer: response.answer,
            question_type: response.question_type,
            sentiment: response.sentiment
          }))
        }));
        analysisResult = await quantitativeAnalysis(
          JSON.stringify(simplifiedData5)
        );
        break;
      case 'Trends Over Time': // later
        // const simplifiedData6 = surveyResponsesForId.map((item: any) => ({
        //   email: item.email,
        //   date: item.submitted_at,
        //   responses: item.responses.map((response: any) => ({
        //     question_text: response.question_text,
        //     answer: response.answer,
        //     question_type: response.question_type,
        //     sentiment: response.sentiment
        //   }))
        // }));
        // analysisResult = await quantitativeAnalysis(
        //   JSON.stringify(simplifiedData6)
        // );
        break;
      case 'Competitor Comparison': // later
        // analysisResult = await compareWithCompetitors(questionsAndAnswersText);
        break;
      case 'Goal Alignment':
        // analysisResult = await alignWithGoals(questionsAndAnswersText);
        break;
      // case 'Chat': // later
      //   analysisResult = await assessActionability(questionsAndAnswersText);
      //   break;
      default:
        throw new Error('Invalid analysis title.');
    }

    return NextResponse.json({ analysisResult }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to analyze themes.' },
      { status: 500 }
    );
  }
}

// // pages/api/analyze.js
// import { analyzeKeyThemes } from '@/utils/openai/chat';
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
//   const { questionsAndAnswersText, title } = await req.json();

//   try {
//     const analysisResult = await analyzeKeyThemes(questionsAndAnswersText);
//     return NextResponse.json({ analysisResult }, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: 'Failed to analyze themes.' },
//       { status: 500 }
//     );
//   }
// }

export async function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
