# 🔐 GitHub OAuth Setup Guide

This guide will help you set up GitHub OAuth authentication for the Salary Calculator app.

## 📋 Prerequisites

- GitHub account
- Backend server running

## 🚀 Step-by-Step Setup

### 1. Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"** (or **"New GitHub App"** if you prefer, but OAuth App is simpler)
3. Fill in the application details:
   - **Application name**: `Salary Calculator` (or any name you prefer)
   - **Homepage URL**: 
     - For local: `http://localhost:5173`
     - For production: Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
   - **Authorization callback URL**: 
     - For local: `http://localhost:3000/api/auth/github/callback`
     - For production: Your Railway backend URL (e.g., `https://your-backend.railway.app/api/auth/github/callback`)
4. Click **"Register application"**

### 2. Get Your OAuth Credentials

After creating the app, you'll see:
- **Client ID** (public)
- **Client Secret** (keep this private!)

### 3. Configure Backend Environment Variables

Add these to your backend `.env` file:

```env
# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL (for redirects)
FRONTEND_URL=http://localhost:5173
```

### 4. For Production (Railway + Vercel)

When deploying:

**Railway (Backend):**
```env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=https://your-backend.railway.app/api/auth/github/callback
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-frontend.vercel.app
```

**Vercel (Frontend):**
```env
VITE_API_URL=https://your-backend.railway.app
```

### 5. Update GitHub OAuth App for Production

1. Go back to your GitHub OAuth App settings
2. Update the **Authorization callback URL** to your production backend URL
3. Update the **Homepage URL** to your production frontend URL

## 🔒 Security Notes

1. **Never commit** `.env` files to Git
2. **Use different** Client IDs/Secrets for development and production
3. **Generate a strong** JWT_SECRET (you can use: `openssl rand -base64 32`)
4. **Keep** Client Secret secure - it's like a password

## ✅ Testing

1. Start your backend: `cd backend && npm run start:dev`
2. Start your frontend: `cd frontend && npm run dev`
3. Visit `http://localhost:5173`
4. Click "Continue with GitHub"
5. Authorize the app
6. You should be redirected back and logged in!

## 🐛 Troubleshooting

### "Redirect URI mismatch" error
- Make sure the callback URL in GitHub matches exactly (including http/https, port, trailing slashes)
- Check your `GITHUB_CALLBACK_URL` in `.env`

### "Invalid client" error
- Verify your `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are correct
- Make sure there are no extra spaces in your `.env` file

### CORS errors
- Ensure `FRONTEND_URL` in backend matches your frontend URL exactly
- Check that CORS is enabled in `main.ts`

## 📚 Additional Resources

- [GitHub OAuth Documentation](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
- [Passport.js GitHub Strategy](http://www.passportjs.org/packages/passport-github2/)

