'use client';

import { useState } from 'react';

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setText('');
    setFile(selectedFile);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please upload a file.');
      return;
    }

    setLoading(true);
    setError(null);

    alert('test');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setText(data.text);
      } else {
        setError(data.message || 'Failed to process the file.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('An error occurred while processing your request.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text || !question) {
      setError('Please upload a file and enter a question.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('text', text);
    formData.append('question', question);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setAnswer(data.answer);
      } else {
        setError(data.message || 'Failed to process the text.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('An error occurred while processing your request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">PDF Question Answering</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (text === '') {
            handleUpload(e); // Call handleUpload if text is empty
          } else {
            handleSubmit(e); // Call handleSubmit if text is not empty
          }
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload PDF
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Your Question
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </div>
      </form>
      <div className="w-full">
        {file ? (
          <div className="max-w-9/10 shadow-md rounded-lg p-6 m-2">
            <iframe
              src={URL.createObjectURL(file)}
              width="100%"
              height="650"
              title="PDF Viewer"
            />
          </div>
        ) : (
          <div className="text-center mt-10">
            <label htmlFor="file">
              <div className="border-4 border-dashed border-gray-300 rounded-lg p-12 bg-white shadow-md cursor-pointer">
                <div className="text-6xl text-gray-400 mb-4">+</div>
                <div className="text-xl text-gray-600">Upload your PDF</div>
              </div>
            </label>
          </div>
        )}
      </div>
      {text && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Answer:</h2>
          <p className="whitespace-pre-wrap bg-green-100 p-4 rounded">{text}</p>
        </div>
      )}
      {answer && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Answer:</h2>
          <p className="whitespace-pre-wrap bg-green-100 p-4 rounded">
            {answer[0]}
          </p>
          <h2 className="text-lg font-semibold">Answer:</h2>
          <p className="whitespace-pre-wrap bg-green-100 p-4 rounded">
            {answer[1]}
          </p>
        </div>
      )}
    </div>
  );
}

// 'use client';

// import { useState } from 'react';
// import axios from 'axios';

// const DashboardLayout = () => {
//   const [pdfFile, setPdfFile] = useState<File | null>(null);
//   const [pdfText, setPdfText] = useState<string>('');
//   const [question, setQuestion] = useState<string>('');
//   const [answer, setAnswer] = useState<string>('');

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setPdfFile(e.target.files[0]);
//     }
//   };

//   const handleFileUpload = async () => {
//     if (pdfFile) {
//       const formData = new FormData();
//       formData.append('file', pdfFile);

//       const response = await axios.post(
//         '/api/parse-pdf'
//         // , formData, {
//         // headers: {
//         //   'Content-Type': 'multipart/form-data'
//         // }
//         // }
//       );

//       setPdfText(response.data.text);
//     }
//   };

//   const handleQuestionSubmit = async () => {
//     // Implement logic to send the question and extracted text to a language model
//     // For example, using OpenAI's API or a custom NLP model.
//     const response = await axios.post('/api/answer-question', {
//       question,
//       text: pdfText
//     });

//     setAnswer(response.data.answer);
//   };

//   return (
//     <div>
//       <h1>Upload PDF and Ask Questions</h1>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleFileUpload}>Extract Text</button>

//       <textarea
//         value={pdfText}
//         readOnly
//         placeholder="Extracted text will appear here..."
//       />

//       <input
//         type="text"
//         value={question}
//         onChange={(e) => setQuestion(e.target.value)}
//         placeholder="Ask a question"
//       />
//       <button onClick={handleQuestionSubmit}>Get Answer</button>

//       <p>Answer: {answer}</p>
//     </div>
//   );
// };

// export default DashboardLayout;
