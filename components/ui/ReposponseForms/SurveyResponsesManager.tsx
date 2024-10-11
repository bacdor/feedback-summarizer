'use client';

import { UUID } from 'crypto';
import ResponseCard from './ResponseCard';
import { useEffect, useState } from 'react';
import Button from '../Button/Button';

interface Props {
  surveyId: UUID;
  surveyQuestions: any[] | null;
}

export default function SurveyResponsesManager({
  surveyId,
  surveyQuestions
}: Props) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission state
  const [isViewMode, setIsViewMode] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);

  // Function to determine whether in view mode
  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname.includes('/forms/view')) {
      setIsViewMode(true);
    }
  }, []);

  // Function to handle response update from ResponseCard
  const handleResponseChange = (
    questionId: string,
    question_type: string,
    question_text: string,
    answer: string
  ) => {
    setResponses((prevResponses) => {
      const existingResponseIndex = prevResponses.findIndex(
        (response) => response.question_id === questionId
      );

      if (existingResponseIndex !== -1) {
        // Update the existing response
        const updatedResponses = [...prevResponses];
        updatedResponses[existingResponseIndex].answer = answer;
        return updatedResponses;
      } else {
        // Add a new response
        return [
          ...prevResponses,
          { question_id: questionId, question_type, question_text, answer }
        ];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewMode) {
      alert('This form is read-only and cannot be submitted.');
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch('/api/survey-responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          surveyId,
          email,
          responses
        })
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const data = await response.json();
      console.log('Survey submitted:', data);

      // Set form as submitted
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Conditionally render the thank you message or the form
  if (isSubmitted) {
    return (
      <div className="text-center p-6">
        <h1 className="text-2xl font-bold">Thank you for your submission!</h1>
        <p className="mt-4">We appreciate your feedback.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="w-full max-w-3xl m-auto my-1 border rounded-md bg-white">
        <div className="px-7 py-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#222] pb-4"
          >
            Email*
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter your email"
            required
          />
        </div>
      </div>

      {surveyQuestions &&
        surveyQuestions.map((question) => (
          <div key={question.id}>
            <ResponseCard
              surveyQuestion={question}
              onResponseChange={handleResponseChange}
            />
          </div>
        ))}
      <div className="w-full max-w-3xl mx-auto">
        <Button
          variant="slim"
          type="submit"
          className="mt-1 w-full"
          loading={isLoading}
          disabled={isLoading || isViewMode}
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
