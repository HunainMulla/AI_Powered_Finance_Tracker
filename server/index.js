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
    const { amount, type, description, date, categoryId } = req.body;

    if (!amount || !type || !description || !date || !categoryId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const transaction = new Transaction({
      amount: parseFloat(amount),
      type,
      description,
      date: new Date(date),
      categoryId,
      userId: req.user._id
    });

    await transaction.save();
    await transaction.populate('categoryId');

    res.json(transaction);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Server error' });
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

// Dashboard Stats
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

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

    const stats = {
      monthlyIncome: monthlyIncome[0]?.total || 0,
      monthlyExpenses: monthlyExpenses[0]?.total || 0,
      monthlyBalance: (monthlyIncome[0]?.total || 0) - (monthlyExpenses[0]?.total || 0),
      totalTransactions
    };

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Finance Tracker API is running' });
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
