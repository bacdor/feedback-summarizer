// pages/api/analyze.js
import { analyzeKeyThemes } from '@/utils/openai/chat';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { questionsAndAnswersText, title } = await req.json(); // Get title from request body

  try {
    let analysisResult;

    // Call the appropriate function based on the title
    switch (title) {
      case 'Key Themes':
        analysisResult = await analyzeKeyThemes(questionsAndAnswersText);
        break;
      //   case 'Secondary Themes':
      //     analysisResult = await analyzeSecondaryThemes(questionsAndAnswersText);
      //     break;
      //   case 'Important Highlights':
      //     analysisResult = await analyzeHighlights(questionsAndAnswersText);
      //     break;
      // Add more cases for other titles and their respective functions
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
