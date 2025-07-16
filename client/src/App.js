import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ScriptSubmit from './pages/ScriptSubmit';
import ScriptDetail from './pages/ScriptDetail';
import Profile from './pages/Profile';
import NXEAcademyTools from './pages/NXEAcademyTools';
import NotFound from './pages/NotFound';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/submit" element={
              <ProtectedRoute>
                <ScriptSubmit />
              </ProtectedRoute>
            } />
            <Route path="/scripts/:id" element={<ScriptDetail />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/nxe-academy-tools" element={<NXEAcademyTools />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold">NXE Academy Tools Hub</h3>
                <p className="text-gray-400">A GitHub Alternative for Developers</p>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Contact Us
                </a>
              </div>
            </div>
            <div className="mt-6 text-center text-gray-400">
              &copy; {new Date().getFullYear()} NXE Academy. All rights reserved.
            </div>
          </div>
        </footer>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AuthProvider>
  );
}

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;