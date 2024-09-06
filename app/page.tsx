import { createClient } from '@/utils/supabase/server';
import {
  getProducts,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';
import Pricing from '@/components/ui/Landing/Pricing';
import Hero from '@/components/ui/Landing/Hero';

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
      <Pricing
        user={user}
        products={products ?? []}
        subscription={subscription}
      />
    </>
  );
}
