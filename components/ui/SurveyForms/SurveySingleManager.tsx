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

  const [stagedSurveyTitle, setStagedSurveyTitle] = useState(initialTitle);
  const [stagedSurveyDescription, setStagedSurveyDescription] =
    useState(initialDescription);

  const handleBlur = async () => {
    if (
      surveyTitle !== stagedSurveyTitle ||
      surveyDescription !== stagedSurveyDescription
    ) {
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
        // Update staged values after successful update
        setStagedSurveyTitle(surveyTitle);
        setStagedSurveyDescription(surveyDescription);
      } catch (error) {
        console.error('Error updating survey:', error);
      }
    }
  };

  return (
    <div className="w-full max-w-3xl m-auto my-8">
      <div className="px-5 py-4">
        <input
          className="text-3xl font-extrabold text-[var(--color-dark)] border-b-2 border-gray-300 focus:outline-none focus:border-[var(--color-primary)] rounded-lg px-4 py-2 shadow-sm hover:shadow-md w-full min-h-14 resize-y transition-shadow duration-200 ease-in-out"
          value={surveyTitle}
          onChange={(e) => setSurveyTitle(e.target.value)}
          onBlur={handleBlur}
          placeholder="Enter survey title"
        />
        <textarea
          className="mt-4 text-lg text-text-[var-(--color-dark)] italic border-b-2 border-gray-300 w-full focus:outline-none focus:border-[var(--color-primary)] rounded-lg px-4 py-2 shadow-sm hover:shadow-md w-full min-h-14 resize-y transition-shadow duration-200 ease-in-out"
          value={surveyDescription}
          onChange={(e) => setSurveyDescription(e.target.value)}
          onBlur={handleBlur}
          placeholder="Enter survey description"
        />
        <hr className="border-t-2 border-gray-300 mt-6 mb-4 w-full rounded-md shadow-sm" />
      </div>
    </div>
  );
}
