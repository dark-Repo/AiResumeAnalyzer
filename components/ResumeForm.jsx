import React, { useState } from 'react';
import { UploadIcon } from './icons/UploadIcon.jsx';

const ResumeForm = ({ onSubmit, isLoading }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [keySkills, setKeySkills] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic validation for file type and size
      if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(file.type)) {
        setError('Please upload a PDF, DOCX, or TXT file.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB.');
        return;
      }
      setResumeFile(file);
      setFileName(file.name);
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!jobTitle || !jobDescription || !resumeFile) {
      setError('Please fill in all fields and upload a resume.');
      return;
    }
    setError('');
    onSubmit({ jobTitle, jobDescription, keySkills, resumeFile });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">{error}</div>}
      
      <div>
        <label htmlFor="job-title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Job Title</label>
        <input
          type="text"
          id="job-title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder="e.g., Senior Frontend Developer"
          required
        />
      </div>

      <div>
        <label htmlFor="job-description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Job Description</label>
        <textarea
          id="job-description"
          rows={6}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder="Paste the full job description here..."
          required
        ></textarea>
      </div>

      <div>
        <label htmlFor="key-skills" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Key Skills (Optional)
        </label>
        <input
          type="text"
          id="key-skills"
          value={keySkills}
          onChange={(e) => setKeySkills(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder="e.g., React, TypeScript, Tailwind CSS"
        />
      </div>
      
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload Resume</label>
        <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadIcon className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"/>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOCX or TXT (MAX. 5MB)</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.txt" />
            </label>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">{fileName}</p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Analyzing...' : 'Analyze Resume'}
      </button>
    </form>
  );
};

export default ResumeForm;