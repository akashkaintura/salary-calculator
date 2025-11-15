# 💰 Indian Salary Calculator

A modern, Gen Z-friendly web application to calculate your in-hand salary according to Indian tax laws. Built with React/Vite frontend and NestJS backend.

## ✨ Features

- 🧮 Calculate in-hand salary based on CTC and city
- 📍 Support for major Indian cities with accurate tax calculations
- 💼 Track GitHub and LinkedIn profiles
- 📊 Detailed salary breakdown (Basic, HRA, EPF, ESI, Professional Tax, Income Tax)
- 🎨 Modern, beautiful UI with smooth animations
- 💾 Save calculation history in PostgreSQL database

## 🛠️ Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Lucide React (Icons)
- Axios

### Backend
- NestJS
- TypeScript
- PostgreSQL
- TypeORM

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.13.1 or higher)
- PostgreSQL (v12 or higher)
- npm or pnpm

### Installation

1. **Clone the repository**
```bash
cd /Users/akashkaintura/Desktop/salary-calculator
```

2. **Set up the Backend**

```bash
cd backend
npm install

# Create a .env file
cp .env.example .env

# Edit .env with your PostgreSQL credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=your_password
# DB_NAME=salary_calculator
```

3. **Set up PostgreSQL Database**

```bash
# Create database
createdb salary_calculator

# Or using psql
psql -U postgres
CREATE DATABASE salary_calculator;
\q
```

4. **Start the Backend**

```bash
cd backend
npm run start:dev
```

The backend will run on `http://localhost:3000`

5. **Set up the Frontend**

```bash
cd frontend
npm install

# Create a .env file (optional, defaults to localhost:3000)
echo "VITE_API_URL=http://localhost:3000" > .env
```

6. **Start the Frontend**

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
salary-calculator/
├── frontend/
│   ├── src/
│   │   ├── App.tsx          # Main application component
│   │   ├── App.css          # Styles
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── main.ts          # Application entry point
│   │   ├── app.module.ts    # Root module
│   │   └── salary/
│   │       ├── salary.controller.ts
│   │       ├── salary.service.ts
│   │       ├── salary.module.ts
│   │       ├── dto/
│   │       └── entities/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🧮 Salary Calculation Logic

The calculator uses the following structure:

- **Basic Salary**: 50% of CTC
- **HRA**: 40% of CTC
- **Special Allowance**: 10% of CTC
- **EPF**: 12% of Basic Salary (employee contribution)
- **ESI**: 0.75% of Gross Salary (if salary < ₹21,000)
- **Professional Tax**: Varies by state/city
- **Income Tax**: Based on new tax regime 2024-25

## 🌐 Deployment Options

> **📘 Quick Start:** For step-by-step instructions with **Neon + Railway + Vercel**, see [DEPLOYMENT_NEON_RAILWAY_VERCEL.md](./DEPLOYMENT_NEON_RAILWAY_VERCEL.md)

### Option 1: Vercel (Recommended for Frontend) + Railway/Render (Backend)

**Frontend (Vercel):**
- Free tier available
- Automatic deployments from GitHub
- Great for React/Vite apps
- Easy setup

**Backend (Railway/Render):**
- Railway: Free tier with $5 credit/month
- Render: Free tier available
- Easy PostgreSQL integration
- Automatic deployments

### Option 2: AWS Free Tier

**Frontend:**
- S3 + CloudFront for static hosting
- Free tier: 5GB storage, 20,000 GET requests

**Backend:**
- EC2 t2.micro (free for 12 months)
- RDS PostgreSQL (free tier available)
- Elastic Beanstalk for easier deployment

### Option 3: GitHub Pages (Frontend only)

- Free static hosting
- Requires backend to be hosted separately
- Good for demo/prototype

## 📝 Environment Variables

### Backend (.env)
```env
# Option 1: Use DATABASE_URL (recommended for Neon, Railway, etc.)
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# Option 2: Use individual parameters (for local development)
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=your_password
# DB_NAME=salary_calculator

PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

## 🎯 API Endpoints

- `POST /api/salary/calculate` - Calculate salary breakdown
- `GET /api/salary/history` - Get calculation history

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

