'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UUID } from 'crypto';

interface Props {
  surveyId: UUID;
  surveyQuestions: any[] | null;
}

export default function SurveyQuestionsManager({
  surveyId,
  surveyQuestions
}: Props) {
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('text');
  const [options, setOptions] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch('/api/survey-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        surveyId,
        questionText,
        questionType,
        options: options
          ? options.split(',').map((option) => option.trim())
          : null
      })
    });

    if (response.ok) {
      // Refresh the page to show the new question
      router.refresh();
      // Clear the form
      setQuestionText('');
      setQuestionType('text');
      setOptions('');
    } else {
      console.error('Failed to create question');
    }
  };
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
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Add New Question</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="questionText" className="block mb-2">
              Question Text:
            </label>
            <input
              type="text"
              id="questionText"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="questionType" className="block mb-2">
              Question Type:
            </label>
            <select
              id="questionType"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="text">Text</option>
              <option value="multipleChoice">Multiple Choice</option>
            </select>
          </div>
          {questionType === 'multipleChoice' && (
            <div>
              <label htmlFor="options" className="block mb-2">
                Options (comma-separated):
              </label>
              <input
                type="text"
                id="options"
                value={options}
                onChange={(e) => setOptions(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Option 1, Option 2, Option 3"
              />
            </div>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Question
          </button>
        </form>
      </div>
    </div>
  );
}
