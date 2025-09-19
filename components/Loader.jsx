import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Analyzing your resume...</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">This may take a few moments. Please wait.</p>
    </div>
  );
};

export default Loader;