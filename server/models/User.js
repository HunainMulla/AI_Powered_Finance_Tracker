const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  goals: [{
    name: { 
      type: String,
      required: [true, 'Goal name is required'],
      trim: true
    },
    targetAmount: {
      type: Number,
      required: [true, 'Target amount is required'],
      min: [0.01, 'Target amount must be greater than 0']
    },
    currentAmount: {
      type: Number,
      default: 0
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required']
    },
    status: {
      type: String,
      enum: ['IN_PROGRESS', 'COMPLETED'],
      default: 'IN_PROGRESS'
    },
    description: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      enum: ['SAVINGS', 'TRAVEL', 'TRANSPORTATION', 'HOME', 'EDUCATION', 'OTHER'],
      default: 'SAVINGS'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Budgets
  budgets: [{
    name: {
      type: String,
      required: [true, 'Budget name is required'],
      trim: true
    },
    amount: {
      type: Number,
      required: [true, 'Budget amount is required'],
      min: [0.01, 'Amount must be greater than 0']
    },
    spent: {
      type: Number,
      default: 0,
      min: [0, 'Spent amount cannot be negative']
    },
    period: {
      type: String,
      required: [true, 'Budget period is required'],
      enum: ['MONTHLY', 'YEARLY', 'CUSTOM'],
      default: 'MONTHLY'
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [
        function() { return this.period === 'CUSTOM'; },
        'End date is required for custom period'
      ]
    },
    category: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Transactions
  transactions: [{
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0']
    },
    type: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: ['INCOME', 'EXPENSE'],
      default: 'EXPENSE'
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now
    },
    category: {
      type: String,
      required: [true, 'Category is required']
    },
    paymentMethod: {
      type: String,
      trim: true
    },
    isRecurring: {
      type: Boolean,
      default: false
    },
    recurringDetails: {
      frequency: {
        type: String,
        enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
        required: [
          function() { return this.isRecurring; },
          'Frequency is required for recurring transactions'
        ]
      },
      endDate: Date
    },
    notes: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Categories
  categories: [{
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true
    },
    color: {
      type: String,
      required: [true, 'Color is required'],
      default: '#3B82F6'
    },
    icon: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      required: [true, 'Category type is required'],
      enum: ['INCOME', 'EXPENSE'],
      default: 'EXPENSE'
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  avatar: {
    type: String,
    default: null
  },
  currency: {
    type: String,
    default: 'USD'
  },
  timezone: {
    type: String,
    default: Intl.DateTimeFormat().resolvedOptions().timeZone
  },
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get user without password
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema); 