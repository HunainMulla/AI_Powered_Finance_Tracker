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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-300 text-lg">Loading your financial overview...</p>
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
      color: 'text-green-400',
      bgColor: 'bg-green-900/20',
      iconColor: 'text-green-400',
      change: '+12.5%',
      changeColor: 'text-green-400'
    },
    {
      title: 'Monthly Expenses',
      value: `$${stats?.monthlyExpenses.toFixed(2) || '0.00'}`,
      icon: TrendingDown,
      color: 'text-red-400',
      bgColor: 'bg-red-900/20',
      iconColor: 'text-red-400',
      change: '+8.2%',
      changeColor: 'text-red-400'
    },
    {
      title: 'Monthly Balance',
      value: `$${stats?.monthlyBalance.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: stats?.monthlyBalance && stats.monthlyBalance >= 0 ? 'text-green-400' : 'text-red-400',
      bgColor: stats?.monthlyBalance && stats.monthlyBalance >= 0 ? 'bg-green-900/20' : 'bg-red-900/20',
      iconColor: stats?.monthlyBalance && stats.monthlyBalance >= 0 ? 'text-green-400' : 'text-red-400',
      change: stats?.monthlyBalance && stats.monthlyBalance >= 0 ? '+4.3%' : '-2.1%',
      changeColor: stats?.monthlyBalance && stats.monthlyBalance >= 0 ? 'text-green-400' : 'text-red-400'
    },
    {
      title: 'Total Transactions',
      value: stats?.totalTransactions.toString() || '0',
      icon: Activity,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
      iconColor: 'text-blue-400',
      change: '+15.7%',
      changeColor: 'text-blue-400'
    }
  ];

  const quickActions = [
    {
      title: 'Add Transaction',
      description: 'Record a new income or expense',
      icon: Plus,
      href: '/transactions',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Manage Categories',
      description: 'Organize your transactions',
      icon: Activity,
      href: '/categories',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Set Budgets',
      description: 'Track your spending limits',
      icon: DollarSign,
      href: '/budgets',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'Financial Goals',
      description: 'Track your milestones',
      icon: Target,
      href: '/goals',
      color: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-300">
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
                className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <Icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                  <span className={`text-sm font-medium ${card.changeColor}`}>
                    {card.change}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">
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
          <h2 className="text-xl font-semibold text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  onClick={() => router.push(action.href)}
                  className={`${action.color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                      <p className="text-blue-100 text-sm">{action.description}</p>
                    </div>
                    <Icon className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              Recent Activity
            </h2>
            <button
              onClick={() => router.push('/transactions')}
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center"
            >
              View all
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-900/50 rounded-full flex items-center justify-center mr-3">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Salary</p>
                  <p className="text-sm text-gray-400">Income • Today</p>
                </div>
              </div>
              <span className="text-green-400 font-semibold">+$3,500.00</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-900/50 rounded-full flex items-center justify-center mr-3">
                  <TrendingDown className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Grocery Shopping</p>
                  <p className="text-sm text-gray-400">Food • Yesterday</p>
                </div>
              </div>
              <span className="text-red-400 font-semibold">-$85.50</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center mr-3">
                  <DollarSign className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Gas Station</p>
                  <p className="text-sm text-gray-400">Transportation • 2 days ago</p>
                </div>
              </div>
              <span className="text-red-400 font-semibold">-$45.00</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 