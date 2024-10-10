'use client';

import Link from 'next/link';
import { requestPasswordUpdate } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '../Button/Button';

// Define prop type with allowEmail boolean
interface ForgotPasswordProps {
  allowEmail: boolean;
  redirectMethod: string;
  disableButton?: boolean;
}

export default function ForgotPassword({
  allowEmail,
  redirectMethod,
  disableButton
}: ForgotPasswordProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, requestPasswordUpdate, router);
    setIsSubmitting(false);
  };

  return (
    <div className="my-8">
      <form
        noValidate={true}
        className="mb-4"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              placeholder="name@example.com"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="w-full p-3 rounded-md border"
            />
          </div>
          <Button
            variant="slim"
            type="submit"
            className="mt-1"
            loading={isSubmitting}
            disabled={disableButton}
          >
            Send Email
          </Button>
        </div>
      </form>
      <p>
        <Link href="/signin/password_signin" className="font-light text-sm">
          Sign in with email and password
        </Link>
      </p>
      {allowEmail && (
        <p>
          <Link href="/signin/email_signin" className="font-light text-sm">
            Sign in via magic link
          </Link>
        </p>
      )}
      <p>
        <Link href="/signin/signup" className="font-light text-sm">
          Don't have an account? Sign up
        </Link>
      </p>
    </div>
  );
}

// 'use client';

// import Button from '@/components/ui/Button';
// import { updatePassword } from '@/utils/auth-helpers/server';
// import { handleRequest } from '@/utils/auth-helpers/client';
// import { useRouter } from 'next/navigation';
// import React, { useState } from 'react';

// interface UpdatePasswordProps {
//   redirectMethod: string;
// }

// export default function UpdatePassword({
//   redirectMethod
// }: UpdatePasswordProps) {
//   const router = redirectMethod === 'client' ? useRouter() : null;
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     setIsSubmitting(true); // Disable the button while the request is being handled
//     await handleRequest(e, updatePassword, router);
//     setIsSubmitting(false);
//   };

//   return (
//     <div className="my-8">
//       <form
//         noValidate={true}
//         className="mb-4"
//         onSubmit={(e) => handleSubmit(e)}
//       >
//         <div className="grid gap-2">
//           <div className="grid gap-1">
//             <label htmlFor="password">New Password</label>
//             <input
//               id="password"
//               placeholder="Password"
//               type="password"
//               name="password"
//               autoComplete="current-password"
//               className="w-full p-3 rounded-md bg-zinc-800"
//             />
//             <label htmlFor="passwordConfirm">Confirm New Password</label>
//             <input
//               id="passwordConfirm"
//               placeholder="Password"
//               type="password"
//               name="passwordConfirm"
//               autoComplete="current-password"
//               className="w-full p-3 rounded-md bg-zinc-800"
//             />
//           </div>
//           <Button
//             variant="slim"
//             type="submit"
//             className="mt-1"
//             loading={isSubmitting}
//           >
//             Update Password
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }
