'use client';

import { useState } from 'react';
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

  // Track the updated questions in a state
  const [questionsState, setQuestionsState] = useState(surveyQuestions || []);

  // Update question handler
  const handleQuestionChange = (index: number, updatedQuestion: any) => {
    const updatedQuestions = [...questionsState];
    updatedQuestions[index] = updatedQuestion;
    setQuestionsState(updatedQuestions);
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
        questionType: 'text'
      })
    });

    if (response.ok) {
      router.refresh();
    } else {
      console.error('Failed to create question');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const response = await fetch(`/api/survey-questions/${questionId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Remove the deleted question from the state
        setQuestionsState(questionsState.filter((q) => q.id !== questionId));
      } else {
        console.error('Failed to delete question');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  // Send separate PUT requests for each question
  const handleUpdateSurvey = async () => {
    try {
      const updateRequests = questionsState.map(async (question) => {
        const response = await fetch(`/api/survey-questions/${question.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            questionText: question.question_text,
            questionType: question.question_type,
            options: question.options
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update question with ID ' + question.id);
        }
      });

      // Wait for all questions to be updated
      await Promise.all(updateRequests);
      router.refresh();
    } catch (error) {
      console.error('Failed to update survey:', error);
    }
  };

  return (
    <div>
      {questionsState.map((question, index) => (
        <div key={question.id || index}>
          <QuestionCard
            surveyQuestion={question}
            onChange={(updatedQuestion) =>
              handleQuestionChange(index, updatedQuestion)
            }
            onDelete={handleDeleteQuestion} // Pass the delete handler
          />
        </div>
      ))}
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
        <h2 className="text-xl font-semibold mb-4">Update Survey</h2>
        <button
          onClick={handleUpdateSurvey}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Update Survey
        </button>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Generate Survey Link</h2>
        <button
          onClick={() => {
            const surveyLink = `${window.location.origin}/surveys/r/${surveyId}`;
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
