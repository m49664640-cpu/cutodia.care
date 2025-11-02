# Custodia.care Vault Access System

Secure vault access portal that allows Custodia.care members to access their personal document storage via Dropbox.

## 🏗️ Architecture

- **Frontend**: `index.html` - Clean web form for email and Vault ID entry
- **Backend**: Vercel serverless function (`/api/vault-lookup.js`)
- **Database**: Google Sheets (Vault Database)
- **Authentication**: Google Service Account

## 🚀 Setup Instructions

### 1. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Google Sheets API**
4. Create a **Service Account**:
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Give it a name (e.g., "vault-access")
   - Click "Create and Continue"
   - Skip role assignment (click "Continue")
   - Click "Done"
5. Create a **Key** for the service account:
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose JSON format
   - Download the key file (keep it secure!)

### 2. Google Sheets Setup

1. Open your Vault Database spreadsheet
2. Click "Share" button
3. Add the service account email (from step 1) as an Editor
4. Note your Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

### 3. Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```

3. Edit `.env.local` with your values:
   ```env
   GOOGLE_SHEET_ID=your_spreadsheet_id
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

4. Install Vercel CLI (if not already installed):
   ```bash
   npm install -g vercel
   ```

5. Run locally:
   ```bash
   vercel dev
   ```

6. Test at: `http://localhost:3000`

### 4. Deploy to Vercel

1. Login to Vercel:
   ```bash
   vercel login
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add environment variables in Vercel Dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add:
     - `GOOGLE_SHEET_ID`
     - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
     - `GOOGLE_PRIVATE_KEY`

4. Redeploy to apply environment variables:
   ```bash
   vercel --prod
   ```

## 📊 Google Sheets Structure

Your "Vault Database" sheet should have these columns:

| Email | Member ID | Dropbox Link |
|-------|-----------|--------------|
| user@example.com | 12345 | https://dropbox.com/... |

Optional: An "Access Log" sheet will be automatically created to track access attempts.

## 🔒 Security Features

- ✅ CORS protection (only allows requests from custodia.care)
- ✅ Dual verification (email + Vault ID must both match)
- ✅ Service account authentication
- ✅ Access logging for audit trail
- ✅ Environment variable-based secrets

## 🧪 Testing

Test the API endpoint:

```bash
curl -X POST http://localhost:3000/api/vault-lookup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","vaultId":"12345"}'
```

Expected response (success):
```json
{
  "success": true,
  "dropboxLink": "https://www.dropbox.com/..."
}
```

Expected response (failure):
```json
{
  "success": false,
  "message": "Invalid email or Vault ID. Please check your credentials."
}
```

## 📁 Project Structure

```
.
├── api/
│   └── vault-lookup.js      # Vercel serverless function
├── index.html               # Frontend form
├── package.json             # Dependencies
├── vercel.json              # Vercel configuration
├── .env.local.example       # Environment variables template
└── README.md                # This file
```

## 🛠️ Troubleshooting

### "Invalid credentials" error
- Verify the service account email is added to the Google Sheet
- Check that the private key is properly formatted with `\n` characters
- Ensure the spreadsheet ID is correct

### CORS errors
- Update the `Access-Control-Allow-Origin` in `api/vault-lookup.js` if using a different domain
- Make sure you're accessing from `https://www.custodia.care`

### "System error" message
- Check Vercel function logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure Google Sheets API is enabled in Google Cloud Console

## 📝 License

Proprietary - Custodia.care

