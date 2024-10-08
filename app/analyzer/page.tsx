import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import {
  getUserDetails,
  getSubscription,
  getUser,
  getSurveyResponses
} from '@/utils/supabase/queries';
import DashboardSurveyCreator from '@/components/ui/Dashboard/DashboardSurveyCreator';
import DashboardSurveyList from '@/components/ui/Dashboard/DashbaordSurveyList';
import SurveyTable from '@/components/ui/Analyzer/SurveyTable';

export default async function DashboardPage() {
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

  return (
    <section className="container mx-auto pb-32 p-4 bg-yellow">
      <SurveyTable userId={user.id} surveyResponses={surveyResponses} />
      {/* <DashboardSurveyCreator /> */}
    </section>
  );
}
