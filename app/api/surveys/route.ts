// app/api/survey/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const supabase = createClient();
  const { surveyTitle, surveyDescription } = await req.json();

  try {
    // Fetch user details (assuming user is logged in)
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase.from('surveys').insert([
      {
        name: surveyTitle, // Map title to name
        description: surveyDescription || null, // Optional description
        user_id: user.id // Assign the survey to the logged-in user
      }
    ]);

    if (error) {
      console.log(user.id);
      throw error;
    }

    return NextResponse.json({ message: 'Survey created', survey: data });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating survey', error },
      { status: 500 }
    );
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
