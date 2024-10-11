import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import {
  getUser,
  getSurveys,
  getSurveyQuestions
} from '@/utils/supabase/queries';
import SurveySingleManager from '@/components/ui/SurveyForms/SurveySingleManager';
import SurveyQuestionsManager from '@/components/ui/SurveyForms/SurveyQuestionsManager';

export default async function FormViewPage({
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

  if (!user) {
    return redirect('/signin');
  }

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
    <section className="pb-32 bg-[var-(--color-background)]">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-2xl font-extrabold text-[#222] sm:text-center sm:text-4xl">
            Form Creator
          </h1>
        </div>
      </div>
      <div className="p-4">
        <SurveySingleManager
          surveyId={survey.id}
          surveyTitle={survey.name}
          surveyDescription={survey.description}
        />
        <SurveyQuestionsManager
          surveyId={survey.id}
          surveyQuestions={surveyQuestionsForId}
        />
      </div>
    </section>
  );
}
