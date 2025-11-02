// File: api/vault-lookup.js
// Place this file in your Vercel project at: /api/vault-lookup.js

const { GoogleSpreadsheet } = require('google-spreadsheet');

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { email, vaultId } = req.body;

    // Validate inputs
    if (!email || !vaultId) {
      return res.status(400).json({
        success: false,
        message: 'Email and Vault ID are required'
      });
    }

    // Connect to Google Sheet
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    
    // Authenticate using service account
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });

    // Load the document
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Vault Database'];
    const rows = await sheet.getRows();

    // Search for matching record
    const cleanEmail = email.toLowerCase().trim();
    const cleanVaultId = vaultId.trim();

    for (let row of rows) {
      const rowEmail = String(row['Email (lowercase)']).toLowerCase().trim();
      const rowMemberId = String(row['Member ID (Circle community_member_id)']).trim();

      if (rowEmail === cleanEmail && rowMemberId === cleanVaultId) {
        // Match found - log and return
        await logAccess(doc, email, vaultId, 'Success', req.headers['x-forwarded-for']);
        
        return res.status(200).json({
          success: true,
          dropboxLink: row['Dropbox Link (share link to member root folder)'],
          firstName: row['First Name'],
          lastName: row['Last Name']
        });
      }
    }

    // No match found
    await logAccess(doc, email, vaultId, 'Failed', req.headers['x-forwarded-for']);
    
    return res.status(401).json({
      success: false,
      message: 'Invalid email or Vault ID. Please check your credentials.'
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: 'System error. Please try again later.'
    });
  }
}

// Log access attempts
async function logAccess(doc, email, vaultId, status, ipAddress) {
  try {
    let logSheet = doc.sheetsByTitle['Access Log'];
    
    // Create log sheet if it doesn't exist
    if (!logSheet) {
      logSheet = await doc.addSheet({
        title: 'Access Log',
        headerValues: ['Timestamp', 'Email', 'Vault ID', 'Status', 'IP Address']
      });
    }

    await logSheet.addRow({
      'Timestamp': new Date().toISOString(),
      'Email': email,
      'Vault ID': vaultId,
      'Status': status,
      'IP Address': ipAddress || 'Unknown'
    });
  } catch (error) {
    console.error('Logging error:', error);
  }
}