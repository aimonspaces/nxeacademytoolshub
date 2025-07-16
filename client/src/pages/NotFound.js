import React from 'react';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex space-x-4">
        <Link to="/" className="btn btn-primary">
          Go to Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="btn btn-secondary"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;