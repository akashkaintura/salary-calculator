# ⚡ Quick Start Guide

Get your Salary Calculator up and running in 5 minutes!

## 🚀 Local Development Setup

### 1. Prerequisites Check
```bash
# Check Node.js version (should be 20+)
node --version

# Check if PostgreSQL is installed
psql --version
```

### 2. Setup Database
```bash
# Create database
createdb salary_calculator

# Or using psql
psql -U postgres
CREATE DATABASE salary_calculator;
\q
```

### 3. Backend Setup
```bash
cd /Users/akashkaintura/Desktop/salary-calculator/backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=salary_calculator
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
EOF

# Start backend
npm run start:dev
```

Backend will run on `http://localhost:3000` ✅

### 4. Frontend Setup
```bash
# Open new terminal
cd /Users/akashkaintura/Desktop/salary-calculator/frontend

# Install dependencies (if not already done)
npm install

# Start frontend
npm run dev
```

Frontend will run on `http://localhost:5173` ✅

### 5. Test It Out!
1. Open `http://localhost:5173` in your browser
2. Enter a CTC (e.g., 1200000)
3. Select a city (e.g., Bangalore)
4. Optionally add GitHub/LinkedIn profiles
5. Click "Calculate Salary"
6. See your detailed salary breakdown! 🎉

## 🐳 Docker Quick Start (Alternative)

If you prefer Docker:

```bash
cd /Users/akashkaintura/Desktop/salary-calculator

# Start everything with Docker Compose
docker-compose up -d

# Access frontend at http://localhost
# Backend at http://localhost:3000
```

## 📝 Common Issues

### Port already in use
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change PORT in backend/.env
```

### Database connection error
- Make sure PostgreSQL is running: `pg_isready`
- Check credentials in `backend/.env`
- Verify database exists: `psql -l | grep salary_calculator`

### Frontend can't connect to backend
- Check backend is running on port 3000
- Verify `VITE_API_URL` in frontend/.env (or it defaults to localhost:3000)
- Check CORS settings in backend

## 🎯 Next Steps

- Read [README.md](./README.md) for detailed documentation
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment options
- Customize the UI in `frontend/src/App.css`
- Modify tax calculations in `backend/src/salary/salary.service.ts`

Happy coding! 🚀

