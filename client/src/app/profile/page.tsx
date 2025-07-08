'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Calendar, 
  Lock, 
  Edit, 
  Save, 
  X, 
  Bell, 
  Shield, 
  CreditCard,
  Settings,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';

// User interface
type UserType = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  phone: string;
  currency: string;
  timezone: string;
  avatar: string | null;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
};

// Default user data structure
const defaultUser: UserType = {
  id: '',
  name: '',
  email: '',
  createdAt: new Date().toISOString(),
  phone: '',
  currency: 'USD',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  avatar: null,
  notifications: {
    email: true,
    push: true,
    sms: false
  }
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserType>(defaultUser);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const router = useRouter();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Get current user data from the backend
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUser(prev => ({
          ...prev,
          ...userData,
          createdAt: userData.createdAt || new Date().toISOString()
        }));
        setEditData({
          name: userData.name,
          email: userData.email,
          phone: userData.phone || ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSave = async () => {
    if (!editData.name.trim() || !editData.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      
      // Update local state with the updated user data
      setUser(prev => ({
        ...prev,
        ...updatedUser,
        name: editData.name,
        email: editData.email,
        phone: editData.phone
      }));
      
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: user.name,
      email: user.email,
      phone: user.phone
    });
    setIsEditing(false);
  };

  const toggleNotification = (type: 'email' | 'push' | 'sms') => {
    setUser({
      ...user,
      notifications: {
        ...user.notifications,
        [type]: !user.notifications[type]
      }
    });
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} notifications ${user.notifications[type] ? 'disabled' : 'enabled'}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-300 text-lg">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Navbar />
      
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
              <p className="text-gray-300 mt-1">Manage your account and preferences</p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors duration-200"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-400" />
                Basic Information
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full" />
                    ) : (
                      <User className="h-10 w-10 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{user.name}</h3>
                    <p className="text-gray-400">Member since {formatDate(user.createdAt)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-white"
                      />
                    ) : (
                      <p className="text-white">{user.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-white"
                      />
                    ) : (
                      <p className="text-white">{user.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-white"
                      />
                    ) : (
                      <p className="text-white">{user.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Member Since
                    </label>
                    <p className="text-white">{formatDate(user.createdAt)}</p>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className={`bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 ${
                        isSaving ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2 transition-colors duration-200"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-blue-400" />
                Preferences
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Currency
                  </label>
                  <select
                    value={user.currency}
                    onChange={(e) => setUser({ ...user, currency: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-white"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD (C$)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Timezone
                  </label>
                  <select
                    value={user.timezone}
                    onChange={(e) => setUser({ ...user, timezone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-white"
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-blue-400" />
                Notifications
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Email Notifications</p>
                    <p className="text-sm text-gray-400">Receive updates via email</p>
                  </div>
                  <button
                    onClick={() => toggleNotification('email')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      user.notifications.email ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        user.notifications.email ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Push Notifications</p>
                    <p className="text-sm text-gray-400">Receive updates in browser</p>
                  </div>
                  <button
                    onClick={() => toggleNotification('push')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      user.notifications.push ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        user.notifications.push ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">SMS Notifications</p>
                    <p className="text-sm text-gray-400">Receive updates via SMS</p>
                  </div>
                  <button
                    onClick={() => toggleNotification('sms')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      user.notifications.sms ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        user.notifications.sms ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-400" />
                Security
              </h2>
              
              <div className="space-y-4">
                <button className="w-full text-left p-3 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">Change Password</p>
                      <p className="text-sm text-gray-400">Update your password</p>
                    </div>
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-400">Add extra security</p>
                    </div>
                    <Shield className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-blue-400" />
                Account
              </h2>
              
              <div className="space-y-4">
                <button className="w-full text-left p-3 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">Export Data</p>
                      <p className="text-sm text-gray-400">Download your data</p>
                    </div>
                    <CreditCard className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg border border-red-600 hover:bg-red-900/20 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-400">Delete Account</p>
                      <p className="text-sm text-red-500">Permanently delete account</p>
                    </div>
                    <CreditCard className="h-4 w-4 text-red-400" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 