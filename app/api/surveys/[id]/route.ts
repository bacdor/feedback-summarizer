import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = createClient();

  const { data: survey, error } = await supabase
    .from('surveys')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: 'Error fetching survey' },
      { status: 500 }
    );
  }

  return NextResponse.json(survey);
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
    const { error } = await supabase.from('surveys').delete().eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Survey deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting survey', error },
      { status: 500 }
    );
  }
}
