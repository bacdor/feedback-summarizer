'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  const [questionsState, setQuestionsState] = useState(surveyQuestions || []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = questionsState.findIndex((q) => q.id === active.id);
      const newIndex = questionsState.findIndex((q) => q.id === over.id);
      const newQuestionsState = arrayMove(questionsState, oldIndex, newIndex);

      setQuestionsState(newQuestionsState);

      // Make a POST request to save the new order to the backend
      const response = await fetch('/api/update-question-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          surveyId,
          updatedQuestions: newQuestionsState.map((q, index) => ({
            id: q.id,
            position: index
          }))
        })
      });

      if (!response.ok) {
        console.error('Failed to update question order');
      }
    }
  };

  const handleAddQuestion = async () => {
    const response = await fetch('/api/survey-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        surveyId,
        questionText: '',
        questionType: 'text',
        position: questionsState.length
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={questionsState.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          {questionsState.map((question, index) => (
            <SortableItem key={question.id || index} question={question} />
          ))}
        </SortableContext>
      </DndContext>

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

interface SortableItemProps {
  question: any;
}

function SortableItem({ question }: SortableItemProps) {
  const {
    attributes,
    listeners, // This is used to apply drag behavior to the button
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <QuestionCard
        surveyQuestion={question}
        moveHandle={listeners} // Pass listeners to the button in QuestionCard
      />
    </div>
  );
}

// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { UUID } from 'crypto';
// import QuestionCard from './QuestionCard';

// interface Props {
//   surveyId: UUID;
//   surveyQuestions: any[] | null;
// }

// export default function SurveyQuestionsManager({
//   surveyId,
//   surveyQuestions
// }: Props) {
//   const router = useRouter();

//   // Track the updated questions in a state
//   // const [questionsState, setQuestionsState] = useState(surveyQuestions || []);

//   const handleAddQuestion = async () => {
//     const response = await fetch('/api/survey-questions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         surveyId,
//         questionText: '',
//         questionType: 'text'
//       })
//     });

//     if (response.ok) {
//       router.refresh();
//     } else {
//       console.error('Failed to create question');
//     }
//   };

//   return (
//     <div>
//       {surveyQuestions?.map((question, index) => (
//         <div key={question.id || index}>
//           <QuestionCard surveyQuestion={question} />
//         </div>
//       ))}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold mb-4">Add New Question</h2>
//         <button
//           onClick={handleAddQuestion}
//           className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//         >
//           Add Question
//         </button>
//       </div>
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold mb-4">Generate Survey Link</h2>
//         <button
//           onClick={() => {
//             const surveyLink = `${window.location.origin}/forms/r/${surveyId}`;
//             navigator.clipboard.writeText(surveyLink);
//             alert('Survey link copied to clipboard!');
//           }}
//           className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
//         >
//           Generate and Copy Link
//         </button>
//       </div>
//     </div>
//   );
// }
