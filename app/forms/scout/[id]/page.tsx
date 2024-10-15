import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import {
  getUserDetails,
  getSubscription,
  getUser,
  getSurveyResponses,
  getSurveys
} from '@/utils/supabase/queries';
import AnalyzeCard from '@/components/ui/Analyzer/AnalyzeCard';

export default async function FormScoutPage({
  params
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const [user, userDetails, subscription, surveyResponses, surveys] =
    await Promise.all([
      getUser(supabase),
      getUserDetails(supabase),
      getSubscription(supabase),
      getSurveyResponses(supabase),
      getSurveys(supabase)
    ]);

  if (!user) {
    return redirect('/signin');
  }

  const { id } = params;

  // Extracts questions related only to accessed survey
  const surveyResponsesForId = surveyResponses?.filter(
    (response) => response.survey_id === id
  );

  const surveyForId = surveys?.filter((s) => s.id === id);

  return (
    <section className="container mx-auto pb-32 p-4 bg-yellow">
      {surveyForId && surveyForId.length > 0 && (
        <AnalyzeCard
          surveyResponsesForId={surveyResponsesForId}
          survey={surveyForId[0]}
        />
      )}
    </section>
  );
}
