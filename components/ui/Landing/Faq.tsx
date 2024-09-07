'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How does your service work?',
    answer:
      'Our service works by providing users with easy-to-use tools for managing their tasks and projects efficiently. Sign up today to get started!'
  },
  {
    question: 'What is your pricing model?',
    answer:
      'We offer a range of pricing plans to suit different needs. You can choose between monthly and yearly billing options. Check out our Pricing section for more details.'
  },
  {
    question: 'Can I cancel my subscription?',
    answer:
      'Yes, you can cancel your subscription at any time through your account settings. If you have any issues, feel free to contact our support team.'
  },
  {
    question: 'How can I contact support?',
    answer:
      'You can contact our support team via email at support@example.com or through the contact form on our website.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-zinc-800 py-16" id="faq">
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
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
