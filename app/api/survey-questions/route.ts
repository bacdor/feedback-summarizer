import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const supabase = createClient();
  const { surveyId, questionText, questionType, options } = await req.json();

  try {
    const { data, error } = await supabase.from('survey_questions').insert([
      {
        survey_id: surveyId,
        question_text: questionText,
        question_type: questionType,
        options
      }
    ]);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Question created', question: data });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating question', error },
      { status: 500 }
    );
  }
}
import type { NextApiRequest, NextApiResponse } from 'next';

// interface Question {
//   survey_id: string;
//   question_text: string;
//   question_type: string;
//   options?: string[];
// }

// const questions: Question[] = []; // This should ideally be replaced with a database

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { survey_id, question_text, question_type } = req.body;

//     if (!survey_id || !question_text || !question_type) {
//       return res.status(400).json({ message: 'Missing fields' });
//     }

//     const newQuestion: Question = {
//       survey_id,
//       question_text,
//       question_type
//       // options: [] // Uncomment if you want to include options
//     };

//     questions.push(newQuestion); // Save to your database instead
//     return res.status(201).json(newQuestion);
//   }

//   return res.status(405).json({ message: 'Method not allowed' });
// }
