'use client';

import { UUID } from 'crypto';
import ResponseCard from './ResponseCard';
import { useState } from 'react';

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
  const [responses, setResponses] = useState<any[]>([]);

  // Function to handle response update from ResponseCard
  const handleResponseChange = (
    questionId: string,
    question: string,
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
          { question_id: questionId, question, answer }
        ];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          placeholder="Enter your email"
          required
        />
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

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={isLoading}
      >
        {isLoading ? 'Submitting...' : 'Submit Survey'}
      </button>
    </form>
  );
}
