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

    // Find matching row in Vault Database
    let match = rows.find(row => {
      const rowEmail = row.get('Email')?.toLowerCase().trim();
      return rowEmail === cleanEmail;
    });

    let memberId = null;
    let firstName = null;
    let lastName = null;
    let source = 'Vault Database';

    if (match) {
      // Found in Vault Database
      memberId = match.get('Member ID');
      firstName = match.get('First Name');
      lastName = match.get('Last Name');
    } else {
      // Not found in Vault Database, try Successor Tracking sheet
      const successorSheet = doc.sheetsByTitle['Successor Tracking'];
      
      if (successorSheet) {
        const successorRows = await successorSheet.getRows();
        
        // Find matching row in Successor Tracking
        const successorMatch = successorRows.find(row => {
          const rowEmail = row.get('Email')?.toLowerCase().trim();
          return rowEmail === cleanEmail;
        });

        if (successorMatch) {
          // Found in Successor Tracking sheet
          memberId = successorMatch.get('Successor member ID');
          firstName = successorMatch.get('First Name');
          lastName = successorMatch.get('Last Name');
          source = 'Successor Tracking';
        }
      }
    }

    // If still not found, return 404
    if (!memberId) {
      return res.status(404).json({
        success: false,
        error: 'No member found with that email address'
      });
    }

    // Return the member ID
    return res.status(200).json({
      success: true,
      member_id: memberId,
      email: cleanEmail,
      first_name: firstName,
      last_name: lastName,
      source: source
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

