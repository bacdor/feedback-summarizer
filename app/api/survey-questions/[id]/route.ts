import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { questionText, questionType, options } = await req.json();

  const id = params.id;

  if (!id) {
    return NextResponse.json(
      { message: 'Missing question id' },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from('survey_questions')
      .update({
        question_text: questionText,
        question_type: questionType,
        options: options
      })
      .eq('id', id); // Use the id from the path to update the correct record

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Question updated', question: data });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating question', error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const id = params.id;

  if (!id) {
    return NextResponse.json(
      { message: 'Missing question id' },
      { status: 400 }
    );
  }

  try {
    const { error } = await supabase
      .from('survey_questions')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Question deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting question', error },
      { status: 500 }
    );
  }
}
