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

// Dummy user data for testing
const dummyUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: '2024-01-15T00:00:00.000Z',
  avatar: null,
  phone: '+1 (555) 123-4567',
  currency: 'USD',
  timezone: 'America/New_York',
  notifications: {
    email: true,
    push: true,
    sms: false
  }
};

export default function ProfilePage() {
  const [user, setUser] = useState(dummyUser);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone
  });
  const router = useRouter();

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

    // For now, just update local state
    setUser({ ...user, ...editData });
    setIsEditing(false);
    toast.success('Profile updated successfully!');
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account and preferences</p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2 transition-colors duration-200"
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Basic Information
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full" />
                    ) : (
                      <User className="h-10 w-10 text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                    <p className="text-gray-500">Member since {formatDate(user.createdAt)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      />
                    ) : (
                      <p className="text-gray-900">{user.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      />
                    ) : (
                      <p className="text-gray-900">{user.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      />
                    ) : (
                      <p className="text-gray-900">{user.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member Since
                    </label>
                    <p className="text-gray-900">{formatDate(user.createdAt)}</p>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleSave}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2 transition-colors duration-200"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 flex items-center space-x-2 transition-colors duration-200"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Preferences
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={user.currency}
                    onChange={(e) => setUser({ ...user, currency: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD (C$)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={user.timezone}
                    onChange={(e) => setUser({ ...user, timezone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive updates via email</p>
                  </div>
                  <button
                    onClick={() => toggleNotification('email')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      user.notifications.email ? 'bg-indigo-600' : 'bg-gray-200'
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
                    <p className="font-medium text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-500">Receive updates in browser</p>
                  </div>
                  <button
                    onClick={() => toggleNotification('push')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      user.notifications.push ? 'bg-indigo-600' : 'bg-gray-200'
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
                    <p className="font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-500">Receive updates via SMS</p>
                  </div>
                  <button
                    onClick={() => toggleNotification('sms')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      user.notifications.sms ? 'bg-indigo-600' : 'bg-gray-200'
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security
              </h2>
              
              <div className="space-y-4">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Change Password</p>
                      <p className="text-sm text-gray-500">Update your password</p>
                    </div>
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add extra security</p>
                    </div>
                    <Shield className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Account
              </h2>
              
              <div className="space-y-4">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Export Data</p>
                      <p className="text-sm text-gray-500">Download your data</p>
                    </div>
                    <CreditCard className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg border border-red-200 hover:bg-red-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-700">Delete Account</p>
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