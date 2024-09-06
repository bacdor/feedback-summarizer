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
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                onClick={() => toggleOpen(index)}
                className="w-full text-left bg-white p-4 rounded-lg shadow-md focus:outline-none"
              >
                <h3 className="text-xl font-semibold">{faq.question}</h3>
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
