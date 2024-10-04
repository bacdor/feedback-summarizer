// import { redirect } from 'next/navigation';
// import { createClient } from '@/utils/supabase/server';
// import { getUser, getSurveys } from '@/utils/supabase/queries';
// import SurveySingleManager from '@/components/SurveyForms/SurveySingleManager';

// export default async function SurveyDetailPage({
//   params
// }: {
//   params: { id: string };
// }) {
//   const supabase = createClient();
//   const [user, surveys] = await Promise.all([
//     getUser(supabase),
//     getSurveys(supabase)
//   ]);
//   const { id } = params;

//   if (!user) {
//     return redirect('/signin');
//   }

//   return (
//     <section className="pb-32 bg-black">
//       <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
//         <div className="sm:align-center sm:flex sm:flex-col">
//           <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
//             Surveys
//           </h1>
//         </div>
//       </div>
//       <div className="p-4">
//         <h1>{id}</h1>
//         <SurveySingleManager surveyTitle={'title'} surveyDescription={'desc'} />
//       </div>
//     </section>
//   );
// }
