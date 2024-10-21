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
        <div className="flex space-x-2">
          <input
            type="text"
            id="surveyTitle"
            name="surveyTitle"
            value={title}
            onChange={handleTitleChange}
            className="border border-gray-300 p-2 w-full rounded-md focus:ring focus:ring-indigo-500 focus:outline-none"
            placeholder="Create a new survey"
            required
          />
          <button type="submit" disabled={isLoading}>
            <img
              src={`/plus.svg`}
              alt={'plus sign'}
              className="h-12 w-12 hover:rotate-180"
            />
          </button>
          {/* 
          <Button
            variant="slim"
            type="submit"
            className="w-12 h-12 flex justify-center items-center bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
            loading={isLoading}
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="500"
              zoomAndPan="magnify"
              viewBox="0 0 375 374.999991"
              height="500"
              preserveAspectRatio="xMidYMid meet"
              version="1.0"
            >
              <path
                fill="#ffffff"
                d="M 245.691406 135.777344 C 242.121094 135.777344 239.222656 132.878906 239.222656 129.308594 C 239.222656 129.308594 239.222656 19.550781 239.222656 19.550781 C 239.222656 8.839844 230.539062 0.15625 219.828125 0.15625 L 155.171875 0.15625 C 144.457031 0.15625 135.777344 8.839844 135.777344 19.550781 L 135.777344 129.308594 C 135.777344 132.878906 132.878906 135.777344 129.308594 135.777344 C 129.308594 135.777344 19.550781 135.777344 19.550781 135.777344 C 8.839844 135.777344 0.15625 144.460938 0.15625 155.171875 L 0.15625 219.828125 C 0.15625 230.539062 8.839844 239.222656 19.550781 239.222656 L 129.308594 239.222656 C 132.878906 239.222656 135.777344 242.121094 135.777344 245.691406 C 135.777344 245.691406 135.777344 355.449219 135.777344 355.449219 C 135.777344 366.160156 144.457031 374.84375 155.171875 374.84375 L 219.828125 374.84375 C 230.539062 374.84375 239.222656 366.160156 239.222656 355.449219 L 239.222656 245.691406 C 239.222656 242.121094 242.121094 239.222656 245.691406 239.222656 C 245.691406 239.222656 355.449219 239.222656 355.449219 239.222656 C 366.160156 239.222656 374.84375 230.539062 374.84375 219.828125 L 374.84375 155.171875 C 374.84375 144.460938 366.160156 135.777344 355.449219 135.777344 Z M 245.691406 135.777344 "
                fill-opacity="1"
                fill-rule="evenodd"
              />
            </svg>
          </Button> */}
        </div>
      </form>
    </div>
  );
}
