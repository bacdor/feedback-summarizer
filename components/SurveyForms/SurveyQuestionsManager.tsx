'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UUID } from 'crypto';

interface Survey {
  id: string;
  name: string;
  description: string;
}

interface Props {
  surveyId: UUID;
  surveyQuestions: any[] | null;
}

export default function SurveyQuestionsManager({
  surveyId,
  surveyQuestions
}: Props) {
  //   const router = useRouter();
  //   //   const id = router.searchParams?.get('id') || '5e905285-561b-42e2-ac70-bed845d0e90a';
  //   const [survey, setSurvey] = useState<Survey | null>(null);
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState<string | null>(null);

  //   useEffect(() => {
  //     const fetchSurvey = async () => {
  //       try {
  //         const response = await fetch(`/api/surveys/${id}`);
  //         if (!response.ok) {
  //           throw new Error('Failed to fetch survey');
  //         }
  //         const data = await response.json();
  //         setSurvey(data);
  //       } catch (err) {
  //         // setError(err.message);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     if (id) {
  //       fetchSurvey();
  //     }
  //   }, [id]);

  //   if (loading) return <p>Loading...</p>;
  //   if (error) return <p>Error: {error}</p>;
  //   if (!survey) return <p>No survey found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">{surveyId}</h1>
      {surveyQuestions &&
        surveyQuestions.map((question, index) => (
          <div key={index} className="mt-4">
            {Object.entries(question).map(([key, value]) => (
              <p key={key} className="mt-2">
                <strong>{key}:</strong> {String(value)}
              </p>
            ))}
          </div>
        ))}
      {/* <p className="mt-2">{surveyQuestions.id}</p> */}
    </div>
  );
}
