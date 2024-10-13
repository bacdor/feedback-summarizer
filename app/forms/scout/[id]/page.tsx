import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import {
  getUserDetails,
  getSubscription,
  getUser,
  getSurveyResponses
} from '@/utils/supabase/queries';
import AnalyzeCard from '@/components/ui/Analyzer/AnalyzeCard';

export default async function FormScoutPage({
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

  const { id } = params;

  // Extracts questions related only to accessed survey
  const surveyResponsesForId = surveyResponses?.filter(
    (response) => response.survey_id === id
  );

  // Extract questions and answers from surveyResponses
  const extractQuestionsAndAnswers = (surveyResponsesForId: any[]) => {
    const formattedResponses = surveyResponsesForId.map((response) => ({
      email: response.email || 'No email provided',
      submitted_at: response.submitted_at
        ? new Date(response.submitted_at).toISOString().split('T')[0]
        : 'No submission date provided',
      responses:
        response.responses?.map(
          ({
            question_text,
            answer,
            question_type
          }: {
            question_text: string;
            answer: string | null;
            question_type: string;
          }) => ({
            question_text,
            answer: answer || 'No answer provided',
            question_type
          })
        ) || []
    }));

    return JSON.stringify(formattedResponses);
  };

  const questionsAndAnswersJson = extractQuestionsAndAnswers(
    surveyResponsesForId || []
  );

  return (
    <section className="container mx-auto pb-32 p-4 bg-yellow">
      <AnalyzeCard questionsAndAnswersJson={questionsAndAnswersJson} />
      <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
        <code>{questionsAndAnswersJson}</code>
      </pre>
    </section>
  );
}
