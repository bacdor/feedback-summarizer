'use client';

import Button from '@/components/ui/Button';

export default function CallToAction() {
  return (
    <section className="bg-zinc-800 text-white py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-extrabold mb-4">Ready to Get Started?</h2>
        <p className="text-lg mb-8">
          Join thousands of satisfied customers using our product.
        </p>
        <Button variant="slim" className="text-lg">
          Sign Up Now
        </Button>
      </div>
    </section>
  );
}
