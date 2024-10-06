// import { useRouter } from 'next/navigation';
// import { ReactNode, useState } from 'react';

// interface Props {
//   surveyQuestion: Object | null;
// }

// export default function ResponseCard({ surveyQuestion }: Props) {
//   const [questionText, setQuestionText] = useState(
//     (surveyQuestion as { question_text?: string })?.question_text || ''
//   );
//   const [questionType, setQuestionType] = useState(
//     (surveyQuestion as { question_type?: string })?.question_type || 'text'
//   );
//   const [optionInput, setOptionInput] = useState(''); // Input for a single option
//   const [options, setOptions] = useState<string[]>(
//     (surveyQuestion as { options?: string })?.options
//       ? JSON.parse((surveyQuestion as { options?: string })?.options || '[]')
//       : []
//   );
//   const router = useRouter();

//   const questionId = (surveyQuestion as { id?: string })?.id;

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const response = await fetch(
//       questionId
//         ? `/api/survey-questions/${questionId}`
//         : '/api/survey-questions',
//       {
//         method: questionId ? 'PUT' : 'POST', // Use PUT for updates
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           questionText,
//           questionType,
//           options: options.length > 0 ? JSON.stringify(options) : null
//         })
//       }
//     );

//     if (response.ok) {
//       // Refresh the page to show the new question
//       router.refresh();
//       // Clear the form
//       setQuestionText('');
//       setQuestionType('text');
//       setOptions([]);
//     } else {
//       console.error('Failed to create question');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <br></br>
//       <div>
//         <label htmlFor="questionText" className="block mb-2">
//           Question Text:
//         </label>
//         <input
//           type="text"
//           id="questionText"
//           value={questionText}
//           onChange={(e) => setQuestionText(e.target.value)}
//           className="w-full px-3 py-2 border rounded-md"
//           required
//         />
//       </div>
//       <div>
//         <label htmlFor="questionType" className="block mb-2">
//           Question Type:
//         </label>
//         <select
//           id="questionType"
//           value={questionType}
//           onChange={(e) => setQuestionType(e.target.value)}
//           className="w-full px-3 py-2 border rounded-md"
//         >
//           <option value="text">Text</option>
//           <option value="multiple_choice">Multiple Choice</option>
//           <option value="rating">Rating</option>
//         </select>
//       </div>
//       {questionType === 'multiple_choice' && (
//         <div>
//           <label htmlFor="optionInput" className="block mb-2">
//             Add an Option:
//           </label>
//           <div className="flex items-center space-x-2">
//             <input
//               type="text"
//               id="optionInput"
//               value={optionInput}
//               onChange={(e) => setOptionInput(e.target.value)}
//               className="w-full px-3 py-2 border rounded-md"
//               placeholder="Enter option"
//             />
//           </div>
//           <ul className="mt-4 space-y-2">
//             {options.map((option, index) => (
//               <li key={index} className="flex justify-between items-center">
//                 <span>{option}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </form>
//   );
// }

import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';

interface Props {
  surveyQuestion: Object | null;
}

export default function ResponseCard({ surveyQuestion }: Props) {
  const [questionText, setQuestionText] = useState(
    (surveyQuestion as { question_text?: string })?.question_text || ''
  );
  const [questionType, setQuestionType] = useState(
    (surveyQuestion as { question_type?: string })?.question_type || 'text'
  );
  //   const [optionInput, setOptionInput] = useState(''); // Input for a single option
  const [options, setOptions] = useState<string[]>(
    (surveyQuestion as { options?: string })?.options
      ? JSON.parse((surveyQuestion as { options?: string })?.options || '[]')
      : []
  );
  const [response, setResponse] = useState(''); // Capture response for text or rating
  const [multipleChoiceResponse, setMultipleChoiceResponse] = useState<
    string | null
  >(null); // Capture response for multiple choice

  //   const router = useRouter();
  //   const questionId = (surveyQuestion as { id?: string })?.id;

  return (
    <div>
      <br />
      <div>
        <label htmlFor="questionText" className="block mb-2">
          {questionText}
        </label>
        {/* Response input based on question type */}
        {questionType === 'text' && (
          <div>
            <label htmlFor="textResponse" className="block mb-2">
              Your Response:
            </label>
            <input
              type="text"
              id="textResponse"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your response"
              required
            />
          </div>
        )}

        {questionType === 'multiple_choice' && (
          <div>
            <label htmlFor="multipleChoiceResponse" className="block mb-2">
              Choose an option:
            </label>
            <select
              id="multipleChoiceResponse"
              value={multipleChoiceResponse || ''}
              onChange={(e) => setMultipleChoiceResponse(e.target.value)}
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

        {questionType === 'rating' && (
          <div>
            <label htmlFor="ratingResponse" className="block mb-2">
              Rate:
            </label>
            <input
              type="number"
              id="ratingResponse"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter a rating (1-5)"
              min="1"
              max="5"
              required
            />
          </div>
        )}
      </div>
    </div>
  );
}
