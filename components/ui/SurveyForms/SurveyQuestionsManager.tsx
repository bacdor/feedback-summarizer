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
import Button from '../Button/Button';
import { REACT_LOADABLE_MANIFEST } from 'next/dist/shared/lib/constants';

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
  const [isLoading, setIsLoading] = useState(false);

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

  const handleDeleteQuestion = (id: string) => {
    setQuestionsState((prev) => prev.filter((q) => q.id !== id)); // Remove the question from the local state
  };

  const handleAddQuestion = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/survey-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: crypto.randomUUID(),
          surveyId,
          questionText: '',
          questionType: 'text',
          position: questionsState.length
        })
      });

      if (response.ok) {
        const { question } = await response.json();
        setQuestionsState((prev) => [...prev, question]); // Add the new question to the state
        console.log(question); // Display the message
      } else {
        console.error('Failed to create question');
      }
    } catch (error) {
      console.error('Error adding question:', error);
    } finally {
      setIsLoading(false);
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
            <SortableItem
              key={question.id || index}
              question={question}
              onDelete={handleDeleteQuestion} // Pass the delete function down to SortableItem
            />
          ))}
        </SortableContext>
      </DndContext>

      <div className="w-full max-w-3xl mx-auto flex flex-col sm:flex-row gap-4">
        <Button
          variant="slim"
          type="button"
          onClick={handleAddQuestion}
          className="w-full sm:w-1/2"
          loading={isLoading}
          disabled={isLoading}
        >
          Add Question
        </Button>

        <Button
          variant="slim"
          type="button"
          onClick={() => {
            const surveyLink = `${window.location.origin}/forms/r/${surveyId}`;
            navigator.clipboard.writeText(surveyLink);
            alert('Survey link copied to clipboard!');
          }}
          className="w-full sm:w-1/2"
        >
          Generate and Copy Link
        </Button>
      </div>
    </div>
  );
}

interface SortableItemProps {
  question: any;
  onDelete: (id: string) => void;
}

function SortableItem({ question, onDelete }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <QuestionCard
        surveyQuestion={question}
        moveHandle={listeners}
        onDelete={onDelete} // Pass the onDelete function to QuestionCard
      />
    </div>
  );
}
