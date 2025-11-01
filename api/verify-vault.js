import { google } from 'googleapis';

// Initialize Google Sheets API
const sheets = google.sheets('v4');

// Configuration
const SPREADSHEET_ID = '1c2aDEi83e6hSd6annuT-QZ4JtvpvYE5isEo2irPkGwI';
const SHEET_NAME = 'Vault Database';
const RANGE = 'A:C'; // Columns A (Email), B (Member ID), C (Dropbox Link)

async function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  return auth;
}

export default async function handler(req, res) {
  // Enable CORS for custodia.care
  res.setHeader('Access-Control-Allow-Origin', 'https://www.custodia.care');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ status: 'error', message: 'Method not allowed' });
    return;
  }

  try {
    const { email, vaultId } = req.body;

    // Validate input
    if (!email || !vaultId) {
      res.status(400).json({
        status: 'error',
        message: 'Email and Vault ID are required'
      });
      return;
    }

    // Get auth client
    const auth = await getAuthClient();

    // Get spreadsheet data
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!${RANGE}`,
    });

    // Find matching row
    const rows = response.data.values || [];
    const matchingRow = rows.find(row => 
      row[0]?.toLowerCase() === email.toLowerCase() && 
      row[1] === vaultId
    );

    if (matchingRow && matchingRow[2]) {
      // Return success with Dropbox link
      res.status(200).json({
        status: 'success',
        redirectUrl: matchingRow[2]
      });
    } else {
      // No match found
      res.status(400).json({
        status: 'error',
        message: 'Invalid Vault ID or Email'
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while verifying your credentials',
      details: error.message || error.toString(),
      stack: error.stack
    });
  }
}