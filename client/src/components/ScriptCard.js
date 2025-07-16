import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const ScriptCard = ({ script, onStar, isStarred }) => {
  const {
    _id,
    title,
    description,
    language,
    author,
    stars,
    forks,
    createdAt,
    isNXEAcademyTool,
  } = script;

  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Language color mapping
  const languageColors = {
    javascript: 'bg-yellow-300',
    python: 'bg-blue-500',
    java: 'bg-red-500',
    csharp: 'bg-green-500',
    cpp: 'bg-purple-500',
    php: 'bg-indigo-500',
    ruby: 'bg-red-600',
    go: 'bg-blue-400',
    rust: 'bg-orange-600',
    typescript: 'bg-blue-600',
    bash: 'bg-gray-700',
    powershell: 'bg-blue-800',
    other: 'bg-gray-500',
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Link to={`/scripts/${_id}`} className="text-lg font-semibold text-blue-600 hover:text-blue-800">
              {title}
            </Link>
            {isNXEAcademyTool && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                NXE Tool
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onStar && onStar(_id)}
              className="flex items-center text-gray-500 hover:text-yellow-500"
              aria-label={isStarred ? 'Unstar this script' : 'Star this script'}
            >
              {isStarred ? (
                <StarIconSolid className="h-5 w-5 text-yellow-500" />
              ) : (
                <StarIcon className="h-5 w-5" />
              )}
              <span className="ml-1">{stars}</span>
            </button>
            <div className="flex items-center text-gray-500">
              <CodeBracketIcon className="h-5 w-5" />
              <span className="ml-1">{forks}</span>
            </div>
          </div>
        </div>

        <p className="mt-2 text-gray-600 line-clamp-2">{description}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                {author?.avatar ? (
                  <img
                    src={author.avatar}
                    alt={author.username}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  author?.username?.charAt(0).toUpperCase()
                )}
              </div>
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium text-gray-900">
                {author?.username || 'Unknown'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="inline-block h-3 w-3 rounded-full mr-1.5" 
                style={{ backgroundColor: languageColors[language]?.substring(3) || '#6B7280' }}></span>
              <span className="text-xs text-gray-500 capitalize">{language}</span>
            </div>
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptCard;