'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Props {
  userId: string | null;
  surveyResponses: any[] | null;
}

export default function ResponsesTable({ userId, surveyResponses }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold">Surveys</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Responder Email</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Question</th>
            <th className="border p-2">Answer</th>
            <th className="border p-2">date</th>
          </tr>
        </thead>
        <tbody>
          {surveyResponses && // Check if surveyResponses is not null
            surveyResponses.map((response, index) => {
              // Iterate over surveyResponses
              return (
                <tr key={response.id} className="border">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{response.email}</td>
                  <td className="border p-2">Add Type handler</td>
                  <td className="border p-2">
                    {response.responses.map(
                      (
                        resp: { question_id: string; question: string } // Map over the responses array
                      ) => (
                        <div key={resp.question_id}>{resp.question}</div> // Display the question
                      )
                    )}
                  </td>
                  <td className="border p-2">
                    {response.responses.map(
                      (
                        resp: { question_id: string; answer: string } // Map over the responses array
                      ) => (
                        <div key={resp.question_id}>{resp.answer}</div> // Display the question
                      )
                    )}
                  </td>
                  <td className="border p-2">
                    {new Date(response.submitted_at).toLocaleString()}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
