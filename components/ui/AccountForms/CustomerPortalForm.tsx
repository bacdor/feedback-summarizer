'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { createStripePortal } from '@/utils/stripe/server';
import Link from 'next/link';
import Card from '@/components/ui/Card/Card';
import { Tables } from '@/types_db';
import Button from '../Button/Button';

type Subscription = Tables<'subscriptions'>;
type Price = Tables<'prices'>;
type Product = Tables<'products'>;

type SubscriptionWithPriceAndProduct = Subscription & {
  prices:
    | (Price & {
        products: Product | null;
      })
    | null;
};

interface Props {
  subscription: SubscriptionWithPriceAndProduct | null;
  payment: boolean | null;
}

export default function CustomerPortalForm({ subscription, payment }: Props) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true);
    const redirectUrl = await createStripePortal(currentPath);
    setIsSubmitting(false);
    return router.push(redirectUrl);
  };

  return (
    <Card
      title="Your Plan"
      description={
        subscription
          ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
          : payment
            ? // ? "Congratulations! You've unlocked unlitimited access with our Lifetime Plan!"
              "Congratulations! You've unlocked unlitimited access!"
            : 'You are not currently subscribed to any plan.'
      }
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          {payment ? (
            <p></p>
          ) : (
            <p className="pb-4 sm:pb-0">Manage your subscription.</p>
          )}
          <Button
            variant="slim"
            onClick={handleStripePortalRequest}
            loading={isSubmitting}
          >
            Open customer portal
          </Button>
        </div>
      }
    >
      <div className="mt-8 mb-4 text-xl font-semibold">
        {subscription ? (
          `${subscriptionPrice}/${subscription?.prices?.interval}`
        ) : payment ? (
          ''
        ) : (
          <Link href="/#pricing">Choose your plan</Link>
        )}
      </div>
    </Card>
  );
}
