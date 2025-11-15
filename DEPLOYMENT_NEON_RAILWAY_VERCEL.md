# 🚀 Deployment Guide: Neon + Railway + Vercel

This guide will help you deploy your Salary Calculator application using:
- **Neon** (PostgreSQL Database)
- **Railway** (Backend - NestJS)
- **Vercel** (Frontend - React/Vite)

---

## 📋 Prerequisites

1. GitHub account with your code pushed to a repository
2. Neon account (free tier available)
3. Railway account (free tier with $5 credit/month)
4. Vercel account (free tier available)

---

## 🗄️ Step 1: Set Up Neon Database

1. **Go to [neon.tech](https://neon.tech)** and sign up/login
2. **Create a new project**
   - Choose a project name (e.g., `salary-calculator`)
   - Select a region (e.g., `ap-southeast-1` for Asia Pacific)
   - Click "Create Project"

3. **Copy your connection string**
   - After creating the project, you'll see a connection string like:
   ```
   postgresql://neondb_owner:npg_jVYdhUS13lEz@ep-odd-sound-a17g45gu-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```
   - **Keep this secure!** This is your `DATABASE_URL`

4. **Test the connection** (optional)
   ```bash
   psql "postgresql://neondb_owner:npg_jVYdhUS13lEz@ep-odd-sound-a17g45gu-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
   ```

---

## 🚂 Step 2: Deploy Backend to Railway

1. **Go to [railway.app](https://railway.app)** and sign up/login with GitHub

2. **Create a new project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will detect it's a Node.js project

3. **Configure the service**
   - Railway should auto-detect the backend folder
   - If not, go to Settings → Source → Root Directory → Set to `backend`
   - Go to Settings → Deploy → Build Command: `npm install && npm run build`
   - Go to Settings → Deploy → Start Command: `npm run start:prod`

4. **Add Environment Variables**
   - Go to the service → Variables tab
   - Add the following environment variables:

   ```
   DATABASE_URL=postgresql://neondb_owner:npg_jVYdhUS13lEz@ep-odd-sound-a17g45gu-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   NODE_ENV=production
   PORT=3000
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

   **Note:** Replace `https://your-frontend.vercel.app` with your actual Vercel URL (you'll get this after deploying the frontend)

5. **Deploy**
   - Railway will automatically start building and deploying
   - Wait for the deployment to complete
   - Railway will provide a URL like: `https://your-backend.railway.app`
   - **Copy this URL** - you'll need it for the frontend

6. **Get your Railway backend URL**
   - Go to your service → Settings → Networking
   - Generate a public domain (e.g., `salary-calculator-backend.railway.app`)
   - This is your backend API URL

---

## ⚡ Step 3: Deploy Frontend to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign up/login with GitHub

2. **Create a new project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Configure the project:
     - **Framework Preset:** Vite
     - **Root Directory:** `frontend`
     - **Build Command:** `npm run build` (auto-detected)
     - **Output Directory:** `dist` (auto-detected)
     - **Install Command:** `npm install` (auto-detected)

3. **Add Environment Variables**
   - In the project settings, go to "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://your-backend.railway.app
     ```
   - **Important:** Replace `https://your-backend.railway.app` with your actual Railway backend URL from Step 2

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - Once deployed, you'll get a URL like: `https://salary-calculator.vercel.app`

5. **Update Backend CORS**
   - Go back to Railway → Your backend service → Variables
   - Update `FRONTEND_URL` to your Vercel URL:
     ```
     FRONTEND_URL=https://salary-calculator.vercel.app
     ```
   - Railway will automatically redeploy with the new environment variable

---

## ✅ Step 4: Verify Deployment

1. **Test the frontend**
   - Visit your Vercel URL
   - Try calculating a salary
   - Check browser console for any errors

2. **Test the backend**
   - Visit `https://your-backend.railway.app/api/salary/history`
   - You should see an empty array `[]` (or your calculation history)

3. **Check database connection**
   - Make a calculation from the frontend
   - Check Railway logs to ensure no database connection errors
   - Verify data is being saved in Neon dashboard

---

## 🔧 Environment Variables Summary

### Railway (Backend)
```
DATABASE_URL=postgresql://neondb_owner:npg_jVYdhUS13lEz@ep-odd-sound-a17g45gu-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-frontend.vercel.app
```

### Vercel (Frontend)
```
VITE_API_URL=https://your-backend.railway.app
```

---

## 🔄 Continuous Deployment

Both Railway and Vercel automatically deploy when you push to your main branch:

1. **Make changes** to your code
2. **Commit and push** to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. **Railway and Vercel** will automatically detect the changes and redeploy

---

## 🐛 Troubleshooting

### Backend not connecting to database
- ✅ Verify `DATABASE_URL` is correct in Railway
- ✅ Check that Neon database is active (not paused)
- ✅ Ensure SSL is enabled (Neon requires SSL)
- ✅ Check Railway logs for connection errors

### CORS errors
- ✅ Ensure `FRONTEND_URL` in Railway matches your Vercel URL exactly (including `https://`)
- ✅ Check that the frontend is using the correct `VITE_API_URL`

### Frontend can't reach backend
- ✅ Verify `VITE_API_URL` in Vercel matches your Railway backend URL
- ✅ Check that Railway service is running (not sleeping)
- ✅ Ensure Railway public domain is generated

### Build failures
- ✅ Check Railway/Vercel build logs
- ✅ Verify Node.js version (should be 20+)
- ✅ Ensure all dependencies are in `package.json`

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** - They're already in `.gitignore`
2. **Use environment variables** - Never hardcode credentials
3. **Rotate database credentials** - If exposed, regenerate in Neon dashboard
4. **Enable HTTPS** - Both Railway and Vercel provide HTTPS by default
5. **Monitor logs** - Regularly check Railway and Vercel logs for errors

---

## 📊 Monitoring

### Railway
- View logs: Service → Deployments → Click on a deployment → View logs
- Monitor usage: Dashboard → Usage tab

### Vercel
- View logs: Project → Deployments → Click on a deployment → View logs
- Monitor analytics: Project → Analytics tab

### Neon
- View database usage: Dashboard → Your project → Usage
- View connection strings: Dashboard → Your project → Connection Details

---

## 💰 Cost Estimation

### Free Tier Limits

**Neon:**
- 0.5 GB storage
- 1 project
- Perfect for development/small projects

**Railway:**
- $5 credit/month
- ~500 hours of runtime (enough for 24/7 small app)
- Additional usage: $0.000463/GB-hour

**Vercel:**
- Unlimited deployments
- 100 GB bandwidth/month
- Perfect for frontend hosting

**Total:** $0/month for small projects! 🎉

---

## 🎉 You're Done!

Your Salary Calculator is now live at:
- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-backend.railway.app`
- **Database:** Neon (managed)

Happy deploying! 🚀

