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
      <h2 className="text-2xl text-[#111] font-bold mb-4 text-center">
        Survey List
      </h2>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="border-b bg-[var(--color-primary)]">
            <th className="px-6 py-4 text-left font-medium w-1/2"></th>
            <th className="px-6 py-4 text-center font-medium w-1/6">Analyze</th>
            <th className="px-6 py-4 text-center font-medium w-1/6">Edit</th>
            <th className="px-6 py-4 text-center font-medium w-1/6">Delete</th>
          </tr>
        </thead>
        <tbody>
          {surveys &&
            surveys.map(
              (survey: { id: string; name: string; description: string }) => (
                <tr
                  key={survey.id}
                  className="border-b hover:bg-[var(--color-background)]"
                >
                  {/* Combined Name and Description */}
                  <td className="px-6 py-4">
                    <Link href={`/surveys/${survey.id}`} passHref>
                      <h3 className="text-xl font-semibold text-[#111]">
                        {survey.name}
                      </h3>
                      <p className="text-[#666]">{survey.description}</p>
                    </Link>
                  </td>

                  {/* Analyze Column - Centered */}
                  <td className="px-6 py-4 text-center">
                    <Link href={`/surveys/analyze/${survey.id}`} passHref>
                      <button>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          id="search"
                        >
                          <path
                            fill="var(--color-primary)"
                            d="M15.6207067,15.6542822 C16.0072308,15.270377 16.6268293,15.270377 17.0133534,15.6542822 L17.0133534,15.6542822 L19.5680176,17.7164156 L19.6123694,17.7164156 C20.1292102,18.2388171 20.1292102,19.0857973 19.6123694,19.6081989 C19.0955285,20.1306004 18.2575639,20.1306004 17.7407231,19.6081989 L17.7407231,19.6081989 L15.6207067,17.1784678 L15.5402577,17.0876967 C15.390397,16.8980019 15.3076306,16.6615115 15.3076306,16.416375 C15.3076306,16.1303824 15.4202849,15.8561581 15.6207067,15.6542822 Z M8.57763961,-7.10542736e-15 C10.8525711,-7.10542736e-15 13.0343273,0.913436016 14.6429467,2.53936255 C16.2515662,4.16528909 17.1552792,6.37051871 17.1552792,8.66992606 C17.1552792,13.458194 13.3149392,17.3398521 8.57763961,17.3398521 C3.84034006,17.3398521 2.13162821e-14,13.458194 2.13162821e-14,8.66992606 C2.13162821e-14,3.88165812 3.84034006,-7.10542736e-15 8.57763961,-7.10542736e-15 Z"
                            transform="translate(2 2)"
                          ></path>
                        </svg>
                      </button>
                    </Link>
                  </td>

                  {/* Edit Column - Centered */}
                  <td className="px-6 py-4 text-center">
                    <Link href={`/surveys/edit/${survey.id}`} passHref>
                      <button>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          id="edit"
                        >
                          <path
                            fill="#111"
                            d="M17.864 3.6a1 1 0 0 0-1.414 0l-1.414 1.415 4.242 4.242 1.414-1.414a1 1 0 0 0 0-1.414L17.864 3.6zm0 7.072-4.243-4.243-8.9 8.9a1 1 0 0 0-.292.706v2.829a1 1 0 0 0 1 1h2.828a1 1 0 0 0 .707-.293l8.9-8.9z"
                          ></path>
                        </svg>
                      </button>
                    </Link>
                  </td>

                  {/* Actions Column - Centered */}
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleDeleteSurvey(survey.id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="var(--color-accent)"
                        id="delete"
                      >
                        <path
                          fill="var(--color-accent)"
                          d="M15 3a1 1 0 0 1 1 1h2a1 1 0 1 1 0 2H6a1 1 0 0 1 0-2h2a1 1 0 0 1 1-1h6Z"
                        ></path>
                        <path
                          fill="var(--color-accent)"
                          fillRule="evenodd"
                          d="M6 7h12v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7Zm3.5 2a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 1 0v-9a.5.5 0 0 0-.5-.5Zm5 0a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 1 0v-9a.5.5 0 0 0-.5-.5Z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              )
            )}
        </tbody>
      </table>
    </div>
  );
}
