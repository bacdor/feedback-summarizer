import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { analyzeSentiment } from '@/utils/openai/chat';
// import EmailForm from '@/components/ui/AccountForms/EmailForm';

export async function POST(req: Request) {
  const supabase = createClient();
  const { surveyId, email, responses } = await req.json();

  const updatedResponses = await Promise.all(
    responses.map(async (r: any) => {
      if (r.question_type !== 'rating') {
        const sentiment = await analyzeSentiment(r.answer);
        return { ...r, sentiment: sentiment };
      } else {
        return { ...r, sentiment: null };
      }
    })
  );

  try {
    const { data, error } = await supabase.from('survey_responses').insert([
      {
        survey_id: surveyId,
        email: email,
        responses: updatedResponses
      }
    ]);
    if (error) {
      // Update the survey's is_ready field to false
      const { error: updateError } = await supabase
        .from('surveys')
        .update({ is_ready: false })
        .eq('id', surveyId);

      if (updateError) {
        console.error('Error updating survey is_ready status:', updateError);
        // Note: We're not throwing an error here to ensure the response is still saved
      }

      throw error;
    }

    // Update the survey's is_ready field to true
    const { error: updateError } = await supabase
      .from('surveys')
      .update({ is_ready: true })
      .eq('id', surveyId);

    if (updateError) {
      console.error('Error updating survey is_ready status:', updateError);
      // Note: We're not throwing an error here to ensure the response is still saved
    }

    return NextResponse.json({ message: 'Response created', question: data });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating response', error },
      { status: 500 }
    );
  }
}
