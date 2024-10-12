// app/api/survey/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const supabase = createClient();
  const { id, title, description } = await req.json();

  try {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Insert new survey
    const { data, error } = await supabase.from('surveys').insert([
      {
        id: id,
        name: title,
        description: description || null,
        user_id: user.id
      }
    ]);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: 'Survey created',
      survey: { id, title, description }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating survey' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const supabase = createClient();
  const { id, title, description } = await req.json();

  try {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Update existing survey
    const { data, error } = await supabase
      .from('surveys')
      .update({ name: title, description: description || null })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: 'Survey updated',
      survey: { id, title, description }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error updating survey' },
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
