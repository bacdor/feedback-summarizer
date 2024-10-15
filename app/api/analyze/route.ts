// pages/api/analyze.js
import {
  analyzePositiveFeedback,
  analyzeComplaints
  // categorizeFeedbackByType,
  // categorizeFeedbackByTone,
  // performQuantitativeAnalysis, // later
  // analyzeTrendsOverTime, // later
  // compareWithCompetitors, // later
  // alignWithGoals
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
      // case 'Type Categorization':
      //   analysisResult = await categorizeFeedbackByType(
      //     questionsAndAnswersText
      //   );
      //   break;
      // case 'Tone Categorization':
      //   analysisResult = await categorizeFeedbackByTone(
      //     questionsAndAnswersText
      //   );
      //   break;
      // case 'Quantitative Analysis': // later
      //   analysisResult = await performQuantitativeAnalysis(questionsAndAnswersText);
      //   break;
      // case 'Trends Over Time': // later
      //   analysisResult = await analyzeTrendsOverTime(questionsAndAnswersText);
      //   break;
      // case 'Competitor Comparison': // later
      //   analysisResult = await compareWithCompetitors(questionsAndAnswersText);
      //   break;
      // case 'Goal Alignment':
      //   analysisResult = await alignWithGoals(questionsAndAnswersText);
      //   break;
      // case 'Actionability': // later
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
