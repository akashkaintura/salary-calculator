# 🚀 Deployment Guide

This guide covers different deployment options for the Salary Calculator application.

## 📋 Table of Contents

1. [Vercel + Railway/Render (Recommended)](#vercel--railwayrender-recommended)
2. [AWS Free Tier](#aws-free-tier)
3. [Docker Deployment](#docker-deployment)
4. [GitHub Pages (Frontend Only)](#github-pages-frontend-only)

---

## 🎯 Option 1: Vercel + Railway/Render (Recommended)

### Why This Option?
- ✅ Easiest setup
- ✅ Free tiers available
- ✅ Automatic deployments from GitHub
- ✅ Great developer experience

### Frontend Deployment (Vercel)

1. **Push your code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your repository
   - Set root directory to `frontend`
   - Add environment variable:
     - `VITE_API_URL`: Your backend URL (e.g., `https://your-backend.railway.app`)
   - Click "Deploy"

3. **Vercel will automatically deploy on every push to main branch**

### Backend Deployment (Railway)

1. **Go to [railway.app](https://railway.app)**
   - Sign up/login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Set root directory to `backend`

2. **Add PostgreSQL Database**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically set environment variables

3. **Set Environment Variables**
   - `DB_HOST`: (Auto-set by Railway)
   - `DB_PORT`: (Auto-set by Railway)
   - `DB_USERNAME`: (Auto-set by Railway)
   - `DB_PASSWORD`: (Auto-set by Railway)
   - `DB_NAME`: (Auto-set by Railway)
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Your Vercel frontend URL
   - `PORT`: `3000`

4. **Deploy**
   - Railway will automatically detect it's a Node.js app
   - It will run `npm install` and `npm run build`
   - Add a start script: `npm run start:prod`

### Backend Deployment (Render - Alternative)

1. **Go to [render.com](https://render.com)**
   - Sign up/login
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Set root directory to `backend`

2. **Configure**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
   - Environment: `Node`

3. **Add PostgreSQL Database**
   - Click "New" → "PostgreSQL"
   - Copy the connection string

4. **Set Environment Variables**
   - Use the PostgreSQL connection string from Render
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Your Vercel frontend URL

---

## ☁️ Option 2: AWS Free Tier

### Prerequisites
- AWS Account (Free tier available for 12 months)
- AWS CLI installed and configured

### Frontend (S3 + CloudFront)

1. **Build the frontend**
```bash
cd frontend
npm run build
```

2. **Create S3 Bucket**
```bash
aws s3 mb s3://salary-calculator-frontend
aws s3 website s3://salary-calculator-frontend --index-document index.html
```

3. **Upload files**
```bash
aws s3 sync dist/ s3://salary-calculator-frontend --delete
```

4. **Set bucket policy for public read**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::salary-calculator-frontend/*"
    }
  ]
}
```

5. **Create CloudFront Distribution** (Optional, for HTTPS)
   - Go to CloudFront console
   - Create distribution
   - Origin: Your S3 bucket
   - Enable HTTPS

### Backend (EC2 + RDS)

1. **Launch EC2 Instance**
   - Choose Amazon Linux 2
   - Instance type: t2.micro (free tier)
   - Configure security group: Allow port 3000

2. **Connect and Setup**
```bash
ssh -i your-key.pem ec2-user@your-ec2-ip

# Install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# Clone repository
git clone <your-repo-url>
cd salary-calculator/backend

# Install dependencies
npm install
npm run build
```

3. **Setup PM2 (Process Manager)**
```bash
npm install -g pm2
pm2 start dist/main.js --name salary-calculator
pm2 startup
pm2 save
```

4. **Create RDS PostgreSQL Database**
   - Go to RDS Console
   - Create PostgreSQL database (free tier: db.t2.micro)
   - Note the endpoint and credentials

5. **Set Environment Variables**
```bash
export DB_HOST=your-rds-endpoint
export DB_PORT=5432
export DB_USERNAME=postgres
export DB_PASSWORD=your-password
export DB_NAME=salary_calculator
export NODE_ENV=production
export FRONTEND_URL=https://your-cloudfront-url
```

---

## 🐳 Option 3: Docker Deployment

### Using Docker Compose (Local/Server)

1. **Clone and navigate**
```bash
cd /Users/akashkaintura/Desktop/salary-calculator
```

2. **Update environment variables in docker-compose.yml**

3. **Build and run**
```bash
docker-compose up -d
```

4. **Access**
   - Frontend: http://localhost
   - Backend: http://localhost:3000

### Deploy to Cloud with Docker

**Railway/Render:**
- Both support Docker deployments
- Just push your code with Dockerfile
- They'll automatically build and deploy

**AWS ECS:**
- Create ECR repository
- Build and push Docker image
- Create ECS cluster and service
- Configure load balancer

---

## 📄 Option 4: GitHub Pages (Frontend Only)

**Note:** This only works for frontend. You'll need to host backend separately.

1. **Update vite.config.ts**
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/salary-calculator/', // Your repo name
})
```

2. **Build**
```bash
cd frontend
npm run build
```

3. **Deploy to GitHub Pages**
   - Go to repository Settings → Pages
   - Source: GitHub Actions
   - Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: cd frontend && npm install && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
```

---

## 🔧 Environment Variables Summary

### Frontend
- `VITE_API_URL`: Backend API URL

### Backend
- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port (default: 5432)
- `DB_USERNAME`: PostgreSQL username
- `DB_PASSWORD`: PostgreSQL password
- `DB_NAME`: Database name
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: `production` or `development`
- `FRONTEND_URL`: Frontend URL for CORS

---

## ✅ Post-Deployment Checklist

- [ ] Backend is accessible and returning responses
- [ ] Frontend can connect to backend API
- [ ] Database connection is working
- [ ] CORS is properly configured
- [ ] Environment variables are set correctly
- [ ] HTTPS is enabled (for production)
- [ ] Error handling is working
- [ ] Logs are being monitored

---

## 🆘 Troubleshooting

### Backend not connecting to database
- Check database credentials
- Verify database is accessible from your hosting provider
- Check firewall/security group settings

### CORS errors
- Ensure `FRONTEND_URL` is set correctly in backend
- Check that frontend URL matches exactly (including https/http)

### Build failures
- Check Node.js version (should be 20+)
- Verify all dependencies are installed
- Check for TypeScript errors

---

## 💡 Recommendations

**For Production:**
1. Use **Vercel + Railway** for easiest setup
2. Enable HTTPS everywhere
3. Set up monitoring (Sentry, LogRocket)
4. Use environment-specific configurations
5. Set up CI/CD pipelines
6. Regular database backups

**For Development:**
- Use Docker Compose locally
- Use separate databases for dev/staging/prod
- Enable detailed logging in development

