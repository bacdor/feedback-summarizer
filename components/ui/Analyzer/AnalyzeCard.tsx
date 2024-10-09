// components/ui/Analyzer/AnalyzeCard.tsx
'use client';

import { useState } from 'react';
import Card from '@/components/ui/Analyzer/Card';

export default function AnalyzeCard({
  questionsAndAnswersText
}: {
  questionsAndAnswersText: string;
}) {
  const [keyThemes, setKeyThemes] = useState<string | null>(null);
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
      setKeyThemes(data.keyThemes);
    } catch (error) {
      console.error(error);
      setKeyThemes('Error occurred while analyzing themes.');
    } finally {
      setLoading(false);
    }
  };

  const analysisItems = [
    { title: 'Key Themes' },
    { title: 'Secondary Themes' },
    { title: 'Important Highlights' },
    { title: 'Emerging Trends' },
    { title: 'Strengths' },
    { title: 'Weaknesses' },
    { title: 'Opportunities' },
    { title: 'Threats' },
    { title: 'Summary' }
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
          value={keyThemes || ''}
          readOnly
          className="w-full p-2 border rounded-md"
        />
      )}
    </div>
  );
}
