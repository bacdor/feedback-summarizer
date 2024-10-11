// app/api/survey/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const supabase = createClient();
  const { id, surveyTitle, surveyDescription } = await req.json();
  // const { id, title, description } = await req.json();

  try {
    // Fetch user details (assuming user is logged in)
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (id) {
      // Update existing survey
      const { data, error } = await supabase
        .from('surveys')
        .update({ name: surveyTitle, description: surveyDescription || null })
        .eq('id', id)
        .eq('user_id', user.id); // Ensure user is authorized to update this survey

      if (error) {
        throw error;
      }

      return NextResponse.json({ message: 'Survey updated', survey: data });
    } else {
      // Insert new survey
      const { data, error } = await supabase.from('surveys').insert([
        {
          name: surveyTitle,
          description: surveyDescription || null,
          user_id: user.id // Assign the survey to the logged-in user
        }
      ]);

      if (error) {
        throw error;
      }

      return NextResponse.json({ message: 'Survey created', survey: data });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error saving survey' }, { status: 500 });
  }
}

export async function GET() {
  const supabase = createClient();

  const { data: surveys, error } = await supabase.from('surveys').select('*');

  if (error) {
    return NextResponse.json(
      { error: 'Error fetching surveys' },
      { status: 500 }
    );
  }

  return NextResponse.json(surveys);
}
