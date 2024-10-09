import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const supabase = createClient();
  const { surveyId, questionText, questionType, options } = await req.json();

  try {
    const { data, error } = await supabase.from('survey_questions').insert([
      {
        survey_id: surveyId,
        question_text: questionText,
        question_type: questionType,
        options
      }
    ]);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Question created', question: data });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating question', error },
      { status: 500 }
    );
  }
}