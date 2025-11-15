# 🚀 Quick GitHub SSO Setup (5 minutes)

## Step 1: Create GitHub OAuth App

1. **Go to:** https://github.com/settings/developers
2. **Click:** "New OAuth App" (or "OAuth Apps" → "New OAuth App")
3. **Fill in:**
   - **Application name:** `Salary Calculator` (or any name)
   - **Homepage URL:** `http://localhost:5173`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/github/callback`
4. **Click:** "Register application"

## Step 2: Get Your Credentials

After creating, you'll see:
- **Client ID** (copy this)
- **Client Secret** (click "Generate a new client secret" if needed, then copy)

## Step 3: Update Backend .env

Open `backend/.env` and replace:
```env
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

With your actual values:
```env
GITHUB_CLIENT_ID=paste_your_client_id_here
GITHUB_CLIENT_SECRET=paste_your_client_secret_here
```

## Step 4: Restart Backend

The backend should auto-restart, but if not:
```bash
cd backend
# Stop current process (Ctrl+C) then:
npm run start:dev
```

## Step 5: Test

1. Go to `http://localhost:5173`
2. Click "Continue with GitHub"
3. You should be redirected to GitHub to authorize
4. After authorizing, you'll be logged in!

## 🔍 Troubleshooting

**404 Error?**
- Make sure backend is running: `curl http://localhost:3000/api/auth/github`
- Check that credentials are in `.env` (not just placeholders)
- Restart backend after updating `.env`

**"Redirect URI mismatch"?**
- Make sure callback URL in GitHub matches exactly: `http://localhost:3000/api/auth/github/callback`
- No trailing slashes, exact match required

**Still not working?**
- Check backend logs for errors
- Verify `.env` file has no extra spaces or quotes around values
- Make sure you're using the correct Client ID and Secret

