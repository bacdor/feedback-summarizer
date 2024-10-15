import React from 'react';

interface SolutionRequestsProps {
  analysisResult: string;
}

const SolutionRequests: React.FC<SolutionRequestsProps> = ({
  analysisResult
}) => {
  const parsedResult = JSON.parse(analysisResult);

  return (
    <div className="space-y-4">
      <div className="bg-blue-100 p-4 rounded-lg">
        <strong>
          Results based on <u>{parsedResult.count}</u> analyzed responses:
        </strong>
      </div>
      {parsedResult.responses?.map((response: any, index: number) => (
        <div key={index} className="bg-blue-100 p-4 rounded-lg">
          <div className="space-y-2">
            <h2 className="text-gray-700">
              <strong>Issue:</strong> {response.request}
            </h2>
            <p className="text-gray-700">
              <strong>Solution:</strong> {response.solution}
              <div className="relative ml-1 group inline-block">
                <span className="text-blue-500 cursor-pointer">🛈</span>
                <div className="absolute hidden group-hover:block bg-white border border-gray-200 p-2 rounded shadow-lg z-10 w-64 bottom-full left-0 text-sm">
                  Proposed solution based on the issue identified.
                </div>
              </div>
            </p>
            <div className="flex items-center">
              <span className="mr-2">
                <strong>Impact:</strong>
              </span>
              <div className="flex">
                {[1, 2, 3].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${star <= response.impact ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SolutionRequests;
