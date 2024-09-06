'use client';

import { useMemo, useState } from 'react';

export default function DashboardForm() {
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

  const memoizedIframe = useMemo(() => {
    if (file) {
      return (
        <div className="max-w-9/10 shadow-md mt-6 mb-6">
          <iframe
            src={URL.createObjectURL(file)}
            width="100%"
            height="650"
            title="PDF Viewer"
          />
        </div>
      );
    }
    return null;
  }, [file]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please upload a file.');
      return;
    }

    setLoading(true);
    setError(null);

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
    <div>
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Find your quote!
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            1. Upload your PDF file below,
            <br />
            2. Process your PDF file,
            <br />
            3. Ask questions to get your in-text citations with ease!
            <br />
            4.{' '}
            <span
              onClick={() => window.location.reload()}
              className="cursor-pointer text-indigo-500 hover:underline"
            >
              Reload
            </span>{' '}
            to use different file.
          </p>
        </div>
      </div>
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
        <div className="w-full max-w-3xl m-auto my-8 border rounded-md p border-zinc-700">
          {text && (
            <div className="px-5 py-4">
              <label className="mb-1 text-2xl font-medium">Your Question</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question"
                className="mt-1 block w-full border border-gray-300 rounded-md text-black bg-gray-100 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm min-h-14 p-4"
              />
            </div>
          )}
          {answer && (
            <div className="w-full max-w-3xl m-auto px-5 py-4">
              <h2 className="mb-1 text-2xl font-medium">Answer</h2>
              <p className="mt-1 block w-full border border-gray-300 rounded-md text-black shadow-sm bg-gray-100 p-4 sm:text-sm whitespace-pre-wrap min-h-14">
                {answer[0]}
              </p>
              <h2 className="mb-1 text-2xl font-medium mt-4">Citation</h2>
              <p className="mt-1 block w-full border border-gray-300 rounded-md text-black shadow-sm bg-gray-100 p-4 sm:text-sm whitespace-pre-wrap min-h-14">
                {answer[1]}
              </p>
            </div>
          )}

          {error && <p className="text-red-500">{error}</p>}
          {file && (
            <div className="p-4 border-t rounded-b-md border-zinc-700 bg-zinc-900 text-zinc-500">
              <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
                <button
                  type="submit"
                  className={`mx-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500  ${
                    loading ? 'cursor-not-allowed bg-indigo-400' : ''
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-md"></span>
                  ) : text ? (
                    'Ask PDF'
                  ) : (
                    'Process PDF'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
      <div className="w-full max-w-3xl m-auto">
        {file ? (
          memoizedIframe
        ) : (
          <div className="text-center mt-10">
            <input
              type="file"
              id="file"
              className="hidden"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            <label htmlFor="file">
              <div className="border-4 border-dashed border-gray-300 rounded-lg p-12 bg-white shadow-md cursor-pointer">
                <div className="text-6xl text-gray-400 mb-4">+</div>
                <div className="text-xl text-gray-600">Upload your PDF</div>
              </div>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
