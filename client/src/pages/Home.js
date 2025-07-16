import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

// Components
import ScriptCard from '../components/ScriptCard';
import NXEAcademyTools from '../components/NXEAcademyTools';

const Home = () => {
  const [scripts, setScripts] = useState([]);
  const [featuredTools, setFeaturedTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    language: '',
    tag: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Languages for filter
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

  // Fetch scripts
  useEffect(() => {
    const fetchScripts = async () => {
      try {
        setLoading(true);
        
        // Build query params
        const params = new URLSearchParams();
        params.append('page', pagination.page);
        params.append('limit', pagination.limit);
        
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        
        if (filters.language) {
          params.append('language', filters.language);
        }
        
        if (filters.tag) {
          params.append('tag', filters.tag);
        }
        
        const res = await axios.get(`/api/scripts?${params.toString()}`);
        setScripts(res.data.scripts);
        setPagination(res.data.pagination);
        
        // Fetch featured NXE Academy tools
        const toolsRes = await axios.get('/api/scripts/nxe-tools');
        setFeaturedTools(toolsRes.data.nxeTools.slice(0, 3)); // Get top 3 tools
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching scripts:', error);
        toast.error('Failed to load scripts');
        setLoading(false);
      }
    };

    fetchScripts();
  }, [pagination.page, pagination.limit, searchTerm, filters]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to page 1 when searching
    setPagination({ ...pagination, page: 1 });
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    // Reset to page 1 when filtering
    setPagination({ ...pagination, page: 1 });
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-xl overflow-hidden mb-10">
        <div className="px-6 py-12 md:px-12 text-center md:text-left">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-3/5">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                NXE Academy Tools Hub
              </h1>
              <p className="text-blue-100 text-lg mb-6">
                A modern GitHub alternative for developers to share scripts and explore
                the exclusive NXE Academy All Tools collection.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                <Link
                  to="/signup"
                  className="btn btn-primary bg-white text-blue-600 hover:bg-blue-50"
                >
                  Join the Community
                </Link>
                <Link
                  to="/nxe-academy-tools"
                  className="btn btn-secondary bg-transparent border border-white text-white hover:bg-blue-700"
                >
                  Explore NXE Tools
                </Link>
              </div>
            </div>
            <div className="hidden md:block md:w-2/5">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-800 rounded-full opacity-20 transform scale-95 translate-x-4 translate-y-4"></div>
                <div className="relative bg-white rounded-xl shadow-lg p-6">
                  <div className="text-gray-800 font-mono text-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <pre className="text-blue-600">
                      <code>
                        {`// NXE Academy Tools Hub
// Share your best scripts

const nxeTools = {
  discover: true,
  share: true,
  collaborate: true
};

// Join us today!`}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured NXE Academy Tools */}
      <section className="mb-10">
        <NXEAcademyTools featuredTools={featuredTools} />
      </section>

      {/* Search and Filters */}
      <section className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Explore Scripts
          </h2>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <form onSubmit={handleSearch} className="flex">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search scripts..."
                  className="input pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-blue-600"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </div>
            </form>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-secondary flex items-center justify-center"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-1" />
              Filters
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="language" className="label">
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  className="input"
                  value={filters.language}
                  onChange={handleFilterChange}
                >
                  <option value="">All Languages</option>
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="tag" className="label">
                  Tag
                </label>
                <input
                  type="text"
                  id="tag"
                  name="tag"
                  placeholder="Filter by tag"
                  className="input"
                  value={filters.tag}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setFilters({ language: '', tag: '' });
                  setPagination({ ...pagination, page: 1 });
                }}
                className="btn btn-secondary mr-2"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="btn btn-primary"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Scripts List */}
      <section>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : scripts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scripts.map((script) => (
              <ScriptCard key={script._id} script={script} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No scripts found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filters.language || filters.tag
                ? 'Try adjusting your search or filters'
                : 'Be the first to share a script!'}
            </p>
            <Link to="/submit" className="btn btn-primary">
              Submit a Script
            </Link>
          </div>
        )}

        {/* Pagination */}
        {scripts.length > 0 && pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`px-3 py-1 rounded-md ${pagination.page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Previous
              </button>
              {[...Array(pagination.pages).keys()].map((page) => (
                <button
                  key={page + 1}
                  onClick={() => handlePageChange(page + 1)}
                  className={`px-3 py-1 rounded-md ${pagination.page === page + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {page + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className={`px-3 py-1 rounded-md ${pagination.page === pagination.pages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;