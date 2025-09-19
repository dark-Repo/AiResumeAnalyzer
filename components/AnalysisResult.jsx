import React from 'react';

const ScoreCircle = ({ score }) => {
    const circumference = 2 * Math.PI * 52; // 2 * pi * radius
    const offset = circumference - (score / 100) * circumference;
    const color = score > 75 ? 'text-green-500' : score > 50 ? 'text-yellow-500' : 'text-red-500';

    return (
        <div className="relative flex items-center justify-center w-36 h-36">
            <svg className="absolute w-full h-full" viewBox="0 0 120 120">
                <circle className="text-gray-200 dark:text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="52" cx="60" cy="60" />
                <circle
                    className={color}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="52"
                    cx="60"
                    cy="60"
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                />
            </svg>
            <span className={`absolute text-4xl font-bold ${color}`}>{score}%</span>
        </div>
    );
};

const KeywordChip = ({ text, type }) => {
    const baseClasses = "inline-block px-3 py-1 text-sm font-medium rounded-full";
    const typeClasses = type === 'found' 
        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    return <span className={`${baseClasses} ${typeClasses}`}>{text}</span>;
}

const AnalysisResult = ({ result }) => {
  return (
    <div className="space-y-8 animate-fade-in">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
                <ScoreCircle score={result.matchScore} />
            </div>
            <div className="flex-grow">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Overall Match Score</h2>
                <p className="text-gray-600 dark:text-gray-300">{result.summary}</p>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4">Strengths</h3>
                <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-300">
                    {result.strengths.map((item, index) => <li key={`strength-${index}`}>{item}</li>)}
                </ul>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400 mb-4">Areas for Improvement</h3>
                <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-300">
                    {result.improvements.map((item, index) => <li key={`improvement-${index}`}>{item}</li>)}
                </ul>
            </div>
        </div>
        
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Keyword Analysis</h3>
            <div className="mb-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Keywords Found</h4>
                <div className="flex flex-wrap gap-2">
                    {result.keywordAnalysis.found.length > 0 ? (
                        result.keywordAnalysis.found.map((keyword, index) => <KeywordChip key={`found-${index}`} text={keyword} type="found"/>)
                    ) : <p className="text-sm text-gray-500">No matching keywords found.</p>}
                </div>
            </div>
             <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Keywords Missing</h4>
                <div className="flex flex-wrap gap-2">
                    {result.keywordAnalysis.missing.length > 0 ? (
                        result.keywordAnalysis.missing.map((keyword, index) => <KeywordChip key={`missing-${index}`} text={keyword} type="missing"/>)
                    ) : <p className="text-sm text-gray-500">No missing keywords identified.</p>}
                </div>
            </div>
        </div>
    </div>
  );
};

export default AnalysisResult;