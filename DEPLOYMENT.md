# Vercel Deployment Guide

## ⚠️ Critical: Environment Variables Must Be Set in Vercel

Your deployment is failing because the environment variables are not configured in Vercel.

## 🔧 Step-by-Step Deployment

### 1. Add Environment Variables to Vercel

Go to your Vercel project dashboard:
1. Visit: https://vercel.com/dashboard
2. Select your project: `custodia-care` or `cutodia-care`
3. Go to **Settings** → **Environment Variables**
4. Add these three variables:

#### Variable 1: GOOGLE_SHEET_ID
```
1c2aDEi83e6hSd6annuT-QZ4JtvpvYE5isEo2irPkGwI
```

#### Variable 2: GOOGLE_SERVICE_ACCOUNT_EMAIL
```
lazarusmagwaro@favorable-valor-457510-a6.iam.gserviceaccount.com
```

#### Variable 3: GOOGLE_PRIVATE_KEY
**IMPORTANT:** Copy the ENTIRE key including the BEGIN and END lines:
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCjwPeXEIcXiLwl
bhq+gGsD/Nwzil0kAN+XPVHoVk3hWdm1XT1KY/BibE7EN+VBBIXpvrAVy74MYbCT
eGbNdhKLCVcEN3ratC67h8p+gUipKYwIgqM4Icp5qZettVoo2JLZK/CLbe5T4AwP
99LXn4rw2RsLHoCyyHPsfupPjpeyZbAnwqg8LPMdpDYv3u/gSjv88FKO2xY+Diik
wa65pU2bwHG/991z1XqeLKpJyI6es0ZUHNRcHNecGn6aU3QF3m5pGYyEonhtla3d
9IcgmCzLc7EvpA+5l1KVwa4jaajl22xoEzfc77Urgy9Fx9pRbJOjs0JHSzbLx5NY
1z/RrD6zAgMBAAECggEAAfuQo94Z3KGVsZhTL5JLeWli2ybmOMzf6CtgZgFBgSR+
29DMsK1kGDT6gSqyFmbxHiLma+UjIHBAXJC9Iei3kcJjsNPhI2vCExgyTfTPxeiQ
XvwB8OiL1IxGn15OQKdao9GB4JZMp+xTCRB1l5HBc2gViT1tznxZ1ve0a5Es6gaH
LTF3s2v92p8D1mRx5eUqSGRAm9BheG+SvUudg/brIW3HBN89eRDPm7DgVBp5DGUg
+aEPqKynb9WCo843/uNJkYS6l0obo1eTkW9lMl9R0iKJjN+159ZneHpIzkavBMdV
5Vi23o80nIeqkGcoVI3wO7xUgBTJJlAzuAiwaFZ8RQKBgQDl5GAZnQW4FfWvzetj
yjTsUkVO0GhM8nG7vGh7cmgUjkjSRJ1D2sfyMifeQ9edgJWoP0TKPFpt+5H9wjei
AHS2dUYKW2ZFgKRazw+EmrOBn/r2sWXhiUpTLtPeh3mvdNFiBMQhxi/mIUuwATxk
xdyrTIF52HAQNXVeeJIw4kyNVwKBgQC2WcK7gHEu5TQafuVrZExsCf3EU9NR0sZ4
kHsi9cxvn/ePJCmckGlsg7yGBVwqGlku2uvy+wp7iVJPtC6YuLL3u5gcXj3/KTQi
0pOBY14SvvSOKU8wbnd7+NUzR5NJdrttDSIsGaDxfAMzwIVqWKmf2yBJBrfpGIvy
BG7bTpTkBQKBgFwqHKToILzWgPMEWRReoq0DpqmcP9RpdlNPi4vCKBvllyhFPc9Q
TMy6cuVWyYBpZpZXFxsE6zQgoTzcujUGfcQQbA4G6o9+rWWCkbQV2VVkb9aq9C9h
PRzwLxyNr6k56h+jzYXE0LswKgnb1PyJnphGSboxnWvCItXG/MUAVLRtAoGBAJOB
rKqsTeJXenxsZf0nV0KWGnd0L58i13WzukgfeU5aopFh+V8y2nTzY88uCs3sHnRu
lysos+QWw0TCRmc4EV2gnH1mJtR/ajM5ECU8Ul7rpTxSYkKVOYZJVX1zystEhnzC
gQAXgz+Ux6pXdBUAv8YWJdms25xtRNdzipFQ0dRZAoGAJrFOo4qh3PSP4xnIuClD
1rzesCIDQr+OB8DUhwYLJyOq1c2qELsrr4rUUe1cAsH+X+8qrZhIGyzi9yQOmLzG
/TBboZulWpFklAM0FJ8LlkmaqAB9/5bQXftZYljb7Vl3Nzxc/rSRTHYLMzd2tlfm
qwrIYXbmcliEVuhBlZpnEC4=
-----END PRIVATE KEY-----
```

**Note:** Make sure to select **Production**, **Preview**, and **Development** for all three variables.

### 2. Redeploy

After adding the environment variables, you need to redeploy:

**Option A: Via Vercel Dashboard**
1. Go to your project's **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**

**Option B: Via Command Line**
```bash
vercel --prod
```

### 3. Verify Deployment

Once deployed, test the API:
```bash
curl -X POST https://www.custodia.care/api/vault-lookup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","vaultId":"12345"}'
```

## 🔍 Troubleshooting

### Still getting 500 errors?
1. Check Vercel function logs: https://vercel.com/dashboard → Your Project → Logs
2. Verify all 3 environment variables are set
3. Make sure the private key includes the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines
4. Ensure there are no extra spaces or quotes around the values

### Getting "Invalid grant: account not found"?
- The service account email or private key is incorrect
- Double-check you copied the entire private key
- Verify the service account exists in Google Cloud Console

### Getting "No permission" errors?
- Share the Google Sheet with: `lazarusmagwaro@favorable-valor-457510-a6.iam.gserviceaccount.com`
- Give it **Editor** permissions

## 📊 Current Status

✅ Code is deployed
✅ API endpoint exists at `/api/vault-lookup`
❌ Environment variables need to be configured in Vercel
❌ Need to redeploy after adding environment variables

## 🎯 Next Steps

1. Add the 3 environment variables in Vercel dashboard
2. Redeploy the project
3. Test the vault lookup form at https://www.custodia.care

