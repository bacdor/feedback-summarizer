'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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

export default function SurveyTable({ userId, surveyResponses }: Props) {
  const [surveys, setSurveys] = useState<Survey[]>([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      const response = await fetch('/api/surveys');
      const data = await response.json();
      setSurveys(data);
    };

    fetchSurveys();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold">Surveys</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border p-2">Survey Name</th>
            <th className="border p-2"># responses</th>
            <th className="border p-2">Last Submitted</th>
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
                <tr key={survey.id} className="border">
                  <td className="border p-2">
                    <Link href={`/surveys/${survey.id}`} passHref>
                      <h3 className="text-xl">
                        <b>{survey.name}</b> {survey.description}
                      </h3>
                    </Link>
                  </td>
                  <td className="border p-2">{responseCount}</td>
                  <td className="border p-2">
                    {lastResponseDate
                      ? new Date(lastResponseDate).toLocaleString()
                      : 'No submissions yet'}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
