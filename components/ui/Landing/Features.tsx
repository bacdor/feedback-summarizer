'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function Features() {
  return (
    <section className="bg-indigo-900 py-16" id="features">
      <div className="container w-3/4 mx-auto">
        {/* Centered Section */}
        <div className="lg:w-full text-center text-zinc-200 mx-auto">
          {/* Text Section */}
          <h2 className="text-5xl font-extrabold mb-6 text-left">
            Easy to use app
          </h2>
          <ul className="list-disc list-inside text-xl mb-10 text-left">
            <li>Choose a journal, magazine or any other document</li>
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
          <div className="carousel carousel-center rounded-box mx-auto max-w-6xl">
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
    <div className="carousel-item">
      <Image
        src={src}
        alt="a screenshot that shows how the app works"
        width={500}
        height={500}
      />
    </div>
  );
}
