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
    <div className="min-h-[calc(100dvh-8rem)] p-2 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Surveys</h2>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="px-6 py-4 text-left font-medium">Survey</th>
            <th className="px-6 py-4 text-left font-medium">Actions</th>
            <th className="px-6 py-4 text-left font-medium">Edit</th>
            <th className="px-6 py-4 text-left font-medium">Analyze</th>
          </tr>
        </thead>
        <tbody>
          {surveys &&
            surveys.map(
              (survey: { id: string; name: string; description: string }) => (
                <tr key={survey.id} className="border-b hover:bg-gray-50">
                  {/* Combined Name and Description */}
                  <td className="px-6 py-4">
                    <Link href={`/surveys/${survey.id}`} passHref>
                      <h3 className="text-xl font-semibold text-indigo-600">
                        {survey.name}
                      </h3>
                      <p className="text-gray-600">{survey.description}</p>
                    </Link>
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteSurvey(survey.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>

                  {/* Edit Column */}
                  <td className="px-6 py-4">
                    <Link href={`/surveys/edit/${survey.id}`} passHref>
                      <button className="text-blue-500 hover:underline">
                        Edit
                      </button>
                    </Link>
                  </td>

                  {/* Analyze Column */}
                  <td className="px-6 py-4">
                    <Link href={`/surveys/analyze/${survey.id}`} passHref>
                      <button className="text-green-500 hover:underline">
                        Analyze
                      </button>
                    </Link>
                  </td>
                </tr>
              )
            )}
        </tbody>
      </table>
    </div>
  );
}
