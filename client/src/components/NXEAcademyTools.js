import React from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const NXEAcademyTools = ({ featuredTools = [] }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-xl overflow-hidden">
      <div className="px-6 py-8 md:p-10 text-white">
        <div className="flex items-center">
          <SparklesIcon className="h-8 w-8 mr-3" />
          <h2 className="text-2xl font-bold">NXE Academy Tools</h2>
        </div>
        
        <p className="mt-4 text-blue-100">
          Discover our exclusive collection of developer tools designed to enhance your coding experience.
          These tools are created and maintained by the NXE Academy team.
        </p>
        
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featuredTools.length > 0 ? (
            featuredTools.map((tool) => (
              <div key={tool._id} className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-filter backdrop-blur-sm hover:bg-opacity-20 transition-all">
                <h3 className="font-semibold text-lg">{tool.title}</h3>
                <p className="mt-2 text-blue-100 text-sm line-clamp-3">{tool.description}</p>
                <Link 
                  to={`/scripts/${tool._id}`}
                  className="mt-3 inline-flex items-center text-sm font-medium text-blue-200 hover:text-white"
                >
                  View Tool
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-6">
              <p className="text-blue-100">Loading featured tools...</p>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            to="/nxe-academy-tools"
            className="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-blue-600"
          >
            Explore All NXE Academy Tools
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NXEAcademyTools;