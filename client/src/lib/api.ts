import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  description: string;
  date: string;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  type: 'INCOME' | 'EXPENSE';
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  period: 'MONTHLY' | 'YEARLY' | 'CUSTOM';
  startDate: string;
  endDate: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  description: string;
  category: 'SAVINGS' | 'TRAVEL' | 'TRANSPORTATION' | 'HOME' | 'EDUCATION' | 'OTHER';
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyBalance: number;
  totalTransactions: number;
}

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// Transactions API
export const transactionsAPI = {
  getAll: () => api.get<Transaction[]>('/transactions'),
  create: (data: {
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    description: string;
    date: string;
    categoryId: string;
  }) => api.post<Transaction>('/transactions', data),
  delete: (id: string) => api.delete(`/transactions/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get<Category[]>('/categories'),
  create: (data: {
    name: string;
    color: string;
    icon?: string;
    type: 'INCOME' | 'EXPENSE';
  }) => api.post<Category>('/categories', data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Budgets API
export const budgetsAPI = {
  getAll: () => api.get<Budget[]>('/budgets'),
  create: (data: {
    name: string;
    amount: number;
    period: 'MONTHLY' | 'YEARLY' | 'CUSTOM';
    startDate: string;
    endDate: string;
  }) => api.post<Budget>('/budgets', data),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get<DashboardStats>('/dashboard'),
};

// Goals API
export const goalsAPI = {
  getAll: () => api.get<Goal[]>('/goals'),
  create: (data: {
    name: string;
    targetAmount: number;
    currentAmount?: number;
    deadline: string;
    description: string;
    category: 'SAVINGS' | 'TRAVEL' | 'TRANSPORTATION' | 'HOME' | 'EDUCATION' | 'OTHER';
  }) => api.post<Goal>('/goals', data),
  update: (id: string, data: {
    name?: string;
    targetAmount?: number;
    currentAmount?: number;
    deadline?: string;
    description?: string;
    category?: 'SAVINGS' | 'TRAVEL' | 'TRANSPORTATION' | 'HOME' | 'EDUCATION' | 'OTHER';
    status?: 'IN_PROGRESS' | 'COMPLETED';
  }) => api.put<Goal>(`/goals/${id}`, data),
  delete: (id: string) => api.delete(`/goals/${id}`),
};

export default api; 