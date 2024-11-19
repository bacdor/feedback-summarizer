// components/ui/Features.tsx
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faBrain,
  faHandshake,
  faPencil,
  faEdit
} from '@fortawesome/free-solid-svg-icons';
// import s from './Features.module.css';

export default function Features() {
  return (
    <section id="features">
      <div className="container max-w-6xl mx-auto px-4 py-32">
        {/* Title */}
        <div className="text-center mb-24">
          <h2 className="text-4xl font-bold mb-2 tracking-wider">BENEFITS</h2>
          <div className="flex items-center justify-center">
            <div className="h-1 w-16 bg-gray-300"></div>
            <p className="text-xl text-gray-600 px-4">
              Drive Growth, and Simplify Decisions
            </p>
            <div className="h-1 w-16 bg-gray-300"></div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center bg-white shadow-lg rounded-lg p-8 hover:bg-[#f7f7f7] transition-colors duration-200">
            <FontAwesomeIcon
              icon={faEdit}
              size="3x"
              className="text-orange-500 mb-4"
            />
            <h3 className="text-2xl font-semibold mb-10 mt-2">
              Custom Survey Creator
            </h3>
            <p className="text-gray-600 text-md mb-12">
              Create tailored surveys with flexibility to capture the exact
              insights you need to drive your business forward. Customize each
              survey to target specific information, ensuring you gather the
              most relevant data to meet your goals.
            </p>
            <Link
              href="/features/collaboration"
              className="text-orange-500 text-lg font-semibold hover:underline"
            >
              Learn More
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center bg-white shadow-lg rounded-lg p-8 hover:bg-[#f7f7f7] transition-colors duration-200">
            <FontAwesomeIcon
              icon={faChartLine}
              size="3x"
              className="text-orange-500 mb-4"
            />
            <h3 className="text-2xl font-semibold mb-10 mt-2">
              Statistics and Analysis
            </h3>
            <p className="text-gray-600 text-md mb-12">
              Seven unique data analysis approaches, each offering a distinct
              perspective to uncover new growth opportunities . By examining
              your data from multiple angles, you’ll gain deeper insights to
              unlock a range of strategies to optimize and expand your business.
            </p>
            <Link
              href="/features/insights"
              className="text-orange-500 text-lg font-semibold hover:underline"
            >
              Learn More
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center bg-white shadow-lg rounded-lg p-8 hover:bg-[#f7f7f7] transition-colors duration-200">
            <FontAwesomeIcon
              icon={faBrain}
              size="3x"
              className="text-orange-500 mb-4"
            />
            <h3 className="text-2xl font-semibold mb-10 mt-2">AI Assistant</h3>
            <p className="text-gray-600 text-md mb-12">
              Use an AI assistant for instant insights and easy access to key
              data points. The AI-driven chat helps you interpret complex data
              quickly, streamlining your search for specific information to make
              informed decisions faster
            </p>
            <Link
              href="/features/ai-analysis"
              className="text-orange-500 text-lg font-semibold hover:underline"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
