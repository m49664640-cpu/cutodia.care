#!/bin/bash

# Test script for Vault Lookup API
# Usage: ./test-api.sh [email] [vaultId]

# Default test values (replace with real values from your sheet)
EMAIL="${1:-test@example.com}"
VAULT_ID="${2:-12345}"

# API endpoint (change to production URL when deployed)
API_URL="${3:-http://localhost:3000/api/vault-lookup}"

echo "🔍 Testing Vault Lookup API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📧 Email:    $EMAIL"
echo "🔑 Vault ID: $VAULT_ID"
echo "🌐 API URL:  $API_URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Make the API request
echo "📤 Sending request..."
echo ""

response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"vaultId\":\"$VAULT_ID\"}")

# Extract HTTP status code and body
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

echo "📥 Response:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "HTTP Status: $http_code"
echo ""
echo "$body" | jq '.' 2>/dev/null || echo "$body"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if successful
if [ "$http_code" = "200" ]; then
  echo "✅ Success! Credentials are valid."
elif [ "$http_code" = "401" ]; then
  echo "❌ Invalid credentials."
elif [ "$http_code" = "500" ]; then
  echo "⚠️  Server error. Check your environment variables and Google Sheets setup."
else
  echo "⚠️  Unexpected response code: $http_code"
fi

