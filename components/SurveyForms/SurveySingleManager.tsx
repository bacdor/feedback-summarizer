'use client';

interface Props {
  surveyTitle: string;
  surveyDescription: string;
}

export default function SurveySingleManager({
  surveyTitle,
  surveyDescription
}: Props) {
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-blue-600">{surveyTitle}</h1>
      <p className="mt-4 text-lg text-gray-700 italic">{surveyDescription}</p>
    </div>
  );
}
