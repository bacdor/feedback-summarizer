import OpenAI from 'openai';

const openai = new OpenAI();

// analyzePositiveThemes,
// analyzeNegativeThemes,
// categorizeFeedbackByType,
// categorizeFeedbackByTone,
// performQuantitativeAnalysis, // later
// analyzeTrendsOverTime, // later
// compareWithCompetitors, // later
// alignWithGoals,
// assessActionability // later

export async function analyzePositiveThemes(text: string) {
  const systemPrompt = `
      You are an expert in sentiment analysis and thematic extraction. Your job is to analyze user feedback, focusing specifically on recurring positive themes.
      
      For each question-answer pair, identify:
      1. Positive themes or elements.
      2. Recurring positive themes across multiple responses.
      
      Your analysis should group similar responses and highlight what users repeatedly praise or appreciate.
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
        content: text
      }
    ],
    temperature: 0.2,
    max_tokens: 800
  });

  return response.choices[0].message.content;
}

export async function analyzeNegativeThemes(text: string) {
  const systemPrompt = `
      You are an expert in sentiment analysis and thematic extraction. Your job is to analyze user feedback, focusing specifically on recurring negative themes.

      For each question-answer pair, identify:
      1. Negative themes or points of dissatisfaction.
      2. Recurring negative themes across multiple responses.

      Your analysis should group similar responses and highlight common areas where users express frustration or criticize the product or experience. Be concise but thorough in your thematic analysis.
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
        content: text
      }
    ],
    temperature: 0.2,
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
    temperature: 0.2,
    max_tokens: 800
  });

  return response.choices[0].message.content;
}

export async function categorizeFeedbackByTone(text: string) {
  const systemPrompt = `
      You are an expert in sentiment analysis and thematic extraction. Your job is to analyze user feedback and categorize it into three types: positive, negative, or neutral.

      For each question-answer pair:
      1. Determine if the feedback is positive, negative, or neutral.
      2. Provide a brief explanation of why the feedback falls into that category.
      3. Extract themes from the feedback, focusing on recurring elements in both positive and negative categories.

      Your analysis should clearly separate positive, negative, and neutral feedback, and for recurring themes in both positive and negative categories, group similar responses together.
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
        content: text
      }
    ],
    temperature: 0.2,
    max_tokens: 800
  });

  return response.choices[0].message.content;
}

export async function alignWithGoals(text: string) {
  const systemPrompt = `
      You are an expert in sentiment analysis and thematic extraction. Your job is to analyze user feedback and categorize it into three types: positive, negative, or neutral.

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
        content: text
      }
    ],
    temperature: 0.2,
    max_tokens: 800
  });

  return response.choices[0].message.content;
}
