// pages/api/analyze.js
import { analyzeKeyThemes } from '@/utils/openai/chat';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { questionsAndAnswersText } = await req.json();

  try {
    const keyThemes = await analyzeKeyThemes(questionsAndAnswersText);
    return NextResponse.json({ keyThemes }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to analyze themes.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
