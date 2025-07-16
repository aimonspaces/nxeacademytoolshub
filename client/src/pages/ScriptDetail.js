import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import {
  StarIcon,
  CodeBracketIcon,
  ClockIcon,
  UserIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-cpp';

const ScriptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [script, setScript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(0);
  const [forkCount, setForkCount] = useState(0);

  useEffect(() => {
    const fetchScript = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/scripts/${id}`);
        setScript(res.data);
        setIsStarred(res.data.isStarredByUser);
        setStarCount(res.data.stars);
        setForkCount(res.data.forks);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching script:', error);
        toast.error('Failed to load script details');
        setLoading(false);
        if (error.response && error.response.status === 404) {
          navigate('/not-found');
        }
      }
    };

    fetchScript();
  }, [id, navigate]);

  useEffect(() => {
    if (script && !loading) {
      Prism.highlightAll();
    }
  }, [script, loading]);

  const handleStar = async () => {
    if (!user) {
      toast.info('Please log in to star scripts');
      navigate('/login');
      return;
    }

    try {
      const res = await axios.post(`/api/scripts/${id}/star`);
      setIsStarred(res.data.isStarred);
      setStarCount(res.data.starCount);
      toast.success(res.data.isStarred ? 'Script starred!' : 'Star removed');
    } catch (error) {
      console.error('Error starring script:', error);
      toast.error('Failed to star script');
    }
  };

  const handleFork = async () => {
    if (!user) {
      toast.info('Please log in to fork scripts');
      navigate('/login');
      return;
    }

    try {
      const res = await axios.post(`/api/scripts/${id}/fork`);
      setForkCount(res.data.forkCount);
      toast.success('Script forked successfully!');
      navigate(`/scripts/${res.data.newScriptId}`);
    } catch (error) {
      console.error('Error forking script:', error);
      toast.error('Failed to fork script');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this script?')) {
      return;
    }

    try {
      await axios.delete(`/api/scripts/${id}`);
      toast.success('Script deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting script:', error);
      toast.error('Failed to delete script');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get language class for Prism
  const getLanguageClass = (language) => {
    const languageMap = {
      javascript: 'javascript',
      python: 'python',
      bash: 'bash',
      java: 'java',
      'c#': 'csharp',
      'c++': 'cpp',
    };

    return languageMap[language.toLowerCase()] || 'javascript';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!script) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Script not found</h2>
        <p className="text-gray-600 mt-2">The script you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="btn btn-primary mt-6">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Script Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{script.title}</h1>
          <div className="flex space-x-2">
            {user && (script.author._id === user._id || user.role === 'admin') && (
              <>
                <Link
                  to={`/scripts/${id}/edit`}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full"
                  title="Edit Script"
                >
                  <PencilIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full"
                  title="Delete Script"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-gray-600 mt-3">{script.description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {script.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <button
              onClick={handleStar}
              className={`flex items-center space-x-1 ${isStarred ? 'text-yellow-500' : 'text-gray-500'} hover:text-yellow-500`}
            >
              {isStarred ? <StarIconSolid className="h-5 w-5" /> : <StarIcon className="h-5 w-5" />}
              <span>{starCount}</span>
            </button>
            <button
              onClick={handleFork}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
            >
              <ArrowPathIcon className="h-5 w-5" />
              <span>{forkCount}</span>
            </button>
            <div className="flex items-center space-x-1 text-gray-500">
              <CodeBracketIcon className="h-5 w-5" />
              <span className="capitalize">{script.language}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-gray-500">
              <ClockIcon className="h-5 w-5" />
              <span>{formatDate(script.createdAt)}</span>
            </div>
            <Link to={`/profile/${script.author._id}`} className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
              <UserIcon className="h-5 w-5" />
              <span>{script.author.username}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Script Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
          <span className="font-medium text-gray-700">Script Content</span>
          {script.isNXEAcademyTool && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              NXE Academy Tool
            </span>
          )}
        </div>
        <div className="p-4 overflow-x-auto">
          <pre className="rounded bg-gray-50">
            <code className={`language-${getLanguageClass(script.language)}`}>
              {script.content}
            </code>
          </pre>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between mb-12">
        <Link to="/" className="btn btn-secondary">
          Back to Scripts
        </Link>
        {user && (
          <div className="flex space-x-3">
            <button onClick={handleStar} className="btn btn-secondary">
              {isStarred ? 'Unstar' : 'Star'} Script
            </button>
            <button onClick={handleFork} className="btn btn-primary">
              Fork Script
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptDetail;