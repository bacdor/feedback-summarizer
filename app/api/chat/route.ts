import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(req: Request) {
  const { message } = await req.json();

  try {
    const aiResponse = await getAIResponse(message);
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error fetching AI response:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI response' },
      { status: 500 }
    );
  }
}

async function getAIResponse(userMessage: string): Promise<string> {
  const systemPrompt = `
    You are a helpful AI assistant. Your role is to provide informative and engaging responses to user queries.
    Please be concise, accurate, and friendly in your responses.
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userMessage
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  });

  return response.choices[0].message.content ?? ''; // Extract the AI's response and provide a fallback
}
