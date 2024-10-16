import React, { useState } from 'react';

interface RespondersProps {
  analysisResult: string;
}

const Responders: React.FC<RespondersProps> = ({ analysisResult }) => {
  const parsedResult = JSON.parse(analysisResult);
  const [viewMode, setViewMode] = useState<'detailed' | 'simple'>('detailed');

  const toggleViewMode = () => {
    setViewMode(viewMode === 'detailed' ? 'simple' : 'detailed');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <label className="inline-flex items-center cursor-pointer">
          <span className="mr-3 text-sm font-medium text-gray-900">
            {/* {viewMode === 'detailed' ? 'Detailed View' : ''} */}
            Detailed View
          </span>
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={viewMode === 'detailed'}
              onChange={toggleViewMode}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </div>
        </label>
      </div>

      {viewMode === 'detailed' ? (
        parsedResult.responders.map((responder: any, index: number) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-gray-800">
                {responder.email}
              </h2>
              <span className="text-sm text-gray-600">
                {responder.responseCount} responses
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Non-Negative Percentage</p>
                <p className="text-lg font-semibold text-blue-600">
                  {responder.nonNegativePercentage.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Sentiment</p>
                <p className="text-lg font-semibold text-green-600">
                  {responder.averageSentiment.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-lg font-semibold text-yellow-600">
                  {responder.averageRating.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Analysis
              </h3>
              <p className="text-gray-600">{responder.analysis}</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${responder.nonNegativePercentage}%` }}
              ></div>
            </div>
          </div>
        ))
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responses
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Non-Negative %
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg Sentiment
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg Rating
              </th>
            </tr>
          </thead>
          <tbody>
            {parsedResult.responders.map((responder: any, index: number) => (
              <tr
                key={index}
                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                <td className="px-4 py-2 whitespace-nowrap">
                  {responder.email}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {responder.responseCount}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {responder.nonNegativePercentage.toFixed(2)}%
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {responder.averageSentiment.toFixed(2)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {responder.averageRating.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Responders;
