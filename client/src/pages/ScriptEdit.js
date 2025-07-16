import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const ScriptEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    language: 'javascript',
    tags: '',
    isPublic: true,
    isNXEAcademyTool: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchScript = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/scripts/${id}`);
        const script = res.data;
        
        // Check if user is authorized to edit this script
        if (user._id !== script.author._id && user.role !== 'admin') {
          toast.error('You are not authorized to edit this script');
          navigate(`/scripts/${id}`);
          return;
        }
        
        setFormData({
          title: script.title,
          description: script.description,
          content: script.content,
          language: script.language,
          tags: script.tags.join(', '),
          isPublic: script.isPublic,
          isNXEAcademyTool: script.isNXEAcademyTool,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching script:', error);
        toast.error('Failed to load script details');
        navigate('/');
      }
    };

    fetchScript();
  }, [id, navigate, user]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Script content is required';
    }
    if (!formData.language) {
      newErrors.language = 'Language is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      // Process tags from comma-separated string to array
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '');

      const scriptData = {
        ...formData,
        tags: tagsArray,
      };

      await axios.put(`/api/scripts/${id}`, scriptData);
      toast.success('Script updated successfully!');
      navigate(`/scripts/${id}`);
    } catch (error) {
      console.error('Error updating script:', error);
      toast.error(
        error.response?.data?.message || 'Failed to update script'
      );
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Script</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="label">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`input ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Enter a descriptive title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`input min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Provide a brief description of what your script does"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="label">
              Script Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className={`input min-h-[300px] font-mono ${errors.content ? 'border-red-500' : ''}`}
              placeholder="Paste your code here"
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
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
                value={formData.language}
                onChange={handleChange}
                className={`input ${errors.language ? 'border-red-500' : ''}`}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="bash">Bash</option>
                <option value="java">Java</option>
                <option value="c#">C#</option>
                <option value="c++">C++</option>
                <option value="other">Other</option>
              </select>
              {errors.language && (
                <p className="text-red-500 text-sm mt-1">{errors.language}</p>
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
                value={formData.tags}
                onChange={handleChange}
                className="input"
                placeholder="automation, utility, web"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
            <div className="flex items-center mb-2 md:mb-0">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="ml-2 text-gray-700">
                Make script public
              </label>
            </div>

            {user && user.role === 'admin' && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isNXEAcademyTool"
                  name="isNXEAcademyTool"
                  checked={formData.isNXEAcademyTool}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isNXEAcademyTool" className="ml-2 text-gray-700">
                  Mark as NXE Academy Tool
                </label>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(`/scripts/${id}`)}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </>
              ) : (
                'Update Script'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScriptEdit;