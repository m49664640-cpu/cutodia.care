# 🚀 Deployment Checklist

## ⚠️ CRITICAL: Fix Environment Variables First!

Before deploying, you MUST fix these environment variables in Vercel:

### ❌ Current (WRONG):
```
GOOGLE_SHEET_ID = 1WzRi4hBuuOOf2sKHW1digYLast-w_ui3IgY5Kgxt1H8...
GOOGLE_CLIENT_EMAIL = lazarusmagwaro@favorable-valor-457510-a6.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY = (correct)
```

### ✅ Should Be (CORRECT):
```
GOOGLE_SHEET_ID = 1c2aDEi83e6hSd6annuT-QZ4JtvpvYE5isEo2irPkGwI
GOOGLE_SERVICE_ACCOUNT_EMAIL = lazarusmagwaro@favorable-valor-457510-a6.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY = (keep as is - it's correct)
```

## 📝 Step-by-Step Fix

### 1. Go to Vercel Dashboard
https://vercel.com/dashboard

### 2. Select Your Project
Click on your `custodia-care` or `cutodia-care` project

### 3. Go to Settings → Environment Variables

### 4. Delete Wrong Variables
- Delete `GOOGLE_CLIENT_EMAIL` (wrong name)
- Delete the variable with Sheet ID `1WzRi4hBuuOOf2sKHW1digYLast-w_ui3IgY5Kgxt1H8...` (wrong ID)

### 5. Add Correct Variables

#### Variable 1: GOOGLE_SHEET_ID
- **Name:** `GOOGLE_SHEET_ID`
- **Value:** `1c2aDEi83e6hSd6annuT-QZ4JtvpvYE5isEo2irPkGwI`
- **Environments:** Production, Preview, Development (check all 3)

#### Variable 2: GOOGLE_SERVICE_ACCOUNT_EMAIL
- **Name:** `GOOGLE_SERVICE_ACCOUNT_EMAIL` (NOT `GOOGLE_CLIENT_EMAIL`)
- **Value:** `lazarusmagwaro@favorable-valor-457510-a6.iam.gserviceaccount.com`
- **Environments:** Production, Preview, Development (check all 3)

#### Variable 3: GOOGLE_PRIVATE_KEY
- **Name:** `GOOGLE_PRIVATE_KEY`
- **Value:** Keep the existing one (it's correct)
- **Environments:** Production, Preview, Development (check all 3)

### 6. Deploy
After fixing the environment variables, deploy:

```bash
vercel --prod
```

Or redeploy from the Vercel dashboard:
1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**
4. Check **Use existing Build Cache** (optional)
5. Click **Redeploy**

## ✅ What's Fixed in This Update

1. ✅ Logo and favicon added
2. ✅ Vercel configuration simplified
3. ✅ API authentication updated to JWT
4. ✅ Static file serving configured
5. ⚠️ Environment variables need to be fixed (see above)

## 🧪 After Deployment - Test

1. Visit: https://www.custodia.care
2. You should see:
   - ✅ Your logo at the top
   - ✅ The vault access form
   - ✅ Favicon in browser tab

3. Test the form with real credentials from your Google Sheet

## 🔍 Troubleshooting

### Still getting 404 on homepage?
- Clear your browser cache
- Try incognito/private mode
- Wait 1-2 minutes for Vercel CDN to update

### Still getting 500 on API?
- Check environment variables are EXACTLY as shown above
- Verify all 3 variables are set
- Make sure you selected all 3 environments (Production, Preview, Development)

### Logo not showing?
- Check browser console for errors
- Verify files deployed: https://www.custodia.care/logo.png
- Clear browser cache

## 📊 Current Status

- ✅ Code ready
- ✅ Logo added
- ✅ API fixed
- ❌ Environment variables need correction
- ⏳ Deployment pending

## 🎯 Next Action

**RIGHT NOW:** Go fix the environment variables in Vercel dashboard, then deploy!

