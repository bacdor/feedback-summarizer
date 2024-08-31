'use client';

// import Button from '@/components/ui/Button';
// import { useRouter, usePathname } from 'next/navigation';
// import { createStripePortal } from '@/utils/stripe/server';
// import Link from 'next/link';
// import Card from '@/components/ui/Card';
// import { Tables } from '@/types_db';

// import PdfViewer from "../components/PdfViewer";
import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';

export default function DashboardLayout() {
  const [file, setFile] = useState<File | null>(null); // State allows both File and null
  const [error, setError] = useState<string | null>(null);
  const [citations, setCitations] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Step 1
  const queryInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Use optional chaining to safely access the file

    if (file && file.type === 'application/pdf') {
      setFile(file);
      setError(''); // Clear any previous error messages
    } else {
      setError('Please upload a PDF file.');
    }
  };

  useEffect(() => {
    let fileUrl = '';

    if (file) {
      fileUrl = URL.createObjectURL(file);
    }
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [file]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const query = queryInputRef.current?.value || '';

    if (!file || !query) {
      setError('Please select a file and enter a query.');
      setIsLoading(false);
      return;
    }
    setError('');

    const formData = new FormData();
    if (file) {
      // Check if the file variable is truthy
      formData.append('pdf', file);
    } else {
      console.error('No file provided');
    }
    if (query) {
      // Check if the query variable is truthy
      formData.append('query', query);
    } else {
      console.error('No query provided');
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await res.json();
      setCitations(data.citations);
      console.log('Citations:', data.citations);
    } catch (err) {
      setError('Error extracting citations.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/2 w-full">
        <div className="max-w-9/10  rounded-lg p-6 m-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="file" className="form-control w-full">
                <div className="label">
                  <span className="label-text">Upload PDF:</span>
                </div>
                <input
                  type="file"
                  accept="application/pdf"
                  id="file"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered w-full"
                />
              </label>
            </div>
            <div>
              <label htmlFor="query" className="form-control w-full">
                <div className="label">
                  <span className="label-text">Provide your question:</span>
                </div>
                <input
                  type="text"
                  id="query"
                  ref={queryInputRef}
                  placeholder="Type your question here"
                  className="input input-bordered w-full"
                />
              </label>
            </div>
            <div className="flex justify-center items-center">
              <button
                type="submit"
                className="btn btn-active btn-neutral btn-lg m-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  <i className="fa-solid fa-arrow-right-long"></i>
                )}
              </button>
            </div>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          <div className="mt-4">
            <h2 className="text-xl font-bold">Extracted Content:</h2>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Answer:</span>
              </div>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="Here comes the answer..."
                value={citations[0]}
              ></textarea>
              <div className="label"></div>
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text">In-text citation:</span>
              </div>
              <textarea
                className="textarea textarea-bordered h-24"
                value={citations[1]}
                placeholder="Here comes the citation..."
              ></textarea>
              <div className="label"></div>
            </label>
          </div>
        </div>
      </div>
      <div className="md:w-1/2 w-full">
        {file ? (
          <div className="max-w-9/10 shadow-md rounded-lg p-6 m-2">
            <iframe
              src={URL.createObjectURL(file)}
              width="600"
              height="800"
              title="PDF Viewer"
              style={{ border: 'none' }}
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
    </div>
  );
}
