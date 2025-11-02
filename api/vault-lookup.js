const { GoogleSpreadsheet } = require('google-spreadsheet');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { email, vaultId } = req.body;

  if (!email || !vaultId) {
    res.status(400).json({ error: 'Missing email or vaultId' });
    return;
  }

  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const match = rows.find(
      row => row.Email?.toLowerCase() === email.toLowerCase() && row.MemberID === vaultId
    );

    if (match && match.DropboxLink) {
      res.status(200).json({ success: true, dropboxLink: match.DropboxLink });
    } else {
      res.status(404).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', details: error.message });
  }
}
