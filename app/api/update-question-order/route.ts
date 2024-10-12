import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const supabase = createClient();
  const { surveyId, updatedQuestions } = await req.json();

  // Check for required data in the request body
  if (!surveyId || !updatedQuestions || !Array.isArray(updatedQuestions)) {
    return NextResponse.json(
      { message: 'Invalid data provided' },
      { status: 400 }
    );
  }

  try {
    // Iterate over the updatedQuestions array and update each question's position
    for (const question of updatedQuestions) {
      const { id, position } = question;

      const { error } = await supabase
        .from('survey_questions')
        .update({ position })
        .eq('id', id)
        .eq('survey_id', surveyId); // Ensure we are updating the correct survey

      if (error) {
        console.error(`Error updating question with ID ${id}:`, error);
        throw error;
      }
    }

    return NextResponse.json({
      message: 'Question order updated successfully'
    });
  } catch (error) {
    console.error('Error updating question order:', error);
    return NextResponse.json(
      { message: 'Error updating question order', error },
      { status: 500 }
    );
  }
}
