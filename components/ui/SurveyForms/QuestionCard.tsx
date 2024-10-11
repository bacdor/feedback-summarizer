import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SurveyQuestion {
  id?: string;
  question_text?: string;
  question_type?: string;
  options?: string;
}

interface Props {
  surveyQuestion: SurveyQuestion | null;
}

export default function QuestionCard({ surveyQuestion }: Props) {
  const [questionText, setQuestionText] = useState(
    surveyQuestion?.question_text || ''
  );
  const [questionType, setQuestionType] = useState(
    surveyQuestion?.question_type || 'text'
  );
  const [optionInput, setOptionInput] = useState(''); // Input for a single option
  const [options, setOptions] = useState<string[]>(
    surveyQuestion?.options ? JSON.parse(surveyQuestion.options) : []
  );

  const [stagedQuestionText, setStagedQuestionText] = useState(questionText);
  const [stagedQuestionType, setStagedQuestionType] = useState(questionType);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const questionId = (surveyQuestion as { id?: string })?.id;

  const handleBlur = async (optionsUpdated?: boolean) => {
    if (
      questionText !== stagedQuestionText ||
      questionType !== stagedQuestionType ||
      optionsUpdated
    ) {
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
        console.log('Questions successfully updated.');
        setStagedQuestionText(questionText);
        setStagedQuestionType(questionType);
        // setStagedOptions(options);
        // Refresh the page to show the new question
        router.refresh();
      } else {
        console.error('Failed to update question');
      }
    }
  };

  const handleDelete = async () => {
    if (!questionId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/survey-questions/${questionId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log('Question successfully deleted');
        router.refresh();
      } else {
        console.error('Failed to delete question');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add option to the list
  const handleAddOption = () => {
    if (optionInput.trim()) {
      setOptions([...options, optionInput.trim()]); // Add option to list
      setOptionInput(''); // Clear input field
      handleBlur(true);
    }
  };

  // Remove option from the list
  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
    handleBlur(true);
  };

  return (
    <form className="space-y-4">
      <div>
        <label htmlFor="questionText" className="block mb-2">
          Question Text:
        </label>
        <input
          type="text"
          id="questionText"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          onBlur={() => handleBlur()} // Trigger update on blur
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
          onBlur={() => handleBlur()} // Trigger update on blur
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
        type="button"
        onClick={handleDelete}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Delete Question
      </button>
    </form>
  );
}
