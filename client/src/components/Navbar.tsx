'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  DollarSign, 
  Tag, 
  PieChart, 
  Target,
  User, 
  LogOut, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/login');
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Transactions', href: '/transactions', icon: DollarSign },
    { name: 'Categories', href: '/categories', icon: Tag },
    { name: 'Budgets', href: '/budgets', icon: PieChart },
    { name: 'Goals', href: '/goals', icon: Target },
  ];

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-blue-900 shadow-xl border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-white text-xl font-bold flex items-center">
                <DollarSign className="h-6 w-6 mr-2 text-blue-400" />
                Finance Tracker
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Profile Section */}
          <div className="flex items-center">
            {/* Desktop Profile */}
            <div className="hidden md:block relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span>{user?.name || 'User'}</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>

              {/* Profile Dropdown */}
              {showProfile && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                  </div>
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-xs text-gray-500">Member since</p>
                    <p className="text-sm text-gray-300">{user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</p>
                  </div>
                  <div className="px-4 py-2">
                    <button
                      onClick={() => {
                        router.push('/profile');
                        setShowProfile(false);
                      }}
                      className="flex items-center w-full text-left px-2 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors duration-200"
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-2 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-md transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-gray-300 hover:text-blue-400 p-2 rounded-md"
              >
                {showMobileMenu ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <div className="md:hidden bg-gray-800 shadow-xl border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center"
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </a>
              );
            })}
            
            {/* Mobile Profile Section */}
            <div className="border-t border-gray-700 pt-4 pb-3">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-sm text-gray-400">{user?.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Member since {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                </p>
              </div>
              <button
                onClick={() => {
                  router.push('/profile');
                  setShowMobileMenu(false);
                }}
                className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors duration-200"
              >
                <User className="h-4 w-4 mr-2" />
                View Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-md transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 