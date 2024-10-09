import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import {
  getUserDetails,
  getSubscription,
  getUser,
  getSurveyResponses
} from '@/utils/supabase/queries';
import ResponsesTable from '@/components/ui/Analyzer/ResponsesTable';
import Card from '@/components/ui/Analyzer/Card';
import AnalyzeCard from '@/components/ui/Analyzer/AnalyzeCard'; // Client-side component

export default async function AnalyzerDetailPage({
  params
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const [user, userDetails, subscription, surveyResponses] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase),
    getSubscription(supabase),
    getSurveyResponses(supabase)
  ]);

  if (!user) {
    return redirect('/signin');
  }

  const { id } = params;

  // Extracts questions related only to accessed survey
  const surveyResponsesForId = surveyResponses?.filter(
    (response) => response.survey_id === id
  );

  // Extract questions and answers from surveyResponses
  const extractQuestionsAndAnswers = (surveyResponsesForId: any[]) => {
    let text = '';

    surveyResponsesForId.forEach(
      (response: { responses?: { question: string; answer: string }[] }) => {
        if (response.responses) {
          const responses = response.responses;
          responses.forEach(({ question, answer }) => {
            text += `Question: ${question}\n`;
            text += `Answer: ${answer || 'No answer provided'}\n\n`;
          });
        }
      }
    );

    return text;
  };

  const questionsAndAnswersText = extractQuestionsAndAnswers(
    surveyResponsesForId || []
  );

  return (
    <section className="container mx-auto pb-32 p-4 bg-yellow">
      <AnalyzeCard questionsAndAnswersText={questionsAndAnswersText} />
      <ResponsesTable
        userId={user.id}
        surveyResponses={surveyResponsesForId || null}
      />
    </section>
  );
}

// import { redirect } from 'next/navigation';
// import { createClient } from '@/utils/supabase/server';
// import {
//   getUserDetails,
//   getSubscription,
//   getUser,
//   getSurveyResponses
// } from '@/utils/supabase/queries';
// import ResponsesTable from '@/components/ui/Analyzer/ResponsesTable';
// import { analyzeKeyThemes } from '@/utils/openai/chat';
// import Card from '@/components/ui/Analyzer/Card';

// export default async function AnalyzerDetailPage({
//   params
// }: {
//   params: { id: string };
// }) {
//   const supabase = createClient();
//   const [user, userDetails, subscription, surveyResponses] = await Promise.all([
//     getUser(supabase),
//     getUserDetails(supabase),
//     getSubscription(supabase),
//     getSurveyResponses(supabase)
//   ]);

//   if (!user) {
//     return redirect('/signin');
//   }

//   // if (!subscription && !userDetails.avatar_url) {
//   //   return redirect('/#pricing');
//   // }

//   const { id } = params;

//   // Extracts questions related only to accessed survey
//   const surveyResponsesForId = surveyResponses?.filter(
//     (response) => response.survey_id === id
//   );

//   // Extract questions and answers from surveyResponses
//   const extractQuestionsAndAnswers = (surveyResponsesForId: any[]) => {
//     let text = '';

//     surveyResponsesForId.forEach(
//       (response: { responses?: { question: string; answer: string }[] }) => {
//         if (response.responses) {
//           const responses = response.responses; // No need to parse, since it's already an array of objects
//           responses.forEach(({ question, answer }) => {
//             text += `Question: ${question}\n`;
//             text += `Answer: ${answer || 'No answer provided'}\n\n`;
//           });
//         }
//       }
//     );

//     return text;
//   };

//   const questionsAndAnswersText = extractQuestionsAndAnswers(
//     surveyResponsesForId || []
//   );

//   // OpenAI analysis for key themes
//   const keyThemes = await analyzeKeyThemes(questionsAndAnswersText);

//   return (
//     <section className="container mx-auto pb-32 p-4 bg-yellow">
//       <Card title="Positive Feedback" />

//       <div className="w-full">
//         <textarea
//           value={keyThemes || ''}
//           readOnly
//           className="w-full p-2 border rounded-md"
//         />
//       </div>

//       <ResponsesTable
//         userId={user.id}
//         surveyResponses={surveyResponsesForId || null}
//       />
//     </section>
//   );
// }
