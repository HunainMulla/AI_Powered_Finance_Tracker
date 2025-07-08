const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
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
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  }
}, {
  timestamps: true
});

// Index for better query performance
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, categoryId: 1 });

module.exports = mongoose.model('Transaction', transactionSchema); 