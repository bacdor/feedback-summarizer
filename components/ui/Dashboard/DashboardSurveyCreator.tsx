// components/ui/Dashboard/DashboardSurveyCreator.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../Button/Button';

export default function DashboardSurveyCreator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: crypto.randomUUID(), title, description })
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const { survey } = await response.json();
      console.log('Survey created:', survey);

      // Redirect to the survey editing page
      router.push(`/forms/edit/${survey.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full px-1 md:px-4">
      <form onSubmit={handleSubmit} className="space-y-4 w-96">
        <div>
          <label htmlFor="surveyTitle" className="block font-medium">
            Title
          </label>
          <input
            type="text"
            id="surveyTitle"
            name="surveyTitle"
            value={title}
            onChange={handleTitleChange}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="surveyDescription" className="block font-medium">
            Description
          </label>
          <input
            type="text"
            id="surveyDescription"
            name="surveyDescription"
            value={description}
            onChange={handleDescriptionChange}
            className="border p-2 w-full"
            required
          />
        </div>

        <div className="w-full">
          <Button
            variant="slim"
            type="submit"
            className="mt-1 w-full"
            loading={isLoading}
            disabled={isLoading}
          >
            Create Survey
          </Button>
        </div>
      </form>
    </div>
  );
}
