# Google OAuth Credentials Setup

## Your Google OAuth Credentials

✅ **Client ID**: (Check your Google Cloud Console or the JSON file you downloaded)
✅ **Client Secret**: (Check your Google Cloud Console or the JSON file you downloaded)
✅ **Backend URL**: `https://salary-calculator-7lhz.onrender.com`

## Step 1: Add to Backend .env File

Open `backend/.env` and add these lines (replace with your actual credentials):

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=https://salary-calculator-7lhz.onrender.com/api/auth/google/callback
```

**For local development**, you can also add:
```env
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

## Step 2: Add to Render Environment Variables

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Select your service: `salary-calculator-backend`
3. Go to **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Add these three variables:

   - **Key**: `GOOGLE_CLIENT_ID`
     **Value**: (Your Client ID from Google Cloud Console)

   - **Key**: `GOOGLE_CLIENT_SECRET`
     **Value**: (Your Client Secret from Google Cloud Console)

   - **Key**: `GOOGLE_CALLBACK_URL`
     **Value**: `https://salary-calculator-7lhz.onrender.com/api/auth/google/callback`

6. Click **"Save Changes"**
7. Render will automatically redeploy your service

## Step 3: Add Localhost URLs to Google Console (Optional for Local Development)

If you want to test Google login locally:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized JavaScript origins**, click **"Add URI"**:
   - Add: `http://localhost:3000`
5. Under **Authorized redirect URIs**, click **"Add URI"**:
   - Add: `http://localhost:3000/api/auth/google/callback`
6. Click **"Save"**

## Step 4: Test Google Login

1. **Local Testing**:
   - Start your backend: `cd backend && npm run start:dev`
   - Start your frontend: `cd frontend && npm run dev`
   - Click "Continue with Google" button
   - Should redirect to Google login

2. **Production Testing**:
   - Go to your deployed frontend
   - Click "Continue with Google" button
   - Should redirect to Google login

## Troubleshooting

- **"redirect_uri_mismatch"**: Make sure the redirect URI in Google Console exactly matches your callback URL
- **"invalid_client"**: Verify Client ID and Secret are correct in environment variables
- **Not redirecting**: Check that backend is running and environment variables are set

## Security Note

⚠️ **Never commit these credentials to Git!** The `.env` file should be in `.gitignore`.

