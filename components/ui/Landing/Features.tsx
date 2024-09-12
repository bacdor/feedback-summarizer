'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function Features() {
  return (
    <section className="bg-indigo-900 py-10 sm:py-16" id="features">
      <div className="container mx-auto px-4 sm:px-0 w-full sm:w-3/4">
        {/* Centered Section */}
        <div className="lg:w-full text-center text-zinc-200 mx-auto">
          {/* Text Section */}
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 sm:mb-6 text-left">
            Easy to use app
          </h2>
          <ul className="list-disc list-inside text-lg sm:text-xl mb-6 sm:mb-10 text-left">
            <li>Choose a journal, magazine, or any other document</li>
            <li>Upload it in a PDF format</li>
            <li>
              Ask{' '}
              <Link href="/#pricing">
                <u>unlimited</u>
              </Link>{' '}
              amount of questions
            </li>
            <li>Copy and paste the extracted citation</li>
            <li>
              Don't forget to <u>cite the author!</u>
            </li>
          </ul>

          {/* Carousel Section */}
          <div className="carousel carousel-center rounded-box mx-auto max-w-full sm:max-w-6xl">
            <FeatureItem src="/car1.svg" />
            <FeatureItem src="/car2.svg" />
            <FeatureItem src="/car3.svg" />
            <FeatureItem src="/car4.svg" />
            <FeatureItem src="/car5.svg" />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ src }: { src: string }) {
  return (
    <div className="carousel-item w-2/3 sm:w-1/4">
      <Image
        src={src}
        alt="a screenshot that shows how the app works"
        width={500}
        height={500}
        className="mx-auto"
      />
    </div>
  );
}
