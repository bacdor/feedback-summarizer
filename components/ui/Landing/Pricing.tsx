// 'use client';

// import Button from '@/components/ui/Button';
// import type { Tables } from '@/types_db';
// import { getStripe } from '@/utils/stripe/client';
// import { checkoutWithStripe } from '@/utils/stripe/server';
// import { getErrorRedirect } from '@/utils/helpers';
// import { User } from '@supabase/supabase-js';
// import cn from 'classnames';
// import { useRouter, usePathname } from 'next/navigation';
// import { useState } from 'react';

// type Subscription = Tables<'subscriptions'>;
// type Product = Tables<'products'>;
// type Price = Tables<'prices'>;
// interface ProductWithPrices extends Product {
//   prices: Price[];
// }
// interface PriceWithProduct extends Price {
//   products: Product | null;
// }
// interface SubscriptionWithProduct extends Subscription {
//   prices: PriceWithProduct | null;
// }

// interface Props {
//   user: User | null | undefined;
//   products: ProductWithPrices[];
//   subscription: SubscriptionWithProduct | null;
// }

// export default function Pricing({ user, products, subscription }: Props) {
//   const router = useRouter();
//   const [priceIdLoading, setPriceIdLoading] = useState<string>();
//   const currentPath = usePathname();

//   const handleStripeCheckout = async (price: Price) => {
//     setPriceIdLoading(price.id);

//     if (!user) {
//       setPriceIdLoading(undefined);
//       return router.push('/signin/signup');
//     }

//     const { errorRedirect, sessionId } = await checkoutWithStripe(
//       price,
//       currentPath
//     );

//     if (errorRedirect) {
//       setPriceIdLoading(undefined);
//       return router.push(errorRedirect);
//     }

//     if (!sessionId) {
//       setPriceIdLoading(undefined);
//       return router.push(
//         getErrorRedirect(
//           currentPath,
//           'An unknown error occurred.',
//           'Please try again later or contact a system administrator.'
//         )
//       );
//     }

//     const stripe = await getStripe();
//     stripe?.redirectToCheckout({ sessionId });

//     setPriceIdLoading(undefined);
//   };

//   if (!products.length) {
//     return (
//       <section className="bg-zinc-800 pb-32 text-zinc-100" id="pricing">
//         <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
//           <div className="sm:flex sm:flex-col sm:align-center"></div>
//           <p className="text-4xl font-extrabold sm:text-center sm:text-6xl">
//             Oops! No subscription pricing plans found. We'll fix that for you
//             soon!
//           </p>
//         </div>
//       </section>
//     );
//   } else {
//     return (
//       <section className="bg-zinc-800 pb-16 text-zinc-100" id="pricing">
//         <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
//           <div className="sm:flex sm:flex-col sm:align-center">
//             <h1 className="text-2xl font-extrabold sm:text-center sm:text-3xl">
//               Pricing Plans
//             </h1>
//             <p className="max-w-2xl m-auto mt-5 text-l text-zinc-200 sm:text-center sm:text-xl">
//               <b>Pay only once!</b> Choose our <b>Lifetime Deal</b> and enjoy
//               DocuQuote forever.
//             </p>
//           </div>
//           <div className="mt-12 space-y-0 sm:mt-16 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
//             {products.map((product) =>
//               product?.prices?.map((price) => {
//                 const priceString = new Intl.NumberFormat('en-US', {
//                   style: 'currency',
//                   currency: price.currency!,
//                   minimumFractionDigits: 0
//                 }).format((price?.unit_amount || 0) / 100);
//                 return (
//                   <div
//                     key={`${product.id}-${price.interval}`}
//                     className={cn(
//                       'flex flex-col rounded-lg shadow-sm divide-y divide-indigo-600 bg-indigo-900',
//                       {
//                         'border border-indigo-500': subscription
//                           ? product.name ===
//                             subscription?.prices?.products?.name
//                           : product.name === 'Freelancer'
//                       },
//                       'flex-1',
//                       'basis-1/3',
//                       'max-w-xs'
//                     )}
//                   >
//                     <div className="p-6">
//                       <h2 className="text-3xl pb-6 font-semibold leading-6 text-white">
//                         {product.name}
//                       </h2>
//                       <div className="mt-4 text-lg text-zinc-300">
//                         {product.description
//                           ? product.description
//                               .split('|')
//                               .map((line, index) => (
//                                 <p key={index} className="flex items-center">
//                                   <span className="text-zinc-300 mr-2">
//                                     <svg
//                                       className="w-6 h-6 text-zinc-300"
//                                       fill="none"
//                                       stroke="currentColor"
//                                       viewBox="0 0 24 24"
//                                       xmlns="http://www.w3.org/2000/svg"
//                                     >
//                                       <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth="2"
//                                         d="M5 13l4 4L19 7"
//                                       ></path>
//                                     </svg>
//                                   </span>
//                                   <span>{line.trim()}</span>
//                                 </p>
//                               ))
//                           : 'No description available.'}
//                       </div>
//                       <p className="mt-8">
//                         <span className="text-5xl font-extrabold white">
//                           {priceString}
//                         </span>
//                         <span className="text-base font-medium text-zinc-100">
//                           /{price.interval ? price.interval : 'lifetime'}
//                         </span>
//                       </p>
//                       <Button
//                         variant="slim"
//                         type="button"
//                         loading={priceIdLoading === price.id}
//                         onClick={() => handleStripeCheckout(price)}
//                         className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white rounded-md hover:bg-indigo-900"
//                       >
//                         {subscription ? 'Manage' : 'Subscribe'}
//                       </Button>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </section>
//     );
//   }
// }

'use client';

import Button from '@/components/ui/Button';
import type { Tables } from '@/types_db';
import { getStripe } from '@/utils/stripe/client';
import { checkoutWithStripe } from '@/utils/stripe/server';
import { getErrorRedirect } from '@/utils/helpers';
import { User } from '@supabase/supabase-js';
import cn from 'classnames';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type Price = Tables<'prices'>;
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

export default function Pricing({ user, products, subscription }: Props) {
  const router = useRouter();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const currentPath = usePathname();

  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return router.push('/signin/signup');
    }

    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      currentPath
    );

    if (errorRedirect) {
      setPriceIdLoading(undefined);
      return router.push(errorRedirect);
    }

    if (!sessionId) {
      setPriceIdLoading(undefined);
      return router.push(
        getErrorRedirect(
          currentPath,
          'An unknown error occurred.',
          'Please try again later or contact a system administrator.'
        )
      );
    }

    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });

    setPriceIdLoading(undefined);
  };

  if (!products.length) {
    return (
      <section className="bg-zinc-800 pb-32 text-zinc-100" id="pricing">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p className="text-4xl font-extrabold sm:text-center sm:text-6xl">
            Oops! No subscription pricing plans found. We'll fix that for you
            soon!
          </p>
        </div>
      </section>
    );
  } else {
    return (
      <section className="bg-zinc-800 pb-16 text-zinc-100" id="pricing">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center">
            <h1 className="text-2xl font-extrabold sm:text-center sm:text-3xl">
              Pricing Plans
            </h1>
            <p className="max-w-2xl m-auto mt-5 text-l text-zinc-200 sm:text-center sm:text-xl">
              <b>Pay only once!</b> Choose our <b>Lifetime Deal</b> and enjoy
              DocuQuote forever.
            </p>
          </div>
          <div className="mt-12 space-y-0 sm:mt-16 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
            {products.map((product) =>
              product?.prices?.map((price) => {
                const priceString = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: price.currency!,
                  minimumFractionDigits: 0
                }).format((price?.unit_amount || 0) / 100);

                return (
                  <div
                    key={`${product.id}-${price.interval}`}
                    className={cn(
                      'relative flex flex-col rounded-lg shadow-sm divide-y divide-indigo-600 bg-indigo-900',
                      {
                        // Apply border to popular items
                        'border-4 border-yellow-400': price.interval === null,
                        'border border-indigo-500': subscription
                          ? product.name ===
                            subscription?.prices?.products?.name
                          : product.name === 'Freelancer'
                      },
                      'flex-1',
                      'basis-1/3',
                      'max-w-xs'
                    )}
                  >
                    {/* Popular badge */}
                    {price.interval === null && (
                      <div className="absolute top-0 right-0 bg-yellow-400 text-black px-2 py-1 text-xs font-semibold rounded-bl-lg">
                        Popular
                      </div>
                    )}

                    <div className="p-6">
                      <h2 className="text-3xl pb-6 font-semibold leading-6 text-white">
                        {product.name}
                      </h2>
                      <div className="mt-4 text-lg text-zinc-300">
                        {product.description
                          ? product.description
                              .split('|')
                              .map((line, index) => (
                                <p key={index} className="flex items-center">
                                  <span className="text-zinc-300 mr-2">
                                    <svg
                                      className="w-6 h-6 text-zinc-300"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                      ></path>
                                    </svg>
                                  </span>
                                  <span>{line.trim()}</span>
                                </p>
                              ))
                          : 'No description available.'}
                      </div>
                      <p className="mt-8">
                        <span className="text-5xl font-extrabold white">
                          {priceString}
                        </span>
                        <span className="text-base font-medium text-zinc-100">
                          /{price.interval ? price.interval : 'lifetime'}
                        </span>
                      </p>
                      <Button
                        variant="slim"
                        type="button"
                        loading={priceIdLoading === price.id}
                        onClick={() => handleStripeCheckout(price)}
                        className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white rounded-md hover:bg-indigo-900"
                      >
                        {subscription ? 'Manage' : 'Subscribe'}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    );
  }
}
