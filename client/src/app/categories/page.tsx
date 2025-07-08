'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Tag, Palette } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';

// Dummy categories data for testing
const dummyCategories = [
  { id: '1', name: 'Salary', color: '#10B981', type: 'INCOME' as const },
  { id: '2', name: 'Freelance', color: '#3B82F6', type: 'INCOME' as const },
  { id: '3', name: 'Food & Dining', color: '#F59E0B', type: 'EXPENSE' as const },
  { id: '4', name: 'Transportation', color: '#EF4444', type: 'EXPENSE' as const },
  { id: '5', name: 'Shopping', color: '#8B5CF6', type: 'EXPENSE' as const },
  { id: '6', name: 'Entertainment', color: '#EC4899', type: 'EXPENSE' as const },
  { id: '7', name: 'Utilities', color: '#6B7280', type: 'EXPENSE' as const },
  { id: '8', name: 'Healthcare', color: '#059669', type: 'EXPENSE' as const }
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(dummyCategories);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
    icon: '',
    type: 'EXPENSE' as 'INCOME' | 'EXPENSE'
  });
  const router = useRouter();

  // Remove authentication check for now
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     router.push('/login');
  //     return;
  //   }
  //   fetchCategories();
  // }, [router]);

  // const fetchCategories = async () => {
  //   try {
  //     const response = await categoriesAPI.getAll();
  //     setCategories(response.data);
  //   } catch (error) {
  //     console.error('Failed to fetch categories:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    // For now, just add to local state
    const newCategory = {
      id: Date.now().toString(),
      name: formData.name,
      color: formData.color,
      type: formData.type
    };
    
    setCategories([...categories, newCategory]);
    toast.success('Category created successfully!');
    setFormData({ name: '', color: '#3B82F6', icon: '', type: 'EXPENSE' });
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-2">Organize your transactions with custom categories</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center space-x-2 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Add Category Form */}
        {showForm && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Category</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'INCOME' | 'EXPENSE' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-16 h-12 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <span className="text-sm text-gray-500">Choose a color for this category</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Icon name or emoji"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Create Category
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: category.color }}
                >
                  {category.name.charAt(0).toUpperCase()}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  category.type === 'INCOME' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {category.type}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Palette className="h-4 w-4 mr-2" />
                <span>Color: {category.color}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 