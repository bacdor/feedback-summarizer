import { Metadata } from 'next';
import Footer from '@/components/ui/Footer/Footer';
import Navbar from '@/components/ui/Navbar/Navbar';
import { Toaster } from '@/components/ui/Toasts/toaster';
import { Poppins, Odor_Mean_Chey } from 'next/font/google';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import 'styles/main.css';

const title = 'Feedback Summarizer';
const description = '';

const poppins = Poppins({
  weight: ['400', '700'],
  subsets: ['latin']
});

const odorMeanChey = Odor_Mean_Chey({
  weight: ['400'],
  subsets: ['khmer'],
  variable: '--font-odor-mean-chey'
});

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description
  }
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${poppins.className} ${odorMeanChey.variable}`}>
        <Navbar />
        <main
          id="skip"
          className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]"
        >
          {children}
        </main>
        <Footer />
        <Suspense fallback={<div>Loading...</div>}>
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}
