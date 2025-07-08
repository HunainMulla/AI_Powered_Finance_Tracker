'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Calendar, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';

// Dummy transaction data for testing
const dummyTransactions = [
  {
    id: '1',
    amount: 3500,
    type: 'INCOME' as const,
    description: 'Monthly Salary',
    date: new Date().toISOString(),
    category: { name: 'Salary', color: '#10B981' }
  },
  {
    id: '2',
    amount: 500,
    type: 'INCOME' as const,
    description: 'Freelance Project',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: { name: 'Freelance', color: '#3B82F6' }
  },
  {
    id: '3',
    amount: 85.50,
    type: 'EXPENSE' as const,
    description: 'Grocery Shopping',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    category: { name: 'Food & Dining', color: '#F59E0B' }
  },
  {
    id: '4',
    amount: 45.00,
    type: 'EXPENSE' as const,
    description: 'Gas Station',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: { name: 'Transportation', color: '#EF4444' }
  },
  {
    id: '5',
    amount: 120.00,
    type: 'EXPENSE' as const,
    description: 'New Shoes',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: { name: 'Shopping', color: '#8B5CF6' }
  }
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(dummyTransactions);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  // Remove authentication check for now
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     router.push('/login');
  //     return;
  //   }
  //   fetchTransactions();
  // }, [router]);

  // const fetchTransactions = async () => {
  //   try {
  //     const response = await transactionsAPI.getAll();
  //     setTransactions(response.data);
  //   } catch (error) {
  //     console.error('Failed to fetch transactions:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    
    // For now, just remove from local state
    setTransactions(transactions.filter(t => t.id !== id));
    toast.success('Transaction deleted successfully!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="max-w-md mx-auto py-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Transaction</h2>
            <p className="text-gray-600 mb-4">Form functionality will be available when backend is connected.</p>
            <button
              onClick={() => setShowForm(false)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Back to Transactions
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading transactions...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600 mt-2">Manage your income and expenses</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center space-x-2 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              All Transactions ({transactions.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: transaction.category.color }}
                    >
                      {transaction.category.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(transaction.date)}
                        </span>
                        <span>{transaction.category.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`text-lg font-semibold ${
                        transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'INCOME' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                      title="Delete transaction"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 