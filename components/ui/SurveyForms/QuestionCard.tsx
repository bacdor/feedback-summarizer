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
  moveHandle: any; // Add a prop to receive drag-and-drop listeners
  onDelete: (id: string) => void;
}

export default function QuestionCard({
  surveyQuestion,
  moveHandle,
  onDelete
}: Props) {
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
      questionId &&
      (questionText !== stagedQuestionText ||
        questionType !== stagedQuestionType ||
        optionsUpdated)
    ) {
      const response = await fetch(`/api/survey-questions/${questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          questionText,
          questionType,
          options: options.length > 0 ? JSON.stringify(options) : null
        })
      });

      if (response.ok) {
        console.log('Question successfully updated.');
        setStagedQuestionText(questionText);
        setStagedQuestionType(questionType);
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
        onDelete(questionId); // Call the onDelete callback to remove the question from the parent state
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
    <div
      className="w-full max-w-3xl m-auto my-4 p-6 border rounded-lg shadow-md relative"
      {...moveHandle}
    >
      {/* Delete Button in the Top Right */}
      <button
        type="button"
        onClick={handleDelete}
        className="absolute top-0 right-0 px-2 py-1 text-sm text-[#111] rounded-lg hover:bg-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] focus:outline-none"
      >
        X
      </button>

      <form className="space-y-6">
        <div>
          <input
            type="text"
            id="questionText"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            onBlur={() => handleBlur()}
            className="text-md text-[var(--color-dark)] border-b-2 border-gray-300 focus:outline-none focus:border-[var(--color-primary)] rounded-lg px-4 py-2 shadow-sm hover:shadow-md w-full min-h-14 resize-y transition-shadow duration-200 ease-in-out"
            placeholder="Question"
            required
          />
        </div>
        <div>
          <select
            id="questionType"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            onBlur={() => handleBlur()}
            className="text-md text-[var(--color-dark)] border-b-2 border-gray-300 focus:outline-none focus:border-[var(--color-primary)] rounded-lg px-4 py-2 shadow-sm hover:shadow-md w-full min-h-14 resize-y transition-shadow duration-200 ease-in-out"
          >
            <option value="" disabled>
              Select a question type
            </option>
            <option value="text">Text</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        {questionType === 'multiple_choice' && (
          <div>
            <label
              htmlFor="optionInput"
              className="block mb-2 font-medium text-gray-700"
            >
              Add an Option:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                id="optionInput"
                value={optionInput}
                onChange={(e) => setOptionInput(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter option"
              />
              <button
                type="button"
                onClick={handleAddOption}
                className="px-4 py-2 bg-[var(--color-primary)] text-bold text-white rounded-lg shadow hover:bg-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
              >
                Add
              </button>
            </div>
            <ul className="mt-4 space-y-2">
              {options.map((option, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-2 border rounded-lg shadow-sm bg-gray-50"
                >
                  <span>{option}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="px-2 py-1 text-[#111] rounded-lg hover:bg-[var(--color-accent)]  focus:outline-none"
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}

// import { useState } from 'react';

// interface SurveyQuestion {
//   id?: string;
//   question_text?: string;
//   question_type?: string;
//   options?: string;
// }

// interface Props {
//   surveyQuestion: SurveyQuestion | null;
//   moveHandle: any; // Add a prop to receive drag-and-drop listeners
// }

// export default function QuestionCard({ surveyQuestion, moveHandle }: Props) {
//   const [questionText, setQuestionText] = useState(
//     surveyQuestion?.question_text || ''
//   );
//   const [questionType, setQuestionType] = useState(
//     surveyQuestion?.question_type || 'text'
//   );
//   const [optionInput, setOptionInput] = useState(''); // Input for a single option
//   const [options, setOptions] = useState<string[]>(
//     surveyQuestion?.options ? JSON.parse(surveyQuestion.options) : []
//   );

//   const handleAddOption = () => {
//     if (optionInput.trim()) {
//       setOptions([...options, optionInput.trim()]); // Add option to list
//       setOptionInput(''); // Clear input field
//     }
//   };

//   return (
//     <div className="border p-4 rounded-md mb-4">
//       <form className="space-y-4">
//         <div>
//           <label htmlFor="questionText" className="block mb-2">
//             Question Text:
//           </label>
//           <input
//             type="text"
//             id="questionText"
//             value={questionText}
//             onChange={(e) => setQuestionText(e.target.value)}
//             className="w-full px-3 py-2 border rounded-md"
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="questionType" className="block mb-2">
//             Question Type:
//           </label>
//           <select
//             id="questionType"
//             value={questionType}
//             onChange={(e) => setQuestionType(e.target.value)}
//             className="w-full px-3 py-2 border rounded-md"
//           >
//             <option value="text">Text</option>
//             <option value="multiple_choice">Multiple Choice</option>
//             <option value="rating">Rating</option>
//           </select>
//         </div>

//         {questionType === 'multiple_choice' && (
//           <div>
//             <label htmlFor="optionInput" className="block mb-2">
//               Add an Option:
//             </label>
//             <input
//               type="text"
//               id="optionInput"
//               value={optionInput}
//               onChange={(e) => setOptionInput(e.target.value)}
//               className="w-full px-3 py-2 border rounded-md"
//               placeholder="Enter option"
//             />
//             <button
//               type="button"
//               onClick={handleAddOption}
//               className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//             >
//               Add
//             </button>
//           </div>
//         )}

//         {/* Move Button */}
//         <button
//           type="button"
//           className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//           {...moveHandle} // Apply drag-and-drop listeners to the button
//         >
//           Move
//         </button>
//       </form>
//     </div>
//   );
// }
