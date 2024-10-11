'use client';

import { useState } from 'react';

interface Props {
  surveyId: string;
  surveyTitle: string;
  surveyDescription: string;
}

export default function SurveySingleManager({
  surveyId: initialId,
  surveyTitle: initialTitle,
  surveyDescription: initialDescription
}: Props) {
  const [surveyTitle, setSurveyTitle] = useState(initialTitle);
  const [surveyDescription, setSurveyDescription] =
    useState(initialDescription);

  const handleBlur = async () => {
    try {
      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: initialId,
          surveyTitle,
          surveyDescription
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update survey');
      }

      console.log('Survey updated successfully');
    } catch (error) {
      console.error('Error updating survey:', error);
    }
  };

  return (
    <div>
      <input
        className="text-3xl font-extrabold text-blue-600 border-b-2 focus:outline-none focus:border-blue-500"
        value={surveyTitle}
        onChange={(e) => setSurveyTitle(e.target.value)}
        onBlur={handleBlur}
      />
      <textarea
        className="mt-4 text-lg text-gray-700 italic border-b-2 w-full focus:outline-none focus:border-blue-500"
        value={surveyDescription}
        onChange={(e) => setSurveyDescription(e.target.value)}
        onBlur={handleBlur}
      />
    </div>
  );
}
