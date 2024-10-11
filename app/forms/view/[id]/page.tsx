import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import {
  getUser,
  getSurveys,
  getSurveyQuestions
} from '@/utils/supabase/queries';
import SurveyDetailsDisplayPage from '@/components/ui/ReposponseForms/SurveyDetailsDisplayPage';
import SurveyResponseForm from '@/components/ui/ReposponseForms/SurveyResponsesManager';
import Link from 'next/link';

export default async function FormResponsePage({
  params
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const [user, surveys, surveyQuestions] = await Promise.all([
    getUser(supabase),
    getSurveys(supabase),
    getSurveyQuestions(supabase)
  ]);

  const { id } = params;
  const survey = surveys?.find((s) => s.id === id);

  // Extracts questions related only to accessed survey
  const surveyQuestionsForId = surveyQuestions?.filter(
    (question) => question.survey_id === id
  );

  if (!surveyQuestionsForId) {
    throw new Error('Failed to fetch survey questions');
  }

  if (!user) {
    return redirect('/signin');
  }

  if (!surveys) {
    throw new Error('Failed to fetch surveys');
  }

  if (!survey) {
    return <div>Survey not found</div>;
  }

  return (
    <section className="pb-32 bg-[var(--color-background)]">
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
        <Link
          href="/forms"
          className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-secondary)] transition-colors relative group"
        >
          <span className="text-2xl sm:text-4xl font-bold">&#8617;</span>
          <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Return to Scout Dashboard
          </span>
        </Link>
      </div>
      <div className="p-4">
        <SurveyDetailsDisplayPage
          surveyTitle={survey.name}
          surveyDescription={survey.description}
        />
        <SurveyResponseForm
          surveyId={survey.id}
          surveyQuestions={surveyQuestionsForId}
        />
      </div>
    </section>
  );
}
