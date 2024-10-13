// interface Props {
//   title: string;
//   description?: string;
//   footer?: ReactNode;
//   children: ReactNode;
// }

export default function Card({ title }: { title: string }) {
  return (
    <div className="w-full max-w-3xl mx-auto my-8 p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="px-5 py-4">
        <h3 className="mb-1 text-2xl font-semibold text-gray-800">{title}</h3>
      </div>
    </div>
  );
}
