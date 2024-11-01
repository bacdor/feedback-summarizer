// components/ui/Hero.tsx
import Link from 'next/link';
import s from './Hero.module.css';

export default function Hero() {
  return (
    <section
      // className="bg-gradient-to-tr from-[#FAF0E6] to-[#f0f8ff] pt-40 mt-[-64]"
      className={s.root}
      id="main"
    >
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0 md:-mt-32">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to Feedback Summarizer
            </h1>
            <p className="text-xl text-[#948C88] mb-16">
              Simplify your feedback process with AI-powered summaries
            </p>
            <Link
              href="/signin/email_signin"
              className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-white bg-orange-500 rounded-full shadow-md group"
            >
              <span className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out transform translate-x-full group-hover:translate-x-0 bg-white opacity-20"></span>
              <span className="relative z-10">bla bla call to action</span>
            </Link>
            <p className="text-sm text-[#948C88] mt-2">
              I'll never share your info with anyone
            </p>
          </div>
          <div className="md:w-1/2">
            <img
              src="/bear.webp"
              alt="Friendly Bear"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// className="bg-[#FAF0E6] pb-20 pt-20"
