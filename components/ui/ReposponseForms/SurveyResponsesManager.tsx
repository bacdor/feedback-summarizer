'use client';

import { useRouter } from 'next/navigation';
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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     setFormData({
  //       ...formData,
  //       [e.target.name]: e.target.value
  //     });
  //   };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/surveys-responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // surveyId,
          // questionText: '',
          // questionType: 'text'
          survey_id: surveyId,
          email: 'user@example.com',
          responses: [
            {
              question_id: 1,
              answer: 'Option 1'
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const data = await response.json();
      console.log('Survey created:', data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {surveyQuestions &&
        surveyQuestions.map((question) => (
          <div>
            <div>
              <ResponseCard surveyQuestion={question} />
            </div>
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
