'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Target, Calendar, DollarSign, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';

// Dummy goals data for testing
const dummyGoals = [
  {
    id: '1',
    name: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 6500,
    deadline: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'IN_PROGRESS' as const,
    description: 'Save 6 months of living expenses',
    category: 'SAVINGS' as const
  },
  {
    id: '2',
    name: 'Vacation Fund',
    targetAmount: 3000,
    currentAmount: 3000,
    deadline: new Date(Date.now() + 2 * 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'COMPLETED' as const,
    description: 'Trip to Europe next summer',
    category: 'TRAVEL' as const
  },
  {
    id: '3',
    name: 'New Car Down Payment',
    targetAmount: 8000,
    currentAmount: 1200,
    deadline: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'IN_PROGRESS' as const,
    description: '20% down payment for a new car',
    category: 'TRANSPORTATION' as const
  },
  {
    id: '4',
    name: 'Home Renovation',
    targetAmount: 25000,
    currentAmount: 5000,
    deadline: new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'IN_PROGRESS' as const,
    description: 'Kitchen and bathroom renovation',
    category: 'HOME' as const
  }
];

export default function GoalsPage() {
  const [goals, setGoals] = useState(dummyGoals);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    description: '',
    category: 'SAVINGS' as 'SAVINGS' | 'TRAVEL' | 'TRANSPORTATION' | 'HOME' | 'EDUCATION' | 'OTHER'
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.targetAmount || !formData.deadline) {
      toast.error('Name, target amount, and deadline are required');
      return;
    }

    // For now, just add to local state
    const newGoal = {
      id: Date.now().toString(),
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      deadline: formData.deadline,
      status: 'IN_PROGRESS' as const,
      description: formData.description,
      category: formData.category
    };
    
    setGoals([...goals, newGoal]);
    toast.success('Goal created successfully!');
    setFormData({ 
      name: '', 
      targetAmount: '', 
      currentAmount: '', 
      deadline: '', 
      description: '', 
      category: 'SAVINGS' 
    });
    setShowForm(false);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'IN_PROGRESS':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <Target className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'SAVINGS':
        return 'bg-green-100 text-green-800';
      case 'TRAVEL':
        return 'bg-blue-100 text-blue-800';
      case 'TRANSPORTATION':
        return 'bg-purple-100 text-purple-800';
      case 'HOME':
        return 'bg-orange-100 text-orange-800';
      case 'EDUCATION':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your financial goals...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Financial Goals</h1>
            <p className="text-gray-600 mt-2">Track your progress towards financial milestones</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center space-x-2 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Add Goal</span>
          </button>
        </div>

        {/* Add Goal Form */}
        {showForm && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Financial Goal</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Enter goal name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  >
                    <option value="SAVINGS">Savings</option>
                    <option value="TRAVEL">Travel</option>
                    <option value="TRANSPORTATION">Transportation</option>
                    <option value="HOME">Home</option>
                    <option value="EDUCATION">Education</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Enter target amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Amount (optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Enter current amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Describe your goal"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Create Goal
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

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progressPercentage = getProgressPercentage(goal.currentAmount, goal.targetAmount);
            const progressColor = getProgressColor(progressPercentage);
            const daysRemaining = getDaysRemaining(goal.deadline);
            
            return (
              <div key={goal.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(goal.category)}`}>
                      {goal.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                      {goal.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{goal.name}</h3>
                {goal.description && (
                  <p className="text-sm text-gray-600 mb-4">{goal.description}</p>
                )}
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Target</span>
                    <span className="font-medium">${goal.targetAmount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Current</span>
                    <span className="font-medium">${goal.currentAmount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Remaining</span>
                    <span className={`font-medium ${goal.currentAmount >= goal.targetAmount ? 'text-green-600' : 'text-red-600'}`}>
                      ${(goal.targetAmount - goal.currentAmount).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${progressColor}`}
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(goal.deadline)}
                    </span>
                    <span className={daysRemaining < 0 ? 'text-red-600' : daysRemaining < 30 ? 'text-yellow-600' : 'text-green-600'}>
                      {daysRemaining < 0 ? 'Overdue' : `${daysRemaining} days left`}
                    </span>
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