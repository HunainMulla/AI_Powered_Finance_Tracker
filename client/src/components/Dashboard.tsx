'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, TrendingUp, TrendingDown, Activity, Plus, ArrowRight, Target } from 'lucide-react';
import Navbar from './Navbar';

// Dummy data for testing
const dummyStats = {
  monthlyIncome: 4000,
  monthlyExpenses: 1250,
  monthlyBalance: 2750,
  totalTransactions: 8
};

export default function Dashboard() {
  const [stats, setStats] = useState(dummyStats);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Remove authentication check for now
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     router.push('/login');
  //     return;
  //   }
  //   fetchStats();
  // }, [router]);

  // const fetchStats = async () => {
  //   try {
  //     const response = await dashboardAPI.getStats();
  //     setStats(response.data);
  //   } catch (error) {
  //     console.error('Failed to fetch stats:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your financial overview...</p>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Monthly Income',
      value: `$${stats?.monthlyIncome.toFixed(2) || '0.00'}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      change: '+12.5%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Monthly Expenses',
      value: `$${stats?.monthlyExpenses.toFixed(2) || '0.00'}`,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      change: '+8.2%',
      changeColor: 'text-red-600'
    },
    {
      title: 'Monthly Balance',
      value: `$${stats?.monthlyBalance.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: stats?.monthlyBalance && stats.monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: stats?.monthlyBalance && stats.monthlyBalance >= 0 ? 'bg-green-50' : 'bg-red-50',
      iconColor: stats?.monthlyBalance && stats.monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600',
      change: stats?.monthlyBalance && stats.monthlyBalance >= 0 ? '+4.3%' : '-2.1%',
      changeColor: stats?.monthlyBalance && stats.monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      title: 'Total Transactions',
      value: stats?.totalTransactions.toString() || '0',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      change: '+15.7%',
      changeColor: 'text-purple-600'
    }
  ];

  const quickActions = [
    {
      title: 'Add Transaction',
      description: 'Record a new income or expense',
      icon: Plus,
      href: '/transactions',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      title: 'Manage Categories',
      description: 'Organize your transactions',
      icon: Activity,
      href: '/categories',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Set Budgets',
      description: 'Track your spending limits',
      icon: DollarSign,
      href: '/budgets',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Financial Goals',
      description: 'Track your milestones',
      icon: Target,
      href: '/goals',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">
            Here's your financial overview for this month
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <Icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                  <span className={`text-sm font-medium ${card.changeColor}`}>
                    {card.change}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  {card.title}
                </h3>
                <p className={`text-2xl font-bold ${card.color}`}>
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  onClick={() => router.push(action.href)}
                  className={`${action.color} text-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                      <p className="text-indigo-100 text-sm">{action.description}</p>
                    </div>
                    <Icon className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Activity
            </h2>
            <button
              onClick={() => router.push('/transactions')}
              className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
            >
              View all
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Salary</p>
                  <p className="text-sm text-gray-500">Income • Today</p>
                </div>
              </div>
              <span className="text-green-600 font-semibold">+$3,500.00</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Grocery Shopping</p>
                  <p className="text-sm text-gray-500">Food • Yesterday</p>
                </div>
              </div>
              <span className="text-red-600 font-semibold">-$85.50</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Gas Station</p>
                  <p className="text-sm text-gray-500">Transportation • 2 days ago</p>
                </div>
              </div>
              <span className="text-red-600 font-semibold">-$45.00</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 