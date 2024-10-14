import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { analyzeSentiment } from '@/utils/openai/chat';

export async function POST(req: Request) {
  const supabase = createClient();
  const { responses } = await req.json();

  const updatedResponses = await Promise.all(
    responses.map(async (response: any) => ({
      ...response,
      responses: await Promise.all(
        response.responses.map(async (r: any) => {
          if (r.question_type !== 'rating' && r.sentiment === null) {
            const sentiment = await analyzeSentiment(r.answer);
            return { ...r, sentiment };
          } else {
            return { ...r, sentiment: null };
          }
        })
      )
    }))
  );

  try {
    for (const response of updatedResponses) {
      const { data, error } = await supabase
        .from('survey_responses')
        .update({ responses: response.responses })
        .eq('survey_id', response.survey_id)
        .eq('email', response.email)
        .eq('id', response.id);

      if (error) {
        throw error;
      }
    }

    return NextResponse.json({ message: 'Sentiments updated successfully' });
  } catch (error) {
    console.error('Error updating sentiments:', error);
    return NextResponse.json(
      { message: 'Error updating sentiments', error },
      { status: 500 }
    );
  }
}
