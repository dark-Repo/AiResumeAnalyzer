import React, { useState } from 'react';
import ResumeForm from './components/ResumeForm.jsx';
import AnalysisResult from './components/AnalysisResult.jsx';
import Loader from './components/Loader.jsx';
import { analyzeResume } from './services/geminiService.js';

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (formData) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await analyzeResume(
        formData.jobTitle,
        formData.jobDescription,
        formData.keySkills,
        formData.resumeFile
      );
      setAnalysis(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setError(null);
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <main className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
            AI Resume Analyzer
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Get instant feedback on your resume against any job description.
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg transition-all">
          {!analysis && !isLoading && (
            <ResumeForm onSubmit={handleAnalyze} isLoading={isLoading} />
          )}

          {isLoading && <Loader />}

          {error && (
            <div className="text-center">
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <span className="font-medium">Analysis Failed!</span> {error}
              </div>
              <button
                onClick={handleReset}
                className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Try Again
              </button>
            </div>
          )}

          {analysis && !isLoading && (
            <div>
              <AnalysisResult result={analysis} />
              <div className="mt-8 text-center">
                <button
                  onClick={handleReset}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Analyze Another Resume
                </button>
              </div>
            </div>
          )}
        </div>
        <footer className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Trade Mard Codetrix</p>
        </footer>
      </main>
    </div>
  );
}

export default App;