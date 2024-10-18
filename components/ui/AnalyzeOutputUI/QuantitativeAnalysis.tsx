import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface QuantitativeAnalysisProps {
  analysisResult: string;
}

const QuantitativeAnalysis: React.FC<QuantitativeAnalysisProps> = ({
  analysisResult
}) => {
  const parsedResult = JSON.parse(analysisResult);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string>('');
  const [selectedAnswers, setSelectedAnswers] = useState<
    { email: string; answer: string }[]
  >([]);
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [showResponderEmails, setShowResponderEmails] =
    useState<boolean>(false);

  const ratingData = {
    labels: parsedResult.ratingQuestions.questions.map((q: any) => q.question),
    datasets: [
      {
        label: 'Average Rating',
        data: parsedResult.ratingQuestions.questions.map(
          (q: any) => q.averageRating
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  const ratingOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'Average Ratings'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5
      }
    }
  };

  const handleEmailsClick = (
    emails: string[],
    question: string,
    choice: string
  ) => {
    if (
      selectedQuestion === question &&
      selectedChoice === choice &&
      selectedEmails.length > 0
    ) {
      setSelectedEmails([]);
      setSelectedQuestion('');
      setSelectedChoice('');
    } else {
      setSelectedEmails(emails);
      setSelectedQuestion(question);
      setSelectedChoice(choice);
    }
    setSelectedAnswers([]);
  };

  const handleTextQuestionClick = (
    answers: { email: string; answer: string }[],
    question: string
  ) => {
    if (selectedQuestion === question && selectedAnswers.length > 0) {
      setSelectedAnswers([]);
      setSelectedQuestion('');
    } else {
      setSelectedAnswers(answers);
      setSelectedQuestion(question);
    }
    setSelectedEmails([]);
    setSelectedChoice('');
  };

  const handleRatingQuestionClick = (
    answers: { email: string; answer: number }[],
    question: string
  ) => {
    if (selectedQuestion === question && selectedAnswers.length > 0) {
      setSelectedAnswers([]);
      setSelectedQuestion('');
    } else {
      setSelectedAnswers(
        answers.map((a) => ({ ...a, answer: a.answer.toString() }))
      );
      setSelectedQuestion(question);
    }
    setSelectedEmails([]);
    setSelectedChoice('');
  };

  const handleRespondersClick = () => {
    setShowResponderEmails(!showResponderEmails);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Overall Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="bg-purple-100 p-4 rounded-lg text-center cursor-pointer"
            onClick={handleRespondersClick}
          >
            <p className="text-4xl font-bold text-purple-600">
              {parsedResult.overall.numberOfResponders}
            </p>
            <p className="text-sm text-gray-600">Responders</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <p className="text-4xl font-bold text-blue-600">
              {parsedResult.overall.numberOfAnsweredQuestions}
            </p>
            <p className="text-sm text-gray-600">Answered Questions</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <p className="text-4xl font-bold text-green-600">
              {parsedResult.overall.numberOfSubmissions}
            </p>
            <p className="text-sm text-gray-600">Submissions</p>
          </div>
        </div>
        {showResponderEmails && (
          <div className="mt-4 bg-white p-4 ">
            <ul className="list-disc pl-5">
              {parsedResult.overall.emails.map(
                (email: string, index: number) => (
                  <li key={index} className="text-sm text-gray-600">
                    {email}
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">
          Rating Questions
        </h2>
        <div className="space-y-3">
          {parsedResult.ratingQuestions.questions
            .sort((a: any, b: any) => b.averageRating - a.averageRating)
            .map((question: any, index: number) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <h3 className="text-base font-semibold mb-2 text-gray-700">
                  {question.question}
                </h3>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(question.averageRating / 5) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {question.averageRating.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p
                    className="text-xs text-gray-500 cursor-pointer"
                    onClick={() =>
                      handleRatingQuestionClick(
                        question.answers,
                        question.question
                      )
                    }
                  >
                    Total Responses: {question.answers.length}
                  </p>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 22 20"
                      >
                        <defs>
                          <linearGradient id={`starGradient-${index}-${star}`}>
                            <stop
                              offset={`${Math.min(Math.max(question.averageRating - star + 1, 0), 1) * 100}%`}
                              stopColor="#FDE047"
                            />
                            <stop
                              offset={`${Math.min(Math.max(question.averageRating - star + 1, 0), 1) * 100}%`}
                              stopColor="#D1D5DB"
                            />
                          </linearGradient>
                        </defs>
                        <path
                          fill={`url(#starGradient-${index}-${star})`}
                          d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                        />
                      </svg>
                    ))}
                  </div>
                </div>
                {selectedAnswers.length > 0 &&
                  selectedQuestion === question.question && (
                    <div className="mt-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 hidden">
                        Answers:
                      </h4>
                      <ul className="list-none text-xs space-y-1">
                        {selectedAnswers
                          .sort((a, b) =>
                            b.answer
                              .toString()
                              .localeCompare(a.answer.toString())
                          )
                          .map((item, answerIndex) => (
                            <li key={answerIndex} className="border-b pb-1">
                              <span className="text-gray-600">
                                Rated {item.answer}
                              </span>
                              <span className="font-semibold text-gray-700">
                                : {item.email}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
              </div>
            ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Multiple Choice Questions
        </h2>
        {parsedResult.multipleChoiceQuestions.questions.map(
          (question: any, index: number) => (
            <div key={index} className="mb-4 last:mb-0">
              <h3 className="font-semibold text-base mb-2 text-gray-700">
                {question.question}
              </h3>
              <div className="space-y-1">
                {question.answers.map((answer: any, answerIndex: number) => (
                  <div key={answerIndex} className="flex items-center">
                    <div className="w-full">
                      <div
                        className="h-6 bg-blue-600 rounded cursor-pointer flex items-center px-2 hover:bg-blue-500"
                        style={{
                          width: `${Math.max(answer.percentage, 10)}%`
                        }}
                        onClick={() =>
                          handleEmailsClick(
                            answer.emails,
                            question.question,
                            answer.choice
                          )
                        }
                      >
                        <span className="text-xs text-white">
                          {answer.choice}: {answer.count} (
                          {answer.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      {selectedEmails.length > 0 &&
                        selectedQuestion === question.question &&
                        selectedChoice === answer.choice && (
                          <div className="my-2 text-xs text-gray-600">
                            <ul className="list-disc list-inside">
                              {selectedEmails.map((email, index) => (
                                <li key={index}>{email}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Text Questions
        </h2>
        <div className="space-y-3">
          {parsedResult.textQuestions.questions.map(
            (question: any, index: number) => (
              <div key={index} className="bg-gray-50 p-3 rounded">
                <h3 className="font-semibold text-base mb-1 text-gray-700">
                  {question.question}
                </h3>
                <p
                  className="text-sm text-gray-600 cursor-pointer"
                  onClick={() =>
                    handleTextQuestionClick(question.answers, question.question)
                  }
                >
                  Answers: {question.answers.length}
                </p>
                {selectedAnswers.length > 0 &&
                  selectedQuestion === question.question && (
                    <div className="mt-2">
                      <ul className="list-none text-sm">
                        {selectedAnswers.map((item, answerIndex) => (
                          <li key={answerIndex} className="border-b pb-1 mb-1">
                            <span className="text-gray-600">{item.answer}</span>{' '}
                            :{' '}
                            <span className="font-medium text-gray-700">
                              {item.email}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default QuantitativeAnalysis;
