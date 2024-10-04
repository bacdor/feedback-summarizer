// components/ui/Dashboard/DashboardSurveyList.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import { Tables } from '@/types_db';

// type Survey = Tables<'surveys'>;

interface Props {
  userId: string | null;
}

export default function DashboardSurveyList({ userId }: Props) {
  const router = useRouter();
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

  const handleSurveyClick = (surveyId: string) => {
    router.push(`/surveys/${surveyId}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Surveys</h2>
      {/* <ul className="space-y-4">
        {surveys.map(
          (survey: { id: string; name: string; description: string }) => (
            <li
              key={survey.id}
              className="border p-4 cursor-pointer"
              onClick={() => handleSurveyClick(survey.id)}
            >
              <h3 className="text-xl">{survey.name}</h3>
              <p>{survey.description}</p>
            </li>
          )
        )}
      </ul> */}
      <ul className="space-y-4">
        {surveys &&
          surveys.map(
            (survey: { id: string; name: string; description: string }) => (
              <li key={survey.id} className="border p-4 cursor-pointer">
                <Link href={`/surveys/${survey.id}`} passHref>
                  <h3 className="text-xl">{survey.name}</h3>
                  <p>{survey.description}</p>
                </Link>
              </li>
            )
          )}
      </ul>
    </div>
  );
}
