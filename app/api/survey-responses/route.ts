import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
// import EmailForm from '@/components/ui/AccountForms/EmailForm';

export async function POST(req: Request) {
  const supabase = createClient();
  const { surveyId, email, responses } = await req.json();

  try {
    const { data, error } = await supabase.from('survey_responses').insert([
      {
        survey_id: surveyId,
        email: email,
        responses: responses.map((response: any) => ({
          ...response,
          sentiment: null // Adding a new field for sentiment
        }))
      }
    ]);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Response created', question: data });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating response', error },
      { status: 500 }
    );
  }
}
