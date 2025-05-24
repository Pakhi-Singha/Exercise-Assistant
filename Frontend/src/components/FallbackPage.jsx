import React from 'react';
import { Link } from 'react-router-dom';

const FallbackPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Page Not Available</h1>
        <p className="text-gray-600 mb-6">
          We're having trouble loading this page. This could be due to a temporary issue.
        </p>
        <div className="flex flex-col space-y-3">
          <Link 
            to="/" 
            className="px-4 py-2 bg-[#178582] text-white rounded hover:bg-teal-700 text-center"
          >
            Go to Home Page
          </Link>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default FallbackPage;