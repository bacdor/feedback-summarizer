// components/ui/Analyzer/AnalyzeCard.tsx
'use client';

import { useState } from 'react';
import Card from '@/components/ui/Analyzer/Card';

export default function AnalyzeCard({
  questionsAndAnswersText
}: {
  questionsAndAnswersText: string;
}) {
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Modified handleAnalyzeClick to accept a title parameter
  const handleAnalyzeClick = async (title: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ questionsAndAnswersText, title }) // Added title to the request body
      });

      if (!response.ok) {
        throw new Error('Failed to analyze themes');
      }

      const data = await response.json();
      setAnalysisResult(data.analysisResult);
    } catch (error) {
      console.error(error);
      setAnalysisResult('Error occurred while analyzing themes.');
    } finally {
      setLoading(false);
    }
  };

  const analysisItems = [
    { title: 'Positive Themes' },
    { title: 'Negative Themes' },
    { title: 'Type Categorization' },
    { title: 'Tone Categorization' },
    { title: 'Quantitative Analysis' },
    { title: 'Trends Over Time' },
    { title: 'Competitor Comparison' },
    { title: 'Goal Alignment' },
    { title: 'Actionability' }
  ];

  // src="/public/bear.webp"

  return (
    // <div className="flex flex-col lg:flex-row lg:space-x-6">
    //   {/* Left Column: Cards in Two Columns */}
    //   <div className="grid grid-cols-1 gap-1 lg:w-1/5">
    //     {analysisItems.map((item, index) => (
    //       <div
    //         key={index}
    //         onClick={() => handleAnalyzeClick(item.title)}
    //         className="cursor-pointer transition-transform transform hover:scale-105"
    //       >
    //         <div className="bg-gradient-to-r from-[#231a2a] via-[#3b2d4a] to-[#53406a] text-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow">
    //           <div className="flex items-center space-x-2">
    //             <div className="bg-white p-1.5 rounded-full">
    //               <img src={''} alt={item.title} className="h-6 w-6" />
    //             </div>
    //             <h3 className="text-sm font-bold">{item.title}</h3>
    //           </div>
    //         </div>
    //       </div>
    //     ))}
    //   </div>

    //   {/* Right Column: Textarea */}
    //   <div className="lg:w-4/5 mt-6 lg:mt-0">
    //     {loading ? (
    //       <p className="text-gray-500 italic">Analyzing...</p>
    //     ) : (
    //       <div className="w-full h-64 p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50 text-gray-700">
    //         {analysisResult ? (
    //           <p>{analysisResult}</p>
    //         ) : (
    //           <p className="text-gray-400 italic">
    //             Analysis result will appear here...
    //           </p>
    //         )}
    //       </div>
    //     )}
    //   </div>
    // </div>

    <div className="flex flex-col lg:flex-row lg:space-x-6">
      {/* Left Column: Cards in Two Columns */}
      <div className="grid grid-cols-1 gap-1 lg:w-1/5">
        {analysisItems.map((item, index) => (
          <div
            key={index}
            onClick={() => handleAnalyzeClick(item.title)}
            className="relative inline-flex items-center justify-center overflow-hidden rounded-lg shadow-md group cursor-pointer"
          >
            {/* Card Background */}
            <div className="bg-[#231a2a] text-white p-4 rounded-lg w-full h-full flex items-center justify-between transition-transform duration-300">
              <div className="flex items-center space-x-2">
                <div className="bg-white p-1.5 rounded-full">
                  <img src={''} alt={item.title} className="h-6 w-6" />
                </div>
                <h3 className="text-sm">{item.title}</h3>
              </div>
            </div>

            {/* Hover Background Effect */}
            <span className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out transform translate-x-full group-hover:translate-x-0 bg-white opacity-20"></span>
          </div>
        ))}
      </div>

      {/* Right Column: Scrollable Output Div */}
      <div className="lg:w-4/5 lg:h-auto flex-grow mt-6 lg:mt-0">
        {loading ? (
          <div
            className="w-full h-full p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50 text-gray-700 overflow-y-auto"
            style={{ maxHeight: '100%' }} // Ensure it fills the available space
          >
            <p className="text-gray-500 italic">Analyzing...</p>
          </div>
        ) : (
          <div
            className="w-full h-full p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50 text-gray-700 overflow-y-auto"
            style={{ maxHeight: '100%' }} // Ensure it fills the available space
          >
            {analysisResult ? (
              <p>{analysisResult}</p>
            ) : (
              <p className="text-gray-400 italic">
                Analysis result will appear here...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
