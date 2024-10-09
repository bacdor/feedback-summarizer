import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import {
  getUserDetails,
  getSubscription,
  getUser,
  getSurveyResponses
} from '@/utils/supabase/queries';
import OpenAI from 'openai';
import ResponsesTable from '@/components/ui/Analyzer/ResponsesTable';
import KeyThemesCard from '@/components/ui/AnalyzerAIForms/KeyThemesCard';

export default async function AnalyzerDetailPage({
  params
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const [user, userDetails, subscription, surveyResponses] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase),
    getSubscription(supabase),
    getSurveyResponses(supabase)
  ]);

  if (!user) {
    return redirect('/signin');
  }

  // if (!subscription && !userDetails.avatar_url) {
  //   return redirect('/#pricing');
  // }

  const { id } = params;

  // Extracts questions related only to accessed survey
  const surveyResponsesForId = surveyResponses?.filter(
    (response) => response.survey_id === id
  );

  // Extract questions and answers from surveyResponses
  const extractQuestionsAndAnswers = (surveyResponsesForId: any[]) => {
    let text = '';

    surveyResponsesForId.forEach(
      (response: { responses?: { question: string; answer: string }[] }) => {
        if (response.responses) {
          const responses = response.responses; // No need to parse, since it's already an array of objects
          responses.forEach(({ question, answer }) => {
            text += `Question: ${question}\n`;
            text += `Answer: ${answer || 'No answer provided'}\n\n`;
          });
        }
      }
    );

    return text;
  };

  // const questionsAndAnswersText = extractQuestionsAndAnswers(
  //   surveyResponsesForId || []
  // );

  // const openai = new OpenAI();

  // const response = await openai.chat.completions.create({
  //   model: 'gpt-4o-mini',
  //   messages: [
  //     {
  //       role: 'system',
  //       content:
  //         'You are a feedback analyzer. You will be provided with users feedback about an app. Identify Key Themes. Focus on: 1.Positive Feedback: Look for recurring comments about what you’re doing well. This might include specific features, qualities, or processes that people appreciate. 2.Negative Feedback: Identify the common complaints or suggestions for improvement. These are often areas where focus on making changes is needed. 3.Suggestions: Note any recommendations or ideas for new features or approaches that the users propose.'
  //     },
  //     {
  //       role: 'user',
  //       content: ''
  //     }
  //   ],
  //   max_tokens: 800
  // });

  // const chatOutput = response.choices[0].message.content; // Get chat output

  return (
    <section className="container mx-auto pb-32 p-4 bg-yellow">
      <KeyThemesCard /> {/* Pass chat output as prop */}
      <ResponsesTable
        userId={user.id}
        surveyResponses={surveyResponsesForId || null}
      />
      <div>
        <textarea
          value={extractQuestionsAndAnswers(surveyResponsesForId || [])}
          readOnly
        />{' '}
        {/* Display chat output in a text box */}
      </div>
    </section>
  );
}
