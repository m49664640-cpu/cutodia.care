const { GoogleSpreadsheet } = require('google-spreadsheet');

export default async function handler(req, res) {
  // Enable CORS for custodia.care
  res.setHeader('Access-Control-Allow-Origin', 'https://www.custodia.care');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  const { email, vaultId } = req.body;

  // Validate inputs
  if (!email || !vaultId) {
    return res.status(400).json({
      success: false,
      message: 'Email and Vault ID are required'
    });
  }

  try {
    // Connect to Google Sheet
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

    // Authenticate using service account
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });

    // Load the document
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]; // First sheet (Vault Database)
    const rows = await sheet.getRows();

    // Search for matching record
    const cleanEmail = email.toLowerCase().trim();
    const cleanVaultId = vaultId.trim();

    const match = rows.find(row => {
      const rowEmail = row.get('Email')?.toLowerCase().trim();
      const rowMemberId = row.get('Member ID')?.trim();
      return rowEmail === cleanEmail && rowMemberId === cleanVaultId;
    });

    if (match) {
      const dropboxLink = match.get('Dropbox Link');

      if (dropboxLink) {
        // Optional: Log successful access
        await logAccess(doc, email, vaultId, 'Success', req.headers['x-forwarded-for']);

        return res.status(200).json({
          success: true,
          dropboxLink: dropboxLink
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
    console.error('Vault lookup error:', error);
    return res.status(500).json({
      success: false,
      message: 'System error. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Optional: Log access attempts for security auditing
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
    // Don't fail the request if logging fails
  }
}
