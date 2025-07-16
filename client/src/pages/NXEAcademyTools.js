import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SparklesIcon, StarIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const NXEAcademyTools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/scripts/nxe-tools');
        setTools(res.data.nxeTools);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching NXE tools:', error);
        toast.error('Failed to load NXE Academy tools');
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-xl overflow-hidden mb-10">
        <div className="px-6 py-12 md:px-12 text-white">
          <div className="flex items-center justify-center mb-6">
            <SparklesIcon className="h-10 w-10 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold">NXE Academy Tools</h1>
          </div>
          <p className="text-center text-blue-100 text-lg max-w-3xl mx-auto">
            Discover our exclusive collection of developer tools designed to enhance your coding experience.
            These tools are created and maintained by the NXE Academy team.
          </p>
        </div>
      </section>

      {/* Tools List */}
      <section>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : tools.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <div key={tool._id} className="card hover:shadow-lg transition-shadow duration-300">
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <Link
                      to={`/scripts/${tool._id}`}
                      className="text-xl font-semibold text-blue-600 hover:text-blue-800"
                    >
                      {tool.title}
                    </Link>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-gray-500">
                        <StarIcon className="h-5 w-5" />
                        <span className="ml-1">{tool.stars}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <CodeBracketIcon className="h-5 w-5" />
                        <span className="ml-1">{tool.forks}</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-gray-600">{tool.description}</p>

                  <div className="mt-4 flex items-center">
                    <span className="inline-block h-3 w-3 rounded-full mr-1.5 bg-blue-500"></span>
                    <span className="text-sm text-gray-500 capitalize">{tool.language}</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {tool.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                          {tool.author?.avatar ? (
                            <img
                              src={tool.author.avatar}
                              alt={tool.author.username}
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            tool.author?.username?.charAt(0).toUpperCase()
                          )}
                        </div>
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium text-gray-900">
                          {tool.author?.username || 'NXE Academy'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(tool.createdAt)}
                    </span>
                  </div>

                  <div className="mt-6">
                    <Link
                      to={`/scripts/${tool._id}`}
                      className="btn btn-primary w-full flex items-center justify-center"
                    >
                      View Tool
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No tools available yet
            </h3>
            <p className="text-gray-600">
              Check back soon for our exclusive NXE Academy tools collection.
            </p>
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Want to contribute to NXE Academy Tools?
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          If you have a great tool or script that you think would benefit the developer community,
          submit it to our platform and it might be featured in the NXE Academy Tools collection.
        </p>
        <Link to="/submit" className="btn btn-primary">
          Submit Your Script
        </Link>
      </section>
    </div>
  );
};

export default NXEAcademyTools;