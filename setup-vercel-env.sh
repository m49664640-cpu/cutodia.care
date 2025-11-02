#!/bin/bash

# Script to set up Vercel environment variables
# Run this after logging in with: vercel login

echo "🔧 Setting up Vercel Environment Variables"
echo "=========================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ Error: .env.local file not found!"
  echo "Please create .env.local with your credentials first."
  exit 1
fi

# Source the .env.local file
source .env.local

echo "📋 Found environment variables in .env.local"
echo ""

# Set environment variables in Vercel
echo "🚀 Adding GOOGLE_SHEET_ID to Vercel..."
echo "$GOOGLE_SHEET_ID" | vercel env add GOOGLE_SHEET_ID production

echo "🚀 Adding GOOGLE_SERVICE_ACCOUNT_EMAIL to Vercel..."
echo "$GOOGLE_SERVICE_ACCOUNT_EMAIL" | vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL production

echo "🚀 Adding GOOGLE_PRIVATE_KEY to Vercel..."
echo "$GOOGLE_PRIVATE_KEY" | vercel env add GOOGLE_PRIVATE_KEY production

echo ""
echo "✅ Environment variables added to Vercel!"
echo ""
echo "📝 Next steps:"
echo "1. Run: vercel --prod"
echo "2. Test your deployment at: https://www.custodia.care"

