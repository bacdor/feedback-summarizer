// components/ui/Hero.tsx
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function Hero() {
  return (
    <section
      className="bg-black text-zinc-200 pb-20 pt-20 min-h-screen"
      id="main"
    >
      <div className="container mx-auto text-center">
        <h1
          className={`text-4xl sm:text-7xl font-extrabold mb-20 transition-transform duration-400 transform hover:scale-105`}
        >
          Get your quotes faster 🚀
        </h1>
        <p
          className={`text-lg sm:text-2xl lg:w-1/2 mx-auto mb-8 transition-transform duration-400 transform hover:scale-105`}
        >
          Upload a <b>PDF document</b>, ask a question, and get the <b>quote</b>{' '}
          you need.
        </p>
        <div className="flex flex-col items-center space-y-4 mb-8 ">
          <FeatureItem text="AI powered tool" />
          <FeatureItem text="Lifetime access" />
          <FeatureItem text="Unlimited interaction" />
        </div>
        <Link href="/#pricing">
          <Button variant="slim" className="text-lg mb-8">
            Get Started
          </Button>
        </Link>
      </div>
    </section>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center space-x-2 transition-transform duration-400 transform hover:scale-105">
      <svg
        className="w-6 h-6 text-green-400"
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
      <p className="text-lg">{text}</p>
    </div>
  );
}
