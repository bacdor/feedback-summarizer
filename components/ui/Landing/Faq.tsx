'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How does it work?',
    answer:
      'DocuQuote allows you to interact with any PDF file. Simply upload your document, and the app will analyze the text to answer your questions, extracting relevant citations related to your topic.'
  },
  {
    question: 'How to get the citation I need?',
    answer:
      'Simply ask a question after uploading a PDF and a citation related to your topic will be extracted.'
  },
  {
    question: 'Can I use extracted quotes in my essay?',
    answer:
      'Yes, of course! Just remember to provide proper in-text citations in your work to avoid plagiarism.'
  },
  {
    question: 'What is the "lifetime deal" plan?',
    answer:
      'Lifetime Deal is our special offer for dedicated users. You pay only one time to get access to all DocuQuote funcionalities for the lifetime.'
  },
  {
    question: 'Can I cancel my subscription?',
    answer:
      'Yes, if you choose to use weekly plan, you can cancel your subscription at any time through your account settings. If you have any issues, feel free to reach out.'
  },
  {
    question: 'How can I contact support?',
    answer:
      'You can contact our support team via email at bacdor.development@gmail.com or reach out directly on LinkedIn, link provided below.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-zinc-800 py-16 text-zinc-100" id="faq">
      <div className="container mx-auto w-full lg:w-3/4">
        <h2 className="text-3xl text-left mb-10">
          <span className="font-extrabold">FAQ:</span>{' '}
          <span className="font-bold">Frequently Asked Questions</span>
        </h2>
        <div className="mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                onClick={() => toggleOpen(index)}
                className="w-full text-left p-4 rounded-lg shadow-md focus:outline-none"
              >
                <h3 className="text-lg font-semibold">
                  <span className="mr-2">+</span> {faq.question}
                </h3>
              </button>
              {openIndex === index && (
                <div className="mt-2 p-4 bg-white rounded-lg shadow-md">
                  <p className="text-zinc-800">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
