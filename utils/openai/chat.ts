import OpenAI from 'openai';

const openai = new OpenAI();

export async function analyzeKeyThemes(text: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a feedback analyzer. You will be provided with users feedback about an app. ' +
          'Identify Key Themes. Focus on: ' +
          '1.Positive Feedback: Look for recurring comments about what you are doing well. ' +
          'This might include specific features, qualities, or processes that people appreciate. ' +
          '2.Negative Feedback: Identify the common complaints or suggestions for improvement. ' +
          'These are often areas where focus on making changes is needed. ' +
          '3.Suggestions: Note any recommendations or ideas for new features or approaches ' +
          'that the users propose.'
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

export async function categorizeFeedbackByType(text: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a feedback analyzer. You will be provided with users feedback about an app. ' +
          'Categorize feedback by type and provide summarization for each based on the following tips along with some examples. ' +
          'Product/Feature Feedback: What do people think about the features and usability of your app? ' +
          'Are there any feature requests or issues that are repeatedly mentioned? ' +
          'User Experience (UX): How easy is it for users to navigate your app? ' +
          'Are they frustrated by any specific parts of the interface or workflow? ' +
          'Performance Issues: Are users mentioning performance problems like speed, bugs, or crashes? ' +
          'Support and Communication: How do users feel about the level of support they are receiving? ' +
          'Are they satisfied with how quickly their issues are addressed?'
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

// export async function assessFeedbackSource(
//   text: string,
//   userCount: number,
//   nonUserCount: number
// ) {
//   const response = await openai.chat.completions.create({
//     model: 'gpt-4o-mini',
//     messages: [
//       {
//         role: 'system',
//         content:
//           'You are a feedback analyzer. ' +
//           'You will be provided with users feedback about an app and user counts. ' +
//           'Assess the feedback source. ' +
//           'Who provided the feedback? Different sources of feedback may carry different weights. ' +
//           'For example, feedback from paying customers may be more critical than from free users. ' +
//           'Feedback from power users: Are certain individuals giving more insightful feedback because they use the app heavily? ' +
//           'Consider segmenting feedback from these users for deeper analysis. ' +
//           'Analyze the proportion of feedback from users vs non-users based on the provided counts. ' +
//           'Determine if there are any significant differences in the feedback between these two groups.'
//       },
//       {
//         role: 'user',
//         content: `${text}\n\nUser Count: ${userCount}\nNon-User Count: ${nonUserCount}`
//       }
//     ],
//     max_tokens: 800
//   });

//   return response.choices[0].message.content;
// }
