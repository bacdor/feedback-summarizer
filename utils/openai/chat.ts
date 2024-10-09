import OpenAI from 'openai';

const openai = new OpenAI();

export async function analyzeKeyThemes(text: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a feedback analyzer. You will be provided with users feedback about an app. Identify Key Themes. Focus on: 1.Positive Feedback: Look for recurring comments about what you’re doing well. This might include specific features, qualities, or processes that people appreciate. 2.Negative Feedback: Identify the common complaints or suggestions for improvement. These are often areas where focus on making changes is needed. 3.Suggestions: Note any recommendations or ideas for new features or approaches that the users propose.'
      },
      {
        role: 'user',
        content: text
      }
    ],
    max_tokens: 800
  });

  return response.choices[0].message.content;
}

// export async function analyzeNegativeFeedback(text: string) {
//   const response = await openai.chat.completions.create({
//     model: 'gpt-4o-mini',
//     messages: [
//       {
//         role: 'system',
//         content:
//           'Focus on identifying recurring negative feedback or complaints.'
//       },
//       {
//         role: 'user',
//         content: text
//       }
//     ],
//     max_tokens: 800
//   });

//   return response.choices[0].message.content;
// }

// export async function analyzeSuggestions(text: string) {
//   const response = await openai.chat.completions.create({
//     model: 'gpt-4o-mini',
//     messages: [
//       {
//         role: 'system',
//         content:
//           'Focus on identifying user suggestions for improvement or new features.'
//       },
//       {
//         role: 'user',
//         content: text
//       }
//     ],
//     max_tokens: 800
//   });

//   return response.choices[0].message.content;
// }
