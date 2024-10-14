import React from 'react';

interface PositiveFeedbackProps {
  analysisResult: string;
}

const PositiveFeedback: React.FC<PositiveFeedbackProps> = ({
  analysisResult
}) => {
  const parsedResult = JSON.parse(analysisResult);

  return (
    <div className="space-y-4">
      <div className="bg-blue-100 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <h2 className="text-xl font-bold">Positive Percentage</h2>
          <div className="relative ml-1 group">
            <span className="text-blue-500 cursor-pointer">🛈</span>
            <div className="absolute hidden group-hover:block bg-white border border-gray-200 p-2 rounded shadow-lg z-10 w-64 top-full left-0 text-sm">
              Percentage of responses with ratings of 4 or 5, or positive
              sentiment in answers
            </div>
          </div>
        </div>
        <div className="relative pt-1">
          <div className="overflow-hidden h-8 mb-4 text-xs flex rounded bg-blue-200">
            <div
              style={{ width: `${parsedResult.positivePercentage}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
            >
              <span className="text-lg font-bold">
                {parsedResult.positivePercentage}%
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-green-100 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <h2 className="text-xl font-bold">Key Themes</h2>
          <div className="relative ml-1 group">
            <span className="text-green-500 cursor-pointer">🛈</span>
            <div className="absolute hidden group-hover:block bg-white border border-gray-200 p-2 rounded shadow-lg z-10 w-64 bottom-full left-0 text-sm">
              Main positive topics identified from user feedback
            </div>
          </div>
        </div>
        <ul className="list-disc list-inside">
          {Object.values(parsedResult.keyThemes).map((theme, index) => (
            <li key={index} className="text-green-700">
              {theme as React.ReactNode}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-yellow-100 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <h2 className="text-xl font-bold">Summary</h2>
          <div className="relative ml-1 group">
            <span className="text-yellow-500 cursor-pointer">🛈</span>
            <div className="absolute hidden group-hover:block bg-white border border-gray-200 p-2 rounded shadow-lg z-10 w-64 bottom-full left-0 text-sm">
              Concise overview of the overall sentiment and key themes
              identified
            </div>
          </div>
        </div>
        <p className="text-gray-700">{parsedResult.summary}</p>
      </div>
      <div className="bg-purple-100 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <h2 className="text-xl font-bold">High Rated Questions</h2>
          <div className="relative ml-1 group">
            <span className="text-purple-500 cursor-pointer">🛈</span>
            <div className="absolute hidden group-hover:block bg-white border border-gray-200 p-2 rounded shadow-lg z-10 w-64 bottom-full left-0 text-sm">
              Questions with average ratings of 3.6 or higher
            </div>
          </div>
        </div>
        <ul className="space-y-4">
          {parsedResult.highRatedQuestions.map(
            (
              item: { question: string; rating: number; count: number },
              index: number
            ) => (
              <li key={index} className="flex flex-col">
                <span className="text-purple-700 mb-1">{item.question}</span>
                <div className="w-full bg-gray-200 rounded-full h-6 relative">
                  <div
                    className="bg-purple-600 h-full rounded-full flex items-center justify-between px-2"
                    style={{ width: `${(item.rating / 5) * 100}%` }}
                  >
                    <span className="text-white font-bold text-sm">
                      {item.rating}
                    </span>
                    <span className="text-white text-xs">
                      {item.count} responses
                    </span>
                  </div>
                </div>
              </li>
            )
          )}
        </ul>
      </div>
      <div className="bg-pink-100 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <h2 className="text-xl font-bold">Happiest Users</h2>
          <div className="relative ml-1 group">
            <span className="text-pink-500 cursor-pointer">🛈</span>
            <div className="absolute hidden group-hover:block bg-white border border-gray-200 p-2 rounded shadow-lg z-10 w-64 bottom-full left-0 text-sm">
              Three top users with 50% or more positive responses
            </div>
          </div>
        </div>
        <ul className="space-y-2">
          {parsedResult.happiestUsers.map(
            (
              user: { email: string; score: string; count: number },
              index: number
            ) => (
              <li key={index} className="flex flex-col">
                <span className="text-pink-700 font-semibold">
                  {user.email}
                </span>
                <div className="flex items-center mt-1">
                  <span className="text-3xl font-bold mr-4">{user.score}%</span>
                  <div className="flex flex-col">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="relative w-5 h-5">
                          <svg
                            className="w-5 h-5 text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <div
                            className="absolute top-0 left-0 overflow-hidden"
                            style={{
                              width: `${Math.min(100, Math.max(0, (parseFloat(user.score) / 20 - star + 1) * 100))}%`
                            }}
                          >
                            <svg
                              className="w-5 h-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {user.count} responses
                    </span>
                  </div>
                </div>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default PositiveFeedback;
