// components/ui/Dashboard/DashboardSurveyList.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Props {
  userId: string | null;
  surveyResponses: any[] | null;
}

export default function DashboardSurveyList({
  userId,
  surveyResponses
}: Props) {
  const [surveys, setSurveys] = useState<
    Array<{ id: string; name: string; description: string }>
  >([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      const response = await fetch('/api/surveys');
      const data = await response.json();
      setSurveys(data);
    };

    fetchSurveys();
  }, []);

  // Function to handle survey deletion
  const handleDeleteSurvey = async (surveyId: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this survey?'
    );
    if (!confirmDelete) return;

    // Check if there are any responses related to this survey
    const hasResponses = surveyResponses?.some(
      (response) => response.survey_id === surveyId
    );

    if (hasResponses) {
      alert('This survey has responses and cannot be deleted.');
      return;
    }

    // Proceed with deletion if allowed
    const response = await fetch(`/api/surveys/${surveyId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      // Remove the deleted survey from the state
      setSurveys(surveys.filter((survey) => survey.id !== surveyId));
    } else {
      console.error('Failed to delete the survey');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Surveys</h2>
      <ul className="space-y-4">
        {surveys &&
          surveys.map(
            (survey: { id: string; name: string; description: string }) => (
              <li key={survey.id} className="border p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <Link href={`/surveys/${survey.id}`} passHref>
                      <h3 className="text-xl">{survey.name}</h3>
                      <p>{survey.description}</p>
                    </Link>
                  </div>
                  <button
                    onClick={() => handleDeleteSurvey(survey.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            )
          )}
      </ul>
    </div>
  );
}
