'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, PieChart, Calendar, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';

// Dummy budgets data for testing
const dummyBudgets = [
  {
    id: '1',
    name: 'Monthly Groceries',
    amount: 500,
    spent: 385.50,
    period: 'MONTHLY',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    name: 'Entertainment',
    amount: 200,
    spent: 150,
    period: 'MONTHLY',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    name: 'Transportation',
    amount: 300,
    spent: 245,
    period: 'MONTHLY',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    name: 'Shopping',
    amount: 400,
    spent: 520,
    period: 'MONTHLY',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState(dummyBudgets);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    period: 'MONTHLY' as 'MONTHLY' | 'WEEKLY' | 'YEARLY',
    startDate: '',
    endDate: ''
  });
  const router = useRouter();

  // Remove authentication check for now
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     router.push('/login');
  //     return;
  //   }
  //   fetchBudgets();
  // }, [router]);

  // const fetchBudgets = async () => {
  //   try {
  //     const response = await budgetsAPI.getAll();
  //     setBudgets(response.data);
  //   } catch (error) {
  //     console.error('Failed to fetch budgets:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount || !formData.startDate || !formData.endDate) {
      toast.error('All fields are required');
      return;
    }

    // For now, just add to local state
    const newBudget = {
      id: Date.now().toString(),
      name: formData.name,
      amount: parseFloat(formData.amount),
      spent: 0,
      period: formData.period,
      startDate: formData.startDate,
      endDate: formData.endDate
    };
    
    setBudgets([...budgets, newBudget]);
    toast.success('Budget created successfully!');
    setFormData({ name: '', amount: '', period: 'MONTHLY', startDate: '', endDate: '' });
    setShowForm(false);
  };

  const getProgressColor = (spent: number, amount: number) => {
    const percentage = (spent / amount) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressWidth = (spent: number, amount: number) => {
    const percentage = Math.min((spent / amount) * 100, 100);
    return `${percentage}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading budgets...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
            <p className="text-gray-600 mt-2">Track your spending against set budgets</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center space-x-2 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Add Budget</span>
          </button>
        </div>

        {/* Add Budget Form */}
        {showForm && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Budget</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Enter budget name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Enter budget amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Period
                  </label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value as 'MONTHLY' | 'WEEKLY' | 'YEARLY' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  >
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Create Budget
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

        {/* Budgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => {
            const progressColor = getProgressColor(budget.spent, budget.amount);
            const progressWidth = getProgressWidth(budget.spent, budget.amount);
            const percentage = Math.round((budget.spent / budget.amount) * 100);
            const remaining = budget.amount - budget.spent;
            
            return (
              <div key={budget.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <PieChart className="h-6 w-6 text-indigo-600" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {budget.period}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{budget.name}</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Budget</span>
                    <span className="font-medium">${budget.amount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Spent</span>
                    <span className="font-medium">${budget.spent.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Remaining</span>
                    <span className={`font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${remaining.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${progressColor}`}
                        style={{ width: progressWidth }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(budget.startDate).toLocaleDateString()}
                    </span>
                    <span>to</span>
                    <span>{new Date(budget.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
} 