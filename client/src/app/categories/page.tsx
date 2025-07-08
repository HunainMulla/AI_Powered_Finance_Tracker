'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Tag, Palette, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import { categoriesAPI } from '@/lib/api';

type Category = {
  id: string;
  name: string;
  color: string;
  icon?: string;
  type: 'INCOME' | 'EXPENSE';
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
    icon: '',
    type: 'EXPENSE' as 'INCOME' | 'EXPENSE'
  });
  const router = useRouter();

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await categoriesAPI.getAll();
        setCategories(response.data);
      } catch (err: any) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories. Please try again.');
        
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await categoriesAPI.create({
        name: formData.name,
        color: formData.color,
        type: formData.type,
        ...(formData.icon && { icon: formData.icon })
      });
      
      setCategories([...categories, response.data]);
      setShowForm(false);
      setFormData({
        name: '',
        color: '#3B82F6',
        icon: '',
        type: 'EXPENSE'
      });
      toast.success('Category added successfully!');
    } catch (err: any) {
      console.error('Failed to create category:', err);
      toast.error('Failed to create category. Please try again.');
      
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      setLoading(true);
      await categoriesAPI.delete(id);
      setCategories(categories.filter(category => category.id !== id));
      toast.success('Category deleted successfully!');
    } catch (err: any) {
      console.error('Failed to delete category:', err);
      toast.error('Failed to delete category. Please try again.');
      
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!formData.name.trim()) {
  //     toast.error('Category name is required');
  //     return;
  //   }

  //   // For now, just add to local state
  //   const newCategory = {
  //     id: Date.now().toString(),
  //     name: formData.name,
  //     color: formData.color,
  //     type: formData.type
  //   };
    
  //   setCategories([...categories, newCategory]);
  //   toast.success('Category created successfully!');
  //   setFormData({ name: '', color: '#3B82F6', icon: '', type: 'EXPENSE' });
  //   setShowForm(false);
  // };

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