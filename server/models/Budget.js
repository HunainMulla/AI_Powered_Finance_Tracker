const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
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
    required: [true, 'End date is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  }
}, {
  timestamps: true
});

// Virtual for remaining budget
budgetSchema.virtual('remaining').get(function() {
  return this.amount - this.spent;
});

// Virtual for percentage spent
budgetSchema.virtual('percentageSpent').get(function() {
  return this.amount > 0 ? (this.spent / this.amount) * 100 : 0;
});

// Ensure virtuals are included when converting to JSON
budgetSchema.set('toJSON', { virtuals: true });

// Index for better query performance
budgetSchema.index({ userId: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Budget', budgetSchema); 