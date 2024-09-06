import { createClient } from '@/utils/supabase/server';
import {
  getProducts,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';
import Pricing from '@/components/ui/Landing/Pricing';
import Hero from '@/components/ui/Landing/Hero';
import Features from '@/components/ui/Landing/Features';
import FAQ from '@/components/ui/Landing/Faq';
import CallToAction from '@/components/ui/Landing/CallToAction';

export default async function PricingPage() {
  const supabase = createClient();
  const [user, products, subscription] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
    getSubscription(supabase)
  ]);

  return (
    <>
      <Hero />
      <Features />
      <Pricing
        user={user}
        products={products ?? []}
        subscription={subscription}
      />
      <FAQ />
      <CallToAction />
    </>
  );
}
