'use client';

import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className="bg-zinc-800 text-zinc-100 py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-extrabold mb-4">Ready to Get Started?</h2>
        <p className="text-lg mb-8">Join others and save your time.</p>
        <Link href="/#pricing">
          {/* <Button variant="slim" className="text-lg">
            Sign Up Now
          </Button> */}
        </Link>
      </div>
    </section>
  );
}
