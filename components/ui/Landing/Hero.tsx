'use client';

import Button from '@/components/ui/Button';

export default function Hero() {
  return (
    <section className="bg-black text-white py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-extrabold mb-4">
          Welcome to Our Service!
        </h1>
        <p className="text-xl mb-8">
          Simplifying your work with our product. Get started today!
        </p>
        <Button variant="slim" className="text-lg">
          Get Started
        </Button>
      </div>
    </section>
  );
}
