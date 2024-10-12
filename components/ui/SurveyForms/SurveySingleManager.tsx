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
  const [title, setTitle] = useState(initialTitle || '');
  const [description, setDescription] = useState(initialDescription || '');

  const [stagedTitle, setStagedTitle] = useState(initialTitle || '');
  const [stagedDescription, setStagedDescription] = useState(
    initialDescription || ''
  );

  const handleBlur = async () => {
    if (title !== stagedTitle || description !== stagedDescription) {
      try {
        const response = await fetch('/api/surveys', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: initialId,
            title,
            description
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update survey');
        }

        console.log('Survey updated successfully');
        // Update staged values after successful update
        setStagedTitle(title);
        setStagedDescription(description);
      } catch (error) {
        console.error('Error updating survey:', error);
      }
    }
  };

  return (
    <div className="w-full max-w-3xl m-auto my-8">
      <div className="py-4">
        <input
          className="text-3xl font-extrabold text-[var(--color-dark)] border-b-2 border-gray-300 focus:outline-none focus:border-[var(--color-primary)] rounded-lg px-4 py-2 shadow-sm hover:shadow-md w-full min-h-14 resize-y transition-shadow duration-200 ease-in-out"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleBlur}
          placeholder="Enter survey title"
        />
        <textarea
          className="mt-4 text-lg text-[var-(--color-dark)] italic border-b-2 border-gray-300 w-full focus:outline-none focus:border-[var(--color-primary)] rounded-lg px-4 py-2 shadow-sm hover:shadow-md w-full min-h-14 resize-y transition-shadow duration-200 ease-in-out"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleBlur}
          placeholder="Enter survey description"
        />
        <hr className="border-t-2 border-gray-300 mt-6 mb-4 w-full rounded-md shadow-sm" />
      </div>
    </div>
  );
}
