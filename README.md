# Personal Finance Tracker

A modern, full-stack personal finance tracking application built with Next.js, Node.js, MongoDB, and Mongoose.

## Features

- **User Authentication**: Secure login and registration system
- **Transaction Management**: Add, view, and delete income and expenses
- **Category Management**: Organize transactions with custom categories
- **Budget Tracking**: Set and monitor spending budgets
- **Dashboard Analytics**: View monthly income, expenses, and balance
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling and validation
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM (Object Document Mapper)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Finance_Project
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**

   Create a `config.env` file in the server directory:
   ```env
   DATABASE_URL="mongodb://localhost:27017/finance_tracker"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   PORT=5000
   ```

   Create a `.env.local` file in the client directory:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000/api"
   ```

5. **Add dummy data for testing (optional)**
   ```bash
   cd server
   npm run seed
   ```
   This will create a test account with sample data:
   - Email: john@example.com
   - Password: password123

6. **Start the development servers**

   Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

   Start the frontend development server:
   ```bash
   cd client
   npm run dev
   ```

7. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
Finance_Project/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   └── lib/          # Utilities and API
│   ├── package.json
│   └── ...
├── server/                # Node.js backend
│   ├── models/           # Mongoose models
│   ├── config/           # Database configuration
│   ├── index.js          # Express server
│   ├── package.json
│   └── ...
└── README.md
```

## Database Models

The application uses MongoDB with Mongoose schemas:

### User Model
- `name`: User's full name
- `email`: Unique email address
- `password`: Hashed password
- `timestamps`: Created and updated timestamps

### Transaction Model
- `amount`: Transaction amount
- `type`: INCOME or EXPENSE
- `description`: Transaction description
- `date`: Transaction date
- `categoryId`: Reference to Category
- `userId`: Reference to User
- `timestamps`: Created and updated timestamps

### Category Model
- `name`: Category name
- `color`: Category color for UI
- `icon`: Optional icon
- `type`: INCOME or EXPENSE
- `userId`: Reference to User
- `timestamps`: Created and updated timestamps

### Budget Model
- `name`: Budget name
- `amount`: Budget amount
- `spent`: Amount spent so far
- `period`: MONTHLY, YEARLY, or CUSTOM
- `startDate`: Budget start date
- `endDate`: Budget end date
- `userId`: Reference to User
- `timestamps`: Created and updated timestamps

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create new budget

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## Usage

1. **Register/Login**: Create an account or sign in
2. **Create Categories**: Set up categories for your transactions
3. **Add Transactions**: Record your income and expenses
4. **View Dashboard**: Monitor your financial overview
5. **Set Budgets**: Create spending limits (optional)

## Mongoose Features Used

- **Schema Validation**: Built-in validation for all fields
- **Middleware**: Password hashing before save
- **Virtual Properties**: Computed fields like budget remaining
- **Indexes**: Performance optimization for queries
- **Population**: Joining related documents
- **Aggregation**: Complex queries for dashboard stats

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository. 