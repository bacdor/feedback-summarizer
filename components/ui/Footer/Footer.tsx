import Link from 'next/link';
import Image from 'next/image';

// import GitHub from '@/components/icons/GitHub';

export default function Footer() {
  return (
    <footer className="footer px-10 pt-12 pb-24 bg-zinc-900">
      <aside className="flex flex-col items-start">
        <Link
          href="/"
          className="flex items-center space-x-2 !focus:outline-none"
        >
          <Image
            src="/logo-pdf500.svg"
            alt="Citing App Logo"
            width={64}
            height={64}
          />
          <h3 className="text-3xl font-bold text-zinc-200">citing.app</h3>
        </Link>

        <p>
          Get in-text citation from PDF files easily. <br />
          Copyright &copy; {new Date().getFullYear()} - All rights reserved
        </p>
      </aside>

      <nav>
        <ul className="flex flex-col flex-initial md:flex-1">
          <li className="py-3 md:py-0 md:pb-4">
            <Link
              href="/"
              className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
            >
              Main
            </Link>
          </li>
          <li className="py-3 md:py-0 md:pb-4">
            <Link
              href="/#pricing"
              className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
            >
              Pricing
            </Link>
          </li>
        </ul>
      </nav>
      <nav>
        <ul className="flex flex-col flex-initial md:flex-1">
          <li className="py-3 md:py-0 md:pb-4">
            <p className="font-bold text-white transition duration-150 ease-in-out hover:text-zinc-200">
              LEGAL
            </p>
          </li>
          <li className="py-3 md:py-0 md:pb-4">
            <Link
              href="/privacy-policy"
              className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
            >
              Privacy Policy
            </Link>
          </li>
          <li className="py-3 md:py-0 md:pb-4">
            <Link
              href="/tos"
              className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
            >
              Terms of Use
            </Link>
          </li>
        </ul>
      </nav>
      {/* <nav>
        <ul className="flex flex-col flex-initial md:flex-1">
          <li className="py-3 md:py-0 md:pb-4">
            <p className="font-bold text-white transition duration-150 ease-in-out hover:text-zinc-200">
              SOCIAL
            </p>
          </li>
          <li className="py-3 md:py-0 md:pb-4">
            <a
              href="https://www.linkedin.com/in/dorian-bachlaj-82b92b181/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHub />
            </a>
          </li>
        </ul>
      </nav> */}
    </footer>
    // <footer className="mx-auto max-w-[1920px] px-6 bg-zinc-900">
    //   <div className="grid grid-cols-1 gap-8 py-12 text-white text-sm transition-colors duration-150 border-b lg:grid-cols-12 border-zinc-600 bg-zinc-900">
    //     <div className="col-span-1 lg:col-span-2">
    //       <Link href="/" className="flex items-center flex-initial md:mr-24">
    //         <span className="mr-2 border rounded-full border-zinc-700">
    //           <Logo />
    //         </span>
    //         <span>Quote it!</span>
    //       </Link>
    //       wefasd
    //     </div>
    //     <div className="col-span-1 lg:col-span-2">
    // <ul className="flex flex-col flex-initial md:flex-1">
    //   <li className="py-3 md:py-0 md:pb-4">
    //     <Link
    //       href="/"
    //       className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
    //     >
    //       Main
    //     </Link>
    //   </li>
    //   <li className="py-3 md:py-0 md:pb-4">
    //     <Link
    //       href="/#pricing"
    //       className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
    //     >
    //       Pricing
    //     </Link>
    //   </li>
    // </ul>
    //     </div>
    //     <div className="col-span-1 lg:col-span-2">
    // <ul className="flex flex-col flex-initial md:flex-1">
    //   <li className="py-3 md:py-0 md:pb-4">
    //     <p className="font-bold text-white transition duration-150 ease-in-out hover:text-zinc-200">
    //       LEGAL
    //     </p>
    //   </li>
    //   <li className="py-3 md:py-0 md:pb-4">
    //     <Link
    //       href="/privacy-policy"
    //       className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
    //     >
    //       Privacy Policy
    //     </Link>
    //   </li>
    //   <li className="py-3 md:py-0 md:pb-4">
    //     <Link
    //       href="/tos"
    //       className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
    //     >
    //       Terms of Use
    //     </Link>
    //   </li>
    // </ul>
    //     </div>
    //     <div className="flex items-start col-span-1 text-white lg:col-span-6 lg:justify-end">
    //       <div className="flex items-center h-10 space-x-6">
    //         <a
    //           aria-label="Github Repository"
    //           href="https://github.com/vercel/nextjs-subscription-payments"
    //         >
    //           <GitHub />
    //         </a>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="flex flex-col items-center text-xs justify-between py-2 space-y-4 md:flex-row bg-zinc-900">
    //     <div>
    //       <span>
    //         Copyright &copy; {new Date().getFullYear()} - All rights reserved
    //       </span>
    //     </div>
    //   </div>
    // </footer>
  );
}
