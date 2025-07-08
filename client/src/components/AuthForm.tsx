'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';

interface AuthFormProps {
  mode: 'login' | 'register';
}

interface FormData {
  name?: string;
  email: string;
  password: string;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      let response;
      if (mode === 'register') {
        response = await authAPI.register(data as { name: string; email: string; password: string });
      } else {
        response = await authAPI.login({ email: data.email, password: data.password });
      }

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success(mode === 'register' ? 'Account created successfully!' : 'Logged in successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            {mode === 'register' && (
              <div>
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                <input
                  {...register('name', { required: mode === 'register' ? 'Name is required' : false })}
                  id="name"
                  name="name"
                  type="text"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
            )}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                id="email"
                name="email"
                type="email"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${mode === 'register' ? '' : 'rounded-t-md'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                id="password"
                name="password"
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : mode === 'login' ? 'Sign in' : 'Sign up'}
            </button>
          </div>

          <div className="text-center">
            <a
              href={mode === 'login' ? '/register' : '/login'}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
} 