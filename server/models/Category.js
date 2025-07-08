const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  }
}, {
  timestamps: true
});

// Compound index to ensure unique category names per user
categorySchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema); 