'use client';

interface Props {
  userId: string | null;
  surveyResponses: any[] | null;
}

export default function ResponsesTable({ userId, surveyResponses }: Props) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center m-4">Responses</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-4 text-sm font-semibold">#</th>
              <th className="border p-4 text-sm font-semibold">
                Responder Email
              </th>
              <th className="border p-4 text-sm font-semibold">Type</th>
              <th className="border p-4 text-sm font-semibold">Question</th>
              <th className="border p-4 text-sm font-semibold">Answer</th>
              <th className="border p-4 text-sm font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {surveyResponses &&
              surveyResponses.map(
                (
                  response: {
                    submitted_at: string | number | Date;
                    email: string;
                    responses: {
                      question_text: string;
                      answer: string;
                      question_type: string;
                    }[];
                  },
                  index: number
                ) =>
                  response.responses.map(
                    (
                      resp: {
                        question_text: string;
                        answer: string;
                        question_type: string;
                      },
                      idx: number
                    ) => (
                      <tr
                        key={idx}
                        className={`border-b ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } `}
                      >
                        {idx === 0 && (
                          <>
                            <td
                              className="border p-4 align-top"
                              rowSpan={response.responses.length}
                            >
                              {index + 1}
                            </td>
                            <td
                              className="border p-4 align-top"
                              rowSpan={response.responses.length}
                            >
                              {response.email}
                            </td>
                          </>
                        )}
                        <td className="border p-4">
                          {{
                            text: 'T',
                            rating: 'R',
                            multiple_choice: 'M'
                          }[resp.question_type] || ''}
                        </td>
                        <td className="border p-4">{resp.question_text}</td>
                        <td className="border p-4">{resp.answer}</td>
                        {idx === 0 && (
                          <td
                            className="border p-4 align-top"
                            rowSpan={response.responses.length}
                          >
                            {new Date(response.submitted_at).toLocaleString()}
                          </td>
                        )}
                      </tr>
                    )
                  )
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
