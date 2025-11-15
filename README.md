# 💰 Indian Salary Calculator

A modern, Gen Z-friendly web application to calculate your in-hand salary according to Indian tax laws. Built with React/Vite frontend and NestJS backend.

## ✨ Features

- 🧮 Calculate in-hand salary based on CTC and city
- 📍 Support for major Indian cities with accurate tax calculations
- 💼 Track GitHub and LinkedIn profiles
- 📊 Detailed salary breakdown (Basic, HRA, EPF, ESI, Professional Tax, Income Tax)
- 🎨 Modern, beautiful UI with smooth animations
- 💾 Save calculation history in PostgreSQL database
- 🔐 GitHub OAuth & Email/Password authentication
- 📈 Variable pay and insurance support
- 📜 User-specific calculation history

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
- PostgreSQL (Neon)
- TypeORM
- JWT Authentication
- Passport.js (GitHub OAuth)
- bcryptjs (Password hashing)

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.13.1 or higher)
- PostgreSQL (v12 or higher) or Neon account
- npm or pnpm
- GitHub account (for OAuth)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/akashkaintura/salary-calculator.git
cd salary-calculator
```

2. **Set up the Backend**

```bash
cd backend
npm install

# Create a .env file
cp .env.example .env

# Edit .env with your database credentials
# See Environment Variables section below
```

3. **Set up Database (Neon or Local PostgreSQL)**

**Option A: Using Neon (Recommended)**
- Go to [neon.tech](https://neon.tech) and create a project
- Copy your `DATABASE_URL` connection string
- Add it to `backend/.env`

**Option B: Local PostgreSQL**
```bash
createdb salary_calculator
# Or using psql
psql -U postgres
CREATE DATABASE salary_calculator;
\q
```

4. **Seed the Database (Optional)**
```bash
cd backend
npm run seed
```

5. **Start the Backend**
```bash
cd backend
npm run start:dev
```
The backend will run on `http://localhost:3000`

6. **Set up the Frontend**
```bash
cd frontend
npm install

# Create a .env file
echo "VITE_API_URL=http://localhost:3000" > .env
```

7. **Start the Frontend**
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

## 📝 Environment Variables

### Backend (.env)

```env
# Database Configuration - Neon PostgreSQL (Recommended)
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require&channel_binding=require

# OR Use individual parameters (for local development)
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=your_password
# DB_NAME=salary_calculator

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# GitHub OAuth (Get from https://github.com/settings/developers)
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback

# JWT Secret (Generate: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
```

## 🔐 Authentication Setup

### GitHub OAuth Setup

1. **Create GitHub OAuth App**
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click "New OAuth App"
   - Fill in:
     - **Application name**: `Salary Calculator`
     - **Homepage URL**: `http://localhost:5173` (or your Vercel URL)
     - **Authorization callback URL**: `http://localhost:3000/api/auth/github/callback` (or your backend URL)
   - Click "Register application"

2. **Get Credentials**
   - Copy **Client ID**
   - Generate and copy **Client Secret**
   - Add both to `backend/.env`

### Email/Password Authentication

- Users can register with email and password
- No additional setup required
- Passwords are securely hashed with bcrypt

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub
2. **Create New Project**
   - Click "Add New..." → "Project"
   - Import repository: `akashkaintura/salary-calculator`
   - Configure:
     - **Root Directory**: `frontend`
     - **Framework Preset**: Vite (auto-detected)
     - **Build Command**: `npm run build` (auto-detected)
     - **Output Directory**: `dist` (auto-detected)
3. **Add Environment Variable**
   - `VITE_API_URL`: Your backend URL (e.g., `https://your-backend.onrender.com`)
4. **Deploy**
   - Click "Deploy"
   - Get your Vercel URL

### Backend Deployment (Render)

1. **Go to [render.com](https://render.com)** and sign in with GitHub
2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect repository: `akashkaintura/salary-calculator`
   - Configure:
     - **Name**: `salary-calculator-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm run start:prod`
3. **Add Environment Variables**
   ```
   DATABASE_URL=your_neon_database_url
   NODE_ENV=production
   PORT=3000
   FRONTEND_URL=your_vercel_frontend_url
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GITHUB_CALLBACK_URL=your_render_backend_url/api/auth/github/callback
   JWT_SECRET=your_jwt_secret
   ```
4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment
   - Get your Render URL

### Update GitHub OAuth After Deployment

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Edit your OAuth App
3. Update:
   - **Homepage URL**: Your Vercel frontend URL
   - **Authorization callback URL**: Your Render backend URL + `/api/auth/github/callback`
4. Save changes

## 🧮 Salary Calculation Logic

The calculator uses the following structure:

- **Basic Salary**: 50% of Fixed CTC
- **HRA**: 40% of Fixed CTC
- **Special Allowance**: 10% of Fixed CTC
- **Fixed CTC**: Total CTC - Variable Pay - Insurance
- **EPF**: 12% of Basic Salary (employee contribution)
- **ESI**: 0.75% of Gross Salary (if salary < ₹21,000)
- **Professional Tax**: Varies by state/city
- **Income Tax**: Based on new tax regime 2024-25

### Variable Pay & Insurance

- **Variable Pay**: Part of CTC but not included in monthly salary calculations
- **Insurance**: Health/Life insurance premiums (part of CTC, not monthly salary)
- Monthly salary is calculated from **Fixed CTC** only

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register with email/password
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/github` - Initiate GitHub OAuth
- `GET /api/auth/github/callback` - GitHub OAuth callback
- `GET /api/auth/me` - Get current user profile (requires auth)
- `POST /api/auth/update-profile` - Update user profile (requires auth)

### Salary Calculation
- `POST /api/salary/calculate` - Calculate salary breakdown (requires auth)
- `GET /api/salary/history` - Get user's calculation history (requires auth)

## 📁 Project Structure

```
salary-calculator/
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Main application component
│   │   ├── App.css              # Styles
│   │   ├── main.tsx             # Entry point
│   │   ├── components/
│   │   │   └── Login.tsx        # Login/Signup component
│   │   └── contexts/
│   │       └── AuthContext.tsx  # Authentication context
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── main.ts              # Application entry point
│   │   ├── app.module.ts        # Root module
│   │   ├── auth/                # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/      # GitHub & JWT strategies
│   │   │   └── dto/             # Register & Login DTOs
│   │   ├── user/                # User module
│   │   │   └── entities/
│   │   │       └── user.entity.ts
│   │   └── salary/              # Salary calculation module
│   │       ├── salary.controller.ts
│   │       ├── salary.service.ts
│   │       ├── dto/
│   │       └── entities/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🔄 Continuous Deployment

Both Vercel and Render automatically deploy when you push to the `main` branch:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

## 🐛 Troubleshooting

### Backend not connecting to database
- Verify `DATABASE_URL` is correct
- Check that Neon database is active (not paused)
- Ensure SSL is enabled (Neon requires SSL)

### CORS errors
- Ensure `FRONTEND_URL` in backend matches your Vercel URL exactly
- Check that frontend is using the correct `VITE_API_URL`

### Authentication not working
- Verify GitHub OAuth credentials are correct
- Check that callback URL matches exactly
- Ensure JWT_SECRET is set

### Build failures
- Check Node.js version (should be 20+)
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
