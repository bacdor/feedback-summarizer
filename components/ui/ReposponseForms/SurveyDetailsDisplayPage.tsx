'use client';

interface Props {
  surveyTitle: string;
  surveyDescription: string;
}

export default function SurveyDetailsDisplayPage({
  surveyTitle,
  surveyDescription
}: Props) {
  return (
    // <div className="bg-white rounded-lg shadow-md p-6 mb-8">
    //   <h1 className="text-3xl font-extrabold text-blue-600 mb-4">
    //     {surveyTitle}
    //   </h1>
    //   <p className="mt-4 text-lg text-gray-700 italic">{surveyDescription}</p>
    // </div>
    <div className="w-full max-w-3xl m-auto my-8">
      <div className="px-5 py-4">
        <h1 className="mb-1 text-4xl font-extrabold text-[#111] sm:text-center sm:text-6xl text-center">
          {surveyTitle}
        </h1>
        <p className="text-lg text-[#333] text-center italic">
          {surveyDescription}
        </p>
      </div>
    </div>
  );
}
