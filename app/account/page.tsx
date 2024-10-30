import CustomerPortalForm from '@/components/ui/AccountForms/CustomerPortalForm';
import EmailForm from '@/components/ui/AccountForms/EmailForm';
import NameForm from '@/components/ui/AccountForms/NameForm';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import {
  getUserDetails,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';

export default async function Account() {
  const supabase = createClient();
  const [user, userDetails, subscription] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase),
    getSubscription(supabase)
  ]);

  if (!user) {
    return redirect('/signin');
  }

  return (
    <section className="pb-32">
      <div className="max-w-3xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 sm:pb-0 lg:px-8">
        <div className="sm:align-left sm:flex sm:flex-col">
          <h1 className="text-2xl font-extrabold text-[var(--color-dark)] sm:text-left sm:text-4xl">
            Your Account
          </h1>
        </div>
      </div>
      <div className="p-4">
        <CustomerPortalForm
          subscription={subscription}
          payment={userDetails?.avatar_url}
        />
        {/* <NameForm userName={userDetails?.full_name ?? ''} /> */}
        {/* <EmailForm userEmail={user.email} /> */}
      </div>
    </section>
  );
}
