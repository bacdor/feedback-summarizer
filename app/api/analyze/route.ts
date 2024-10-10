// pages/api/analyze.js
import {
  analyzeKeyThemes,
  categorizeFeedbackByType
  // assessFeedbackSource,
  // analyzeTrendsOverTime,
  // quantQualAnalysis,
  // performSentimentAnalysis,
  // compareFeedbackWithGoals,
  // compareWithCompetitors,
  // prioritizeByImpact
} from '@/utils/openai/chat';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { questionsAndAnswersText, title } = await req.json(); // Get title from request body

  try {
    let analysisResult;

    // Call the appropriate function based on the title
    switch (title) {
      case 'Identify Key Themes':
        analysisResult = await analyzeKeyThemes(questionsAndAnswersText);
        break;
      case 'Categorize Feedback by Type':
        analysisResult = await categorizeFeedbackByType(
          questionsAndAnswersText
        );
        break;
      // case 'Assess the Feedback Source':
      //   analysisResult = await assessFeedbackSource(questionsAndAnswersText);
      //   break;
      // case 'Look for Trends Over Time':
      //   analysisResult = await analyzeTrendsOverTime(questionsAndAnswersText);
      //   break;
      // case 'Quantitative vs. Qualitative Analysis':
      //   analysisResult = await quantQualAnalysis(questionsAndAnswersText);
      //   break;
      // case 'Sentiment Analysis':
      //   analysisResult = await performSentimentAnalysis(questionsAndAnswersText);
      //   break;
      // case 'Compare Feedback with Your Goals':
      //   analysisResult = await compareFeedbackWithGoals(questionsAndAnswersText);
      //   break;
      // case 'Competitor Comparison':
      //   analysisResult = await compareWithCompetitors(questionsAndAnswersText);
      //   break;
      // case 'Prioritize Based on Impact':
      //   analysisResult = await prioritizeByImpact(questionsAndAnswersText);
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
