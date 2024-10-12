'use client';

import Link from 'next/link';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import s from './Navbar.module.css';

interface NavlinksProps {
  user?: any;
}

export default function Navlinks({ user }: NavlinksProps) {
  const router = getRedirectMethod() === 'client' ? useRouter() : null;
  const pathname = usePathname();

  // Return an empty div if the current URL contains '/forms/r'
  if (pathname.includes('/forms/r') || pathname.includes('/forms/view')) {
    return <div />;
  }

  return (
    <div className="max-w-6xl px-6 mx-auto">
      <div className="relative flex flex-row justify-between align-center">
        <div className="flex items-center">
          <Link href="/" className={s.logo} aria-label="Logo">
            <Image src="/logo-pdf500.svg" alt="Logo" width={40} height={40} />
          </Link>
        </div>
        <div className="flex items-center flex-2">
          <nav className="space-x-2 lg:block">
            {user && (
              <>
                <Link href="/forms" className={s.link}>
                  Scout
                </Link>
                <Link href="/account" className={s.link}>
                  Account
                </Link>
              </>
            )}
            <Link href="/#pricing" className={s.link}>
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex justify-end py-3 space-x-8">
          {user ? (
            <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
              <input type="hidden" name="pathName" value={pathname} />
              <button type="submit" className={s.link}>
                Sign out
              </button>
            </form>
          ) : (
            <Link href="/signin/email_signin" className={s.link}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
