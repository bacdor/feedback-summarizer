// components/ui/Dashboard/DashboardSurveyList.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardSurveyCreator from './DashboardSurveyCreator';

interface Props {
  userId: string | null;
  surveyResponses: any[] | null;
}

interface Survey {
  id: string;
  name: string;
  description: string;
}

function getSurveyResponseData(surveyResponses: any[], surveyId: string) {
  return surveyResponses?.reduce(
    (acc, response) => {
      if (response.survey_id === surveyId) {
        acc.responseCount += 1;
        const responseDate = new Date(response.submitted_at);
        if (!acc.lastResponseDate || responseDate > acc.lastResponseDate) {
          acc.lastResponseDate = responseDate;
        }
      }
      return acc;
    },
    { responseCount: 0, lastResponseDate: null }
  );
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

    const hasResponses = surveyResponses?.some(
      (response) => response.survey_id === surveyId
    );

    if (hasResponses) {
      alert('This survey has responses and cannot be deleted.');
      return;
    }

    const response = await fetch(`/api/surveys/${surveyId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      setSurveys(surveys.filter((survey) => survey.id !== surveyId));
    } else {
      console.error('Failed to delete the survey');
    }
  };

  if (surveys.length === 0) {
    return (
      <div className="min-h-[calc(100dvh-8rem)] p-2 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl text-[#111] font-bold mb-4 text-center">
          Feedback Forms List
        </h1>
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">No forms found.</p>
          <p className="mt-2 text-sm text-gray-500">
            Create a new survey to get started.
          </p>
          <DashboardSurveyCreator />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] w-full h-full p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50 text-gray-700 overflow-y-auto">
      <div className=" m-4 md:m-0 md:float-right">
        <DashboardSurveyCreator />
      </div>
      <h1 className="text-3xl text-[var(--color-dark)] font-bold mb-6 text-center mx-auto">
        Feedback Forms List
      </h1>

      <table className="min-w-full table-auto border-collapse text-base">
        <thead>
          <tr className="border-b bg-[var(--color-dark)] text-white">
            <th className="px-4 py-3 text-center font-medium">Share</th>
            <th className="px-4 py-3 text-left font-medium w-1/2">
              Name & Description
            </th>
            <th className="px-4 py-3 text-center font-medium">Responses</th>
            <th className="px-4 py-3 text-center font-medium">
              Last Submission
            </th>
            <th className="px-4 py-3 text-center font-medium">Analyze</th>
            <th className="px-4 py-3 text-center font-medium">Edit</th>
            <th className="px-4 py-3 text-center font-medium">Delete</th>
          </tr>
        </thead>
        <tbody>
          {surveys &&
            surveys.map((survey) => {
              const { responseCount, lastResponseDate } = getSurveyResponseData(
                surveyResponses || [],
                survey.id
              );
              return (
                <tr
                  key={survey.id}
                  className="border-b hover:bg-gray-200 transition-all"
                >
                  <td className="px-4 py-4 text-center">
                    <button
                      className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                      onClick={() => {
                        const surveyLink = `${window.location.origin}/forms/r/${survey.id}`;
                        navigator.clipboard.writeText(surveyLink);
                        // Replace alert with a notification/toast library for better UX
                        alert('Survey link copied to clipboard!');
                      }}
                      title="Copy Share Link" // Tooltip
                    >
                      🔗
                    </button>
                  </td>

                  <td className="px-4 py-4">
                    <a
                      href={`/forms/view/${survey.id}`}
                      className="block hover:underline"
                    >
                      <h2 className="font-semibold text-gray-800">
                        {survey.name}
                      </h2>
                      <p className="text-gray-600 text-sm">
                        {survey.description}
                      </p>
                    </a>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <a
                      href={`/forms/stats/${survey.id}`}
                      className="hover:underline"
                    >
                      {responseCount}
                    </a>
                  </td>

                  <td className="px-4 py-4 text-center">
                    {lastResponseDate
                      ? new Date(lastResponseDate).toLocaleString()
                      : 'No submissions'}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <a
                      href={`/forms/scout/${survey.id}`}
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                      title="Analyze"
                    >
                      📊
                    </a>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <a
                      href={`/forms/edit/${survey.id}`}
                      className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
                      title="Edit"
                    >
                      ✏️
                    </a>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <button
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      onClick={() => handleDeleteSurvey(survey.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
