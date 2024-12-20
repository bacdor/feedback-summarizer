import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import {
  getUserDetails,
  getSubscription,
  getUser,
  getSurveyResponses
} from '@/utils/supabase/queries';
import ResponsesTable from '@/components/ui/Analyzer/ResponsesTable';

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

  return (
    <section className="container mx-auto pb-32 p-4 bg-yellow">
      <ResponsesTable
        userId={user.id}
        surveyResponses={surveyResponsesForId || null}
      />
    </section>
  );
}
