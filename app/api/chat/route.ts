import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(req: Request) {
  const { analysisResult, message, chatHistory } = await req.json();

  try {
    const aiResponse = await getAIResponse(
      analysisResult,
      message,
      chatHistory
    );
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error fetching AI response:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI response' },
      { status: 500 }
    );
  }
}

async function getAIResponse(
  analysisResult: string,
  userMessage: string,
  chatHistory: string
): Promise<string> {
  // Parse chat history to JSON
  console.log(chatHistory);
  let parsedChatHistory;
  try {
    parsedChatHistory = JSON.parse(chatHistory);
  } catch (error) {
    console.error('Error parsing chat history:', error);
    parsedChatHistory = [];
  }

  // Ensure parsedChatHistory is an array
  if (!Array.isArray(parsedChatHistory)) {
    parsedChatHistory = [];
  }
  console.log(parsedChatHistory);
  const systemPrompt = `
    You will be provided with ${analysisResult} which is a customer feedback data.
    Answer professionally all questions about that data. When a question not related to this data asked, answer vague and prompt user to focus on the data.
    I want your answers to be kind and short, use language typicall for boy scouts.
    `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      ...parsedChatHistory,
      {
        role: 'user',
        content: userMessage
      }
    ],
    // messages: parsedChatHistory,
    temperature: 0.7,
    max_tokens: 500
  });

  console.log(parsedChatHistory);

  return response.choices[0].message.content ?? ''; // Extract the AI's response and provide a fallback
}
