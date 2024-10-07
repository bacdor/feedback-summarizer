import { useState } from 'react';

interface Props {
  surveyQuestion: any;
  onResponseChange: (
    questionId: string,
    question: string,
    answer: string
  ) => void; // Accept a callback
}

export default function ResponseCard({
  surveyQuestion,
  onResponseChange
}: Props) {
  const options: string[] = (surveyQuestion as { options?: string })?.options
    ? JSON.parse((surveyQuestion as { options?: string })?.options || '[]')
    : [];
  const [answer, setAnswer] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswer = e.target.value;
    setAnswer(newAnswer);
    onResponseChange(
      surveyQuestion.id,
      surveyQuestion.question_text,
      newAnswer
    );
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAnswer = e.target.value;
    setAnswer(selectedAnswer);
    onResponseChange(
      surveyQuestion.id,
      surveyQuestion.question_text,
      selectedAnswer
    );
  };

  return (
    <div className="mb-4">
      {/* Response input based on question type */}
      {surveyQuestion.question_type === 'text' && (
        <div>
          <label
            htmlFor={surveyQuestion.id}
            className="block text-sm font-medium text-gray-700"
          >
            {surveyQuestion.question_text}
          </label>
          <input
            type="text"
            id={surveyQuestion.id}
            value={answer}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter your response"
            required
          />
        </div>
      )}

      {surveyQuestion.question_type === 'multiple_choice' && (
        <div>
          <label
            htmlFor={surveyQuestion.id}
            className="block text-sm font-medium text-gray-700"
          >
            {surveyQuestion.question_text}
          </label>
          <select
            id={surveyQuestion.id}
            value={answer}
            onChange={handleSelectChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="" disabled>
              Select an option
            </option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}

      {surveyQuestion.question_type === 'rating' && (
        <div>
          <label
            htmlFor={surveyQuestion.id}
            className="block text-sm font-medium text-gray-700"
          >
            {surveyQuestion.question_text}
          </label>
          <input
            type="number"
            id={surveyQuestion.id}
            value={answer}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter a rating (1-5)"
            min="1"
            max="5"
            required
          />
        </div>
      )}
    </div>
  );
}
