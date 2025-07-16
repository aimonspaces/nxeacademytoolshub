import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import ScriptCard from '../components/ScriptCard';
import {
  UserIcon,
  EnvelopeIcon,
  PencilIcon,
  KeyIcon,
  DocumentTextIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { id } = useParams();
  const { user, updateProfile, updatePassword } = useAuth();
  const [profile, setProfile] = useState(null);
  const [scripts, setScripts] = useState([]);
  const [starredScripts, setStarredScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('scripts');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const isOwnProfile = user && (!id || id === user._id);
  const profileId = id || (user && user._id);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) return;

      try {
        setLoading(true);
        const res = await axios.get(`/api/auth/profile/${profileId}`);
        setProfile(res.data);
        setFormData({
          username: res.data.username,
          email: res.data.email,
          bio: res.data.bio || '',
          avatar: res.data.avatar || '',
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
        setLoading(false);
      }
    };

    const fetchScripts = async () => {
      if (!profileId) return;

      try {
        const res = await axios.get(`/api/scripts/user/${profileId}`);
        setScripts(res.data);
      } catch (error) {
        console.error('Error fetching scripts:', error);
        toast.error('Failed to load scripts');
      }
    };

    const fetchStarredScripts = async () => {
      if (!isOwnProfile) return;

      try {
        const res = await axios.get('/api/scripts/starred');
        setStarredScripts(res.data);
      } catch (error) {
        console.error('Error fetching starred scripts:', error);
        toast.error('Failed to load starred scripts');
      }
    };

    fetchProfile();
    fetchScripts();
    if (isOwnProfile) {
      fetchStarredScripts();
    }
  }, [profileId, isOwnProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      await updatePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(
        error.response?.data?.message || 'Failed to update password'
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Profile not found</h2>
        <p className="text-gray-600 mt-2">
          The profile you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/" className="btn btn-primary mt-6">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {isEditing ? (
          <form onSubmit={handleProfileUpdate}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Edit Profile
            </h2>

            <div className="mb-4">
              <label htmlFor="username" className="label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="bio" className="label">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="input min-h-[100px]"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="avatar" className="label">
                Avatar URL
              </label>
              <input
                type="text"
                id="avatar"
                name="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
                className="input"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        ) : isChangingPassword ? (
          <form onSubmit={handlePasswordUpdate}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Change Password
            </h2>

            <div className="mb-4">
              <label htmlFor="currentPassword" className="label">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="input"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="newPassword" className="label">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="input"
                required
                minLength="6"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="label">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="input"
                required
                minLength="6"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsChangingPassword(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Update Password
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-xl mr-4">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.username}
                      className="h-16 w-16 rounded-full"
                    />
                  ) : (
                    profile.username.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile.username}
                  </h1>
                  <p className="text-gray-600">
                    {profile.role === 'admin' ? 'Administrator' : 'Member'}
                  </p>
                </div>
              </div>

              {isOwnProfile && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full"
                    title="Edit Profile"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full"
                    title="Change Password"
                  >
                    <KeyIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700">
                  Member since{' '}
                  {new Date(profile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700">{profile.email}</span>
              </div>
            </div>

            {profile.bio && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Bio</h3>
                <p className="text-gray-700">{profile.bio}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Tabs */}
      {!isEditing && !isChangingPassword && (
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('scripts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'scripts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Scripts
                </div>
              </button>
              {isOwnProfile && (
                <button
                  onClick={() => setActiveTab('starred')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'starred'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 mr-2" />
                    Starred
                  </div>
                </button>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Scripts List */}
      {!isEditing && !isChangingPassword && (
        <div>
          {activeTab === 'scripts' ? (
            scripts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {scripts.map((script) => (
                  <ScriptCard key={script._id} script={script} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No scripts yet
                </h3>
                <p className="text-gray-600 mb-6">
                  {isOwnProfile
                    ? "You haven't created any scripts yet."
                    : "This user hasn't created any scripts yet."}
                </p>
                {isOwnProfile && (
                  <Link to="/submit" className="btn btn-primary">
                    Create Your First Script
                  </Link>
                )}
              </div>
            )
          ) : (
            starredScripts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {starredScripts.map((script) => (
                  <ScriptCard key={script._id} script={script} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No starred scripts
                </h3>
                <p className="text-gray-600 mb-6">
                  You haven't starred any scripts yet.
                </p>
                <Link to="/" className="btn btn-primary">
                  Explore Scripts
                </Link>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;