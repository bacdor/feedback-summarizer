'use client';

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

  const handleAddQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      // Refresh the page to show the new question
      router.refresh();
    } else {
      console.error('Failed to create question');
    }
  };
  return (
    <div>
      {surveyQuestions &&
        surveyQuestions.map((question) => (
          <div>
            <div>
              <QuestionCard surveyQuestion={question} />
            </div>
          </div>
        ))}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Add New Question</h2>
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            handleAddQuestion(e as unknown as React.FormEvent<HTMLFormElement>);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Question
        </button>
      </div>
    </div>
  );
}
