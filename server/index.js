const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/database');
require('dotenv').config({ path: './config.env' });

// Import models
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Category = require('./models/Category');
const Budget = require('./models/Budget');

// Import routes
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Transaction Routes
app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .populate('categoryId')
      .sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/transactions', authenticateToken, async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { amount, type, description, date, categoryId } = req.body;

    if (!amount || !type || !description || !date || !categoryId) {
      console.log('Missing fields:', { amount, type, description, date, categoryId });
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      console.log('Category not found:', categoryId);
      return res.status(400).json({ error: 'Invalid category' });
    }

    const transaction = new Transaction({
      amount: parseFloat(amount),
      type,
      description,
      date: new Date(date),
      categoryId,
      userId: req.user._id
    });

    console.log('Saving transaction:', transaction);
    await transaction.save();
    await transaction.populate('categoryId');

    res.json(transaction);
  } catch (error) {
    console.error('Create transaction error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'Server error',
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});

app.delete('/api/transactions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const transaction = await Transaction.findOne({ _id: id, userId: req.user._id });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await Transaction.findByIdAndDelete(id);

    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Category Routes
app.get('/api/categories', authenticateToken, async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user._id })
      .sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/categories', authenticateToken, async (req, res) => {
  try {
    const { name, color, icon, type } = req.body;

    if (!name || !color || !type) {
      return res.status(400).json({ error: 'Name, color, and type are required' });
    }

    const category = new Category({
      name,
      color,
      icon,
      type,
      userId: req.user._id
    });

    await category.save();

    res.json(category);
  } catch (error) {
    console.error('Create category error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Category name already exists for this user' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Budget Routes
app.get('/api/budgets', authenticateToken, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(budgets);
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/budgets', authenticateToken, async (req, res) => {
  try {
    const { name, amount, period, startDate, endDate } = req.body;

    if (!name || !amount || !period || !startDate || !endDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const budget = new Budget({
      name,
      amount: parseFloat(amount),
      period,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      userId: req.user._id
    });

    await budget.save();

    res.json(budget);
  } catch (error) {
    console.error('Create budget error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Goals Routes
app.get('/api/goals', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.goals);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/goals', authenticateToken, async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, deadline, description, category } = req.body;

    if (!name || !targetAmount || !deadline) {
      return res.status(400).json({ error: 'Name, target amount, and deadline are required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newGoal = {
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      deadline: new Date(deadline),
      status: 'IN_PROGRESS',
      description: description || '',
      category: category || 'SAVINGS',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    user.goals.push(newGoal);
    await user.save();

    res.status(201).json(newGoal);
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/goals/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, targetAmount, currentAmount, deadline, description, category, status } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const goalIndex = user.goals.findIndex(g => g._id.toString() === id);
    if (goalIndex === -1) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const goal = user.goals[goalIndex];
    
    // Update only the fields that are provided
    if (name) goal.name = name;
    if (targetAmount) goal.targetAmount = parseFloat(targetAmount);
    if (currentAmount !== undefined) goal.currentAmount = parseFloat(currentAmount);
    if (deadline) goal.deadline = new Date(deadline);
    if (description !== undefined) goal.description = description;
    if (category) goal.category = category;
    if (status) goal.status = status;
    
    goal.updatedAt = new Date();
    
    user.goals[goalIndex] = goal;
    await user.save();

    res.json(goal);
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/goals/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting goal with ID:', id);

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User goals:', user.goals);
    
    // Try to find the goal by _id (as string or ObjectId)
    const goalIndex = user.goals.findIndex(g => {
      const goalId = g._id ? g._id.toString() : g.id;
      console.log('Comparing:', goalId, 'with', id);
      return goalId === id;
    });
    
    console.log('Found goal at index:', goalIndex);
    
    if (goalIndex === -1) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    user.goals.splice(goalIndex, 1);
    await user.save();

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});

// Dashboard Stats
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    // Get monthly summary data for the last 6 months
    const monthlySummary = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const [income, expenses] = await Promise.all([
        Transaction.aggregate([
          {
            $match: {
              userId: req.user._id,
              type: 'INCOME',
              date: { $gte: monthStart, $lte: monthEnd }
            }
          },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        Transaction.aggregate([
          {
            $match: {
              userId: req.user._id,
              type: 'EXPENSE',
              date: { $gte: monthStart, $lte: monthEnd }
            }
          },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ])
      ]);

      monthlySummary.push({
        month: monthStart.toLocaleString('default', { month: 'short' }),
        income: income[0]?.total || 0,
        expense: expenses[0]?.total || 0
      });
    }

    // Get category-wise spending
    const categorySpending = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: 'EXPENSE',
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category.name',
          total: { $sum: '$amount' },
          color: { $first: '$category.color' }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Get spending trends for the last 30 days
    const dailySpending = [];
    for (let i = 29; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      const dayStart = new Date(day.setHours(0, 0, 0, 0));
      const dayEnd = new Date(day.setHours(23, 59, 59, 999));
      
      const expenses = await Transaction.aggregate([
        {
          $match: {
            userId: req.user._id,
            type: 'EXPENSE',
            date: { $gte: dayStart, $lte: dayEnd }
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      dailySpending.push({
        date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: expenses[0]?.total || 0
      });
    }

    const [monthlyIncome, monthlyExpenses, totalTransactions] = await Promise.all([
      Transaction.aggregate([
        {
          $match: {
            userId: req.user._id,
            type: 'INCOME',
            date: {
              $gte: startOfMonth,
              $lte: endOfMonth
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]),
      Transaction.aggregate([
        {
          $match: {
            userId: req.user._id,
            type: 'EXPENSE',
            date: {
              $gte: startOfMonth,
              $lte: endOfMonth
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]),
      Transaction.countDocuments({ userId: req.user._id })
    ]);

    res.json({
      monthlyIncome: monthlyIncome[0]?.total || 0,
      monthlyExpenses: monthlyExpenses[0]?.total || 0,
      monthlyBalance: (monthlyIncome[0]?.total || 0) - (monthlyExpenses[0]?.total || 0),
      totalTransactions,
      charts: {
        monthlySummary,
        categorySpending: categorySpending.map(cat => ({
          name: cat._id,
          value: cat.total,
          color: cat.color
        })),
        dailySpending
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Finance Tracker API is running' });
});

// AI Routes
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('Finance Tracker API is running...');
});

// Update current user's profile
app.put('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    // Basic validation
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use' });
    }
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { name, email, phone } },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      createdAt: user.createdAt,
      currency: user.currency || 'USD',
      timezone: user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      avatar: user.avatar || null,
      notifications: user.notifications || {
        email: true,
        push: true,
        sms: false
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user's profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    // The user is already authenticated by the middleware and available in req.user
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      createdAt: user.createdAt,
      currency: user.currency || 'USD',
      timezone: user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      avatar: user.avatar || null,
      notifications: user.notifications || {
        email: true,
        push: true,
        sms: false
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users (for admin purposes)
app.get('/api/auth/all', authenticateToken, async (req, res) => {
  try {
    // In a real app, you'd want to check if the user is an admin
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});
