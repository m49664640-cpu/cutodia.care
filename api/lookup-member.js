/**
 * Member ID Lookup by Email
 * 
 * This endpoint looks up a member's ID from the Google Sheet
 * using their email address.
 */

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { email } = req.method === 'POST' ? req.body : req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Create JWT auth for service account
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Connect to Google Sheet
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();

    // Get the Vault Database sheet
    const sheet = doc.sheetsByTitle['Vault Database'];
    if (!sheet) {
      return res.status(500).json({
        success: false,
        error: 'Vault Database sheet not found'
      });
    }

    // Get all rows
    const rows = await sheet.getRows();

    // Clean the input email
    const cleanEmail = email.toLowerCase().trim();

    // Find matching row
    const match = rows.find(row => {
      const rowEmail = row.get('Email')?.toLowerCase().trim();
      return rowEmail === cleanEmail;
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        error: 'No member found with that email address'
      });
    }

    // Return the member ID
    const memberId = match.get('Member ID');

    return res.status(200).json({
      success: true,
      member_id: memberId,
      email: match.get('Email'),
      first_name: match.get('First Name'),
      last_name: match.get('Last Name')
    });

  } catch (error) {
    console.error('Error in lookup-member:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

