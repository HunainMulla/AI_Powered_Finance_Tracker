const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './config.env' });

// Import models
const User = require('./models/User');
const Category = require('./models/Category');
const Transaction = require('./models/Transaction');
const Budget = require('./models/Budget');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Transaction.deleteMany({});
    await Budget.deleteMany({});

    console.log('Cleared existing data');

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword
    });
    await user.save();
    console.log('Created test user: john@example.com / password123');

    // Create categories
    const categories = [
      { name: 'Salary', color: '#10B981', type: 'INCOME', userId: user._id },
      { name: 'Freelance', color: '#3B82F6', type: 'INCOME', userId: user._id },
      { name: 'Food & Dining', color: '#F59E0B', type: 'EXPENSE', userId: user._id },
      { name: 'Transportation', color: '#EF4444', type: 'EXPENSE', userId: user._id },
      { name: 'Shopping', color: '#8B5CF6', type: 'EXPENSE', userId: user._id },
      { name: 'Entertainment', color: '#EC4899', type: 'EXPENSE', userId: user._id },
      { name: 'Utilities', color: '#6B7280', type: 'EXPENSE', userId: user._id },
      { name: 'Healthcare', color: '#059669', type: 'EXPENSE', userId: user._id }
    ];

    const savedCategories = await Category.insertMany(categories);
    console.log('Created categories');

    // Create transactions
    const transactions = [
      {
        amount: 3500,
        type: 'INCOME',
        description: 'Monthly Salary',
        date: new Date(),
        categoryId: savedCategories[0]._id,
        userId: user._id
      },
      {
        amount: 500,
        type: 'INCOME',
        description: 'Freelance Project',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        categoryId: savedCategories[1]._id,
        userId: user._id
      },
      {
        amount: 85.50,
        type: 'EXPENSE',
        description: 'Grocery Shopping',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        categoryId: savedCategories[2]._id,
        userId: user._id
      },
      {
        amount: 45.00,
        type: 'EXPENSE',
        description: 'Gas Station',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        categoryId: savedCategories[3]._id,
        userId: user._id
      },
      {
        amount: 120.00,
        type: 'EXPENSE',
        description: 'New Shoes',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        categoryId: savedCategories[4]._id,
        userId: user._id
      },
      {
        amount: 65.00,
        type: 'EXPENSE',
        description: 'Movie Night',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        categoryId: savedCategories[5]._id,
        userId: user._id
      },
      {
        amount: 150.00,
        type: 'EXPENSE',
        description: 'Electricity Bill',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        categoryId: savedCategories[6]._id,
        userId: user._id
      },
      {
        amount: 75.00,
        type: 'EXPENSE',
        description: 'Doctor Visit',
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        categoryId: savedCategories[7]._id,
        userId: user._id
      }
    ];

    await Transaction.insertMany(transactions);
    console.log('Created transactions');

    // Create budgets
    const budgets = [
      {
        name: 'Groceries',
        amount: 300,
        spent: 85.50,
        period: 'MONTHLY',
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        userId: user._id
      },
      {
        name: 'Entertainment',
        amount: 200,
        spent: 65.00,
        period: 'MONTHLY',
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        userId: user._id
      },
      {
        name: 'Shopping',
        amount: 500,
        spent: 120.00,
        period: 'MONTHLY',
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        userId: user._id
      }
    ];

    await Budget.insertMany(budgets);
    console.log('Created budgets');

    console.log('✅ Seed data created successfully!');
    console.log('\nTest Account:');
    console.log('Email: john@example.com');
    console.log('Password: password123');
    console.log('\nYou can now log in and see the dummy data.');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run the seed function
connectDB().then(() => {
  seedData();
}); 