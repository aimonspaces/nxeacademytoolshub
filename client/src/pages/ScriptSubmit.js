import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const ScriptSubmit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    language: 'javascript',
    tags: '',
    isPublic: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Languages options
  const languages = [
    'javascript',
    'python',
    'java',
    'csharp',
    'cpp',
    'php',
    'ruby',
    'go',
    'rust',
    'typescript',
    'bash',
    'powershell',
    'other',
  ];

  const { title, description, content, language, tags, isPublic } = formData;

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!title) {
      newErrors.title = 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    if (!description) {
      newErrors.description = 'Description is required';
    } else if (description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    if (!content) {
      newErrors.content = 'Script content is required';
    }

    if (!language) {
      newErrors.language = 'Language is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true);

      try {
        // Process tags from comma-separated string to array
        const tagsArray = tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag !== '');

        const scriptData = {
          ...formData,
          tags: tagsArray,
        };

        const res = await axios.post('/api/scripts', scriptData);

        toast.success('Script submitted successfully!');
        navigate(`/scripts/${res.data.script._id}`);
      } catch (error) {
        console.error('Script submission error:', error);
        const message = error.response?.data?.message || 'Failed to submit script';
        toast.error(message);
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-6">
        <h1 className="text-2xl font-bold mb-6">Submit a Script</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="label">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className={`input ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Enter a descriptive title"
              value={title}
              onChange={handleChange}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              className={`input ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Describe what your script does"
              value={description}
              onChange={handleChange}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="language" className="label">
                Language
              </label>
              <select
                id="language"
                name="language"
                className={`input ${errors.language ? 'border-red-500' : ''}`}
                value={language}
                onChange={handleChange}
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
              {errors.language && (
                <p className="text-red-500 text-xs mt-1">{errors.language}</p>
              )}
            </div>

            <div>
              <label htmlFor="tags" className="label">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                className="input"
                placeholder="e.g. utility, file, automation"
                value={tags}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="content" className="label">
              Script Content
            </label>
            <textarea
              id="content"
              name="content"
              rows="12"
              className={`input font-mono ${errors.content ? 'border-red-500' : ''}`}
              placeholder="Paste your script code here"
              value={content}
              onChange={handleChange}
            ></textarea>
            {errors.content && (
              <p className="text-red-500 text-xs mt-1">{errors.content}</p>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={isPublic}
                onChange={handleChange}
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                Make this script public
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Public scripts can be viewed and forked by other users. Private scripts are only visible to you.
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Script'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScriptSubmit;