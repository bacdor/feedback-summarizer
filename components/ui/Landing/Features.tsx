'use client';

export default function Features() {
  return (
    <section className="bg-indigo-700 py-16">
      <div className="container mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-10">
          Features that Matter
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureItem
            title="Fast Performance"
            description="Blazing fast speeds with modern technology."
          />
          <FeatureItem
            title="Secure and Reliable"
            description="We prioritize your data privacy and security."
          />
          <FeatureItem
            title="Easy to Use"
            description="User-friendly interface for all skill levels."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureItem({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="text-center p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
