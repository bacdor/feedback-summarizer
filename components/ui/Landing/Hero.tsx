// components/ui/Hero.tsx
import Link from 'next/link';
import s from './Hero.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

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
            <h1 className="text-5xl md:text-8xl font-bold mb-4">
              UNDERSTAND & GROW
            </h1>
            <p className="text-xl text-[#948C88]  leading-none">
              Create surveys, collect valuable feedback insights, and leverage
              AI-powered analysis to grow your business and customer
              satisfaction.
            </p>
            <FontAwesomeIcon
              icon={faAngleDown}
              size="4x"
              className="mt-4 mb-16 hang-animation"
            />
            <div className="flex flex-col items-center justify-center fade-in">
              <Link
                href="/signin/email_signin"
                className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-white bg-orange-500 rounded-full shadow-md group"
              >
                <span className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out transform translate-x-full group-hover:translate-x-0 bg-white opacity-20"></span>
                <span className="relative z-10 font-bold">Subscribe for free</span>
              </Link>
              <p className="text-xs text-[#948C88] mt-2 text-center">
                I'll never share your info with anyone
              </p>
            </div>
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
