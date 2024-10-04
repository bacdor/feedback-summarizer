'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function SurveyQuestionForm({ surveyId }: { surveyId: string }) {
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
        options: options ? JSON.parse(options) : null
      })
    });

    if (response.ok) {
      router.push('/surveys'); // Redirect to surveys page or wherever appropriate
    } else {
      console.error('Failed to create question');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Question Text</label>
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Question Type</label>
        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
        >
          <option value="text">Text</option>
          <option value="multiple_choice">Multiple Choice</option>
          <option value="rating">Rating</option>
        </select>
      </div>
      {questionType === 'multiple_choice' && (
        <div>
          <label>Options (JSON format)</label>
          <input
            type="text"
            value={options}
            onChange={(e) => setOptions(e.target.value)}
            placeholder='e.g. ["Option 1", "Option 2"]'
          />
        </div>
      )}
      <Button type="submit">Add Question</Button>
    </form>
  );
}
