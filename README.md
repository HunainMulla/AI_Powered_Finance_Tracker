# Finance Tracker - Dynamic Web Application

A full-stack finance tracking application built with Next.js, Express.js, and MongoDB. Users can register, login, and manage their personal finances including transactions, budgets, categories, and financial goals.

## Features

- **User Authentication**: Register and login with JWT tokens
- **Dashboard**: Real-time financial overview with monthly stats
- **Transactions**: Add, view, and delete income/expense transactions
- **Categories**: Organize transactions with custom categories
- **Budgets**: Set and track spending limits
- **Financial Goals**: Set and monitor progress towards financial milestones
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- Next.js 14 (React)
- TypeScript
- Tailwind CSS
- Lucide React Icons
- React Hook Form
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Finance_Project
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**

   Create a `config.env` file in the `server` directory:
   ```env
   DATABASE_URL=mongodb://localhost:27017/finance_tracker
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```

5. **Start the backend server**
   ```bash
   cd server
   npm start
   ```

6. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```

7. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Usage

1. **Register a new account** at http://localhost:3000/register
2. **Login** with your credentials
3. **Add categories** for organizing your transactions
4. **Create transactions** to track income and expenses
5. **Set budgets** to monitor spending
6. **Create financial goals** to track progress
7. **View your dashboard** for an overview of your finances

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `DELETE /api/categories/:id` - Delete category

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create new budget

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## Project Structure

```
Finance_Project/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   └── lib/          # API utilities
│   └── package.json
├── server/                # Express.js backend
│   ├── models/           # MongoDB models
│   ├── config/           # Database configuration
│   ├── index.js          # Main server file
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 