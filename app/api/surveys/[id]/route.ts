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
