import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';

interface Props {
  surveyQuestion: Object | null;
}

export default function QuestionCard({ surveyQuestion }: Props) {
  const [questionText, setQuestionText] = useState(
    (surveyQuestion as { question_text?: string })?.question_text || ''
  );
  const [questionType, setQuestionType] = useState(
    (surveyQuestion as { question_type?: string })?.question_type || 'text'
  );
  const [optionInput, setOptionInput] = useState(''); // Input for a single option
  const [options, setOptions] = useState<string[]>(
    (surveyQuestion as { options?: string })?.options
      ? JSON.parse((surveyQuestion as { options?: string })?.options || '[]')
      : []
  );
  const router = useRouter();

  const questionId = (surveyQuestion as { id?: string })?.id;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch(
      questionId
        ? `/api/survey-questions/${questionId}`
        : '/api/survey-questions',
      {
        method: questionId ? 'PUT' : 'POST', // Use PUT for updates
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          questionText,
          questionType,
          options: options.length > 0 ? JSON.stringify(options) : null
        })
      }
    );

    if (response.ok) {
      // Refresh the page to show the new question
      router.refresh();
      // Clear the form
      setQuestionText('');
      setQuestionType('text');
      setOptions([]);
    } else {
      console.error('Failed to create question');
    }
  };

  const handleDelete = async () => {
    if (!questionId) return;

    const response = await fetch(`/api/survey-questions/${questionId}`, {
      method: 'DELETE' // Use DELETE for removing the question
    });

    if (response.ok) {
      // Optionally, refresh the page or redirect
      router.refresh();
    } else {
      console.error('Failed to delete question');
    }
  };

  // Add option to the list
  const handleAddOption = () => {
    if (optionInput.trim()) {
      setOptions([...options, optionInput.trim()]); // Add option to list
      setOptionInput(''); // Clear input field
    }
  };

  // Remove option from the list
  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
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
          <option value="multiple_choice">Multiple Choice</option>
          <option value="rating">Rating</option>
        </select>
      </div>
      {questionType === 'multiple_choice' && (
        <div>
          <label htmlFor="optionInput" className="block mb-2">
            Add an Option:
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              id="optionInput"
              value={optionInput}
              onChange={(e) => setOptionInput(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter option"
            />
            <button
              type="button"
              onClick={handleAddOption}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Add
            </button>
          </div>
          <ul className="mt-4 space-y-2">
            {options.map((option, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{option}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Update Question
      </button>
      <button
        type="button"
        onClick={handleDelete}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Delete Question
      </button>
    </form>
  );
}
