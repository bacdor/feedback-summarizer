'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import QuestionCard from './QuestionCard';

interface Props {
  surveyId: UUID;
  surveyQuestions: any[] | null;
}

export default function SurveyQuestionsManager({
  surveyId,
  surveyQuestions
}: Props) {
  const router = useRouter();

  // Track the updated questions in a state
  // const [questionsState, setQuestionsState] = useState(surveyQuestions || []);

  const handleAddQuestion = async () => {
    const response = await fetch('/api/survey-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        surveyId,
        questionText: '',
        questionType: 'text'
      })
    });

    if (response.ok) {
      router.refresh();
    } else {
      console.error('Failed to create question');
    }
  };

  return (
    <div>
      {surveyQuestions?.map((question, index) => (
        <div key={question.id || index}>
          <QuestionCard surveyQuestion={question} />
        </div>
      ))}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Add New Question</h2>
        <button
          onClick={handleAddQuestion}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Question
        </button>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Generate Survey Link</h2>
        <button
          onClick={() => {
            const surveyLink = `${window.location.origin}/forms/r/${surveyId}`;
            navigator.clipboard.writeText(surveyLink);
            alert('Survey link copied to clipboard!');
          }}
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
        >
          Generate and Copy Link
        </button>
      </div>
    </div>
  );
}
