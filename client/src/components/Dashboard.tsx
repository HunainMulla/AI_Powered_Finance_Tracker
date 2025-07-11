'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, TrendingUp, TrendingDown, Activity, Plus, ArrowRight, Target, MessageSquare } from 'lucide-react';
import Navbar from './Navbar';
import { dashboardAPI, transactionsAPI } from '@/lib/api';
import dynamic from 'next/dynamic';
import React from 'react';
import AIChat from './AIChat';

// Helper function to format dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Define chart prop types
type MonthlySummaryData = Array<{ month: string; income: number; expense: number }>;
type CategorySpendingData = Array<{ name: string; value: number; color: string }>;
type DailySpendingData = Array<{ date: string; amount: number }>;

// Dynamically import charts with no SSR
const MonthlySummaryChart = dynamic<{ data: MonthlySummaryData }>(
  () => import('@/components/charts/MonthlySummaryChart'),
  { 
    ssr: false, 
    loading: () => <div className="text-gray-400">Loading chart...</div> 
  }
);

const CategorySpendingChart = dynamic<{ data: CategorySpendingData }>(
  () => import('@/components/charts/CategorySpendingChart'),
  { 
    ssr: false, 
    loading: () => <div className="text-gray-400">Loading chart...</div> 
  }
);

const SpendingTrendChart = dynamic<{ data: DailySpendingData; title: string }>(
  () => import('@/components/charts/SpendingTrendChart'),
  { 
    ssr: false, 
    loading: () => <div className="text-gray-400">Loading chart...</div> 
  }
);

interface ChartData {
  monthlySummary: Array<{
    month: string;
    income: number;
    expense: number;
  }>;
  categorySpending: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  dailySpending: Array<{
    date: string;
    amount: number;
  }>;
}

// Extend the API DashboardStats type to include charts
type DashboardStats = {
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyBalance: number;
  totalTransactions: number;
  charts: ChartData;
};

interface Transaction {
  id: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  description: string;
  date: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>(() => ({
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlyBalance: 0,
    totalTransactions: 0,
    charts: {
      monthlySummary: [],
      categorySpending: [],
      dailySpending: []
    }
  }));
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [statsResponse, transactionsResponse] = await Promise.all([
        dashboardAPI.getStats(),
        transactionsAPI.getAll()
      ]);
      
      // Create a new stats object with default charts if not present
      const apiStats = statsResponse.data;
      const statsWithCharts: DashboardStats = {
        ...apiStats,
        charts: {
          monthlySummary: [],
          categorySpending: [],
          dailySpending: [],
          ...(apiStats as any).charts // Safely spread any existing charts data
        }
      };
      
      setStats(statsWithCharts);
      
      // Get the 3 most recent transactions
      const transactions = transactionsResponse.data || [];
      const recent = Array.isArray(transactions) 
        ? transactions.slice(0, 3)
        : [];
      setRecentTransactions(recent);
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded mb-6">
            {error}
            <button 
              onClick={fetchDashboardData}
              className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Retry
            </button>
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
      change: '',
      changeColor: 'text-gray-400'
    },
    {
      title: 'Monthly Expenses',
      value: `$${stats?.monthlyExpenses.toFixed(2) || '0.00'}`,
      icon: TrendingDown,
      color: 'text-red-400',
      bgColor: 'bg-red-900/20',
      iconColor: 'text-red-400',
      change: '',
      changeColor: 'text-gray-400'
    },
    {
      title: 'Monthly Balance',
      value: `$${stats?.monthlyBalance.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: stats?.monthlyBalance && stats.monthlyBalance >= 0 ? 'text-green-400' : 'text-red-400',
      bgColor: stats?.monthlyBalance && stats.monthlyBalance >= 0 ? 'bg-green-900/20' : 'bg-red-900/20',
      iconColor: stats?.monthlyBalance && stats.monthlyBalance >= 0 ? 'text-green-400' : 'text-red-400',
      change: '',
      changeColor: 'text-gray-400'
    },
    {
      title: 'Total Transactions',
      value: stats?.totalTransactions.toString() || '0',
      icon: Activity,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
      iconColor: 'text-blue-400',
      change: '',
      changeColor: 'text-gray-400'
    }
  ];

  const quickActions = [
    {
      title: 'Add Transaction',
      description: 'Record a new income or expense',
      icon: Plus,
      href: '/transactions/new',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'View Reports',
      description: 'Analyze your spending',
      icon: Activity,
      href: '/reports',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'Set Budget',
      description: 'Manage your budget limits',
      icon: Target,
      href: '/budgets',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'View All Transactions',
      description: 'See your full transaction history',
      icon: ArrowRight,
      href: '/transactions',
      color: 'bg-indigo-600 hover:bg-indigo-700'
    }
  ] as const;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getTransactionIcon = (type: string) => {
    return type === 'INCOME' ? TrendingUp : TrendingDown;
  };

  const getTransactionColor = (type: string) => {
    return type === 'INCOME' ? 'text-green-400' : 'text-red-400';
  };

  const getTransactionBgColor = (type: string) => {
    return type === 'INCOME' ? 'bg-green-900/50' : 'bg-red-900/50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Navbar />
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* AI Chat Toggle Button - Fixed at bottom right */}
        <button
          onClick={() => setShowChat(!showChat)}
          className="fixed bottom-8 right-8 z-50 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
          aria-label="Chat with AI"
        >
          <MessageSquare className="h-6 w-6" />
        </button>

        {/* AI Chat Overlay */}
        {showChat && (
          <div className="fixed bottom-20 right-4 sm:right-8 z-50 w-[calc(100%-2rem)] sm:w-96 h-[calc(100%-7rem)] sm:h-[600px] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
            <AIChat showChat={showChat} setShowChat={setShowChat} />
          </div>
        )}
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Here's what's happening with your finances today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={`stat-card-${index}`}
                className={`p-6 rounded-xl ${stat.bgColor} border border-gray-700/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                    <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                    {stat.change && (
                      <p className={`text-xs mt-1 ${stat.changeColor}`}>
                        {stat.change}
                      </p>
                    )}
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor} bg-opacity-50`}>
                    <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div key="monthly-overview" className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            {/* <h3 className="text-lg font-semibold text-gray-200 mb-4"></h3> */}
            <div className="h-80 ">
              <MonthlySummaryChart data={stats.charts.monthlySummary} />
            </div>
          </div>
          
          <div key="category-spending" className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 overflow-y-auto">
            {/* <h3 className="text-lg font-semibold text-gray-200 mb-4">Spending by Category</h3> */}
            <div className="h-80 mb-6">
              <CategorySpendingChart data={stats.charts.categorySpending} />
            </div>
          </div>
        </div>

        {/* Spending Trends */}
        <div key="daily-spending" className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8">
          {/* <h3 className="text-lg font-semibold text-gray-200 mb-4">Daily Spending (Last 30 Days)</h3> */}
          <div className="h-96">
            <SpendingTrendChart 
              data={stats.charts.dailySpending} 
              title="Daily Spending"
            />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-200">Recent Transactions</h2>
            <button
              onClick={() => router.push('/transactions')}
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>
          
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === 'INCOME' ? 'bg-green-900/30' : 'bg-red-900/30'
                      }`}
                    >
                      {transaction.type === 'INCOME' ? (
                        <TrendingUp className="h-5 w-5 text-green-400" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-200 font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-400">
                        <span
                          className="inline-block w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: transaction.category?.color || '#6b7280' }}
                        ></span>
                        {transaction.category?.name || 'Uncategorized'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.type === 'INCOME' ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {transaction.type === 'INCOME' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-gray-800/50 p-6 rounded-lg inline-block">
                <Activity className="h-10 w-10 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">No recent transactions found</p>
                <p className="text-sm text-gray-500 mt-1">
                  Add your first transaction to get started
                </p>
                <button
                  onClick={() => router.push('/transactions/new')}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center mx-auto"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Transaction
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 pb-8">
          {quickActions.map((action, index) => {
            const ActionIcon = action.icon;
            return (
              
              <button
                key={`quick-action-${index}`}
                onClick={() => router.push(action.href)}
                className={`${action.color} text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group`}
              >
                <div className="flex items-center justify-between ">
                  <div className="">
                    <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                    <p className="text-blue-100 text-sm">{action.description}</p>
                  </div>
                  <ActionIcon className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </button>
             
              );
          })}
        </div>
      </div>
    </div>
  );
}