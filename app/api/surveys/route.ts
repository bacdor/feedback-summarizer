// app/api/survey/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// export async function POST(req: Request) {
//   try {
//     const supabase = createClient();

//     // Test with hardcoded values
//     const { error } = await supabase.from('surveys').insert([
//       {
//         name: 'Test Survey',
//         description: 'Test description',
//         user_id: 'test_user_id'
//       }
//     ]);

//     if (error) {
//       throw new Error(error.message);
//     }

//     return NextResponse.json({ message: 'Survey created successfully' });
//   } catch (error) {
//     console.error('Error creating survey:', error);
//     return new NextResponse('Error creating survey', { status: 500 });
//   }
// }

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
