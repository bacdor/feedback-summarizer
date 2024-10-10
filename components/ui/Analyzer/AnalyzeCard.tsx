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

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {analysisItems.map((item, index) => (
          <div
            key={index}
            onClick={() => handleAnalyzeClick(item.title)} // Passing title to the handler
            className="cursor-pointer"
          >
            <Card title={item.title} />
          </div>
        ))}
      </div>
      {loading ? (
        <p>Analyzing...</p>
      ) : (
        <textarea
          value={analysisResult || ''}
          readOnly
          className="w-full p-2 border rounded-md"
        />
      )}
    </div>
  );
}
