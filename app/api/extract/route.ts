import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const text = formData.get('text') as string;
    const question = formData.get('question') as string;

    if (!text) {
      return NextResponse.json(
        { message: 'No text uploaded' },
        { status: 400 }
      );
    }

    if (!question) {
      return NextResponse.json(
        { message: 'No question provided' },
        { status: 400 }
      );
    }
    // Initialize OpenAI
    const openai = new OpenAI();

    // Generate answer based on the extracted text and the question
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You will be provided with a prompt regarding uploaded text. Provide user with an answer and a quote that proves the answer in a format: answer|"citation".`
        },
        {
          role: 'user',
          content: 'Who was Ginger?'
        },
        {
          role: 'assistant',
          content:
            'Ginger was a giraffe|"And there was Ginger, our friend, the giraffe"'
        },
        {
          role: 'system',
          content: `The uploaded text is: ${text}. Provide user with an answer and a quote that proves the answer in a format: answer|"citation".`
        },
        {
          role: 'user',
          content: `${question}`
        }
      ],
      max_tokens: 500
    });

    const answer = response.choices[0]?.message?.content?.split('|');

    return NextResponse.json({
      message: 'Question answered successfully',
      answer
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      {
        message: 'Failed to process the file, your file is too large.',
        error: error
      },
      { status: 500 }
    );
  }
}
