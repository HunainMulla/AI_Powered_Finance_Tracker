'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { transactionsAPI, categoriesAPI, Category } from '@/lib/api';

interface TransactionFormData {
  amount: string;
  type: 'INCOME' | 'EXPENSE';
  description: string;
  date: string;
  categoryId: string;
}

export default function TransactionForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<TransactionFormData>({
    defaultValues: {
      type: 'EXPENSE',
      date: new Date().toISOString().split('T')[0]
    }
  });

  const watchType = watch('type');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      // Ensure each category has an id field that is the MongoDB ObjectId
      const formatted = response.data.map((cat: any) => ({ ...cat, id: cat._id }));
      setCategories(formatted);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const onSubmit = async (data: TransactionFormData) => {
    setIsLoading(true);
    try {
      await transactionsAPI.create({
        ...data,
        amount: parseFloat(data.amount)
      });
      
      toast.success('Transaction added successfully!');
      router.push('/transactions');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat => cat.type === watchType);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Transaction</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  {...register('type')}
                  type="radio"
                  value="EXPENSE"
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Expense</span>
              </label>
              <label className="flex items-center">
                <input
                  {...register('type')}
                  type="radio"
                  value="INCOME"
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Income</span>
              </label>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              {...register('amount', { 
                required: 'Amount is required',
                min: { value: 0.01, message: 'Amount must be greater than 0' }
              })}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              {...register('description', { required: 'Description is required' })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              {...register('date', { required: 'Date is required' })}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              {...register('categoryId', { required: 'Category is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a category</option>
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
            )}
            {filteredCategories.length === 0 && (
              <p className="mt-1 text-sm text-yellow-600">
                No categories found for {watchType.toLowerCase()}. Please create some categories first.
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading || filteredCategories.length === 0}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add Transaction'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/transactions')}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 