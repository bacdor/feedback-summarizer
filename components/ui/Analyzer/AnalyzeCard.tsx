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

  const handleAnalyzeClick = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ questionsAndAnswersText })
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

  return (
    <div>
      <div onClick={handleAnalyzeClick} className="cursor-pointer">
        <Card title="Positive Feedback" />
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
