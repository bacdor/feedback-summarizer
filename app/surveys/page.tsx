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

export default async function SurveysMainPage() {
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
    <section className="pb-32 pt-4 px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <DashboardSurveyCreator />
        </div>
        <div className="md:col-span-3">
          <DashboardSurveyList
            userId={user.id}
            surveyResponses={surveyResponses}
          />
        </div>
      </div>
    </section>
  );
}
