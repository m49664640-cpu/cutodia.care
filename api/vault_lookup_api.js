// Google Apps Script - Deploy as Web App
// This creates an API endpoint that your vault page can call

function doPost(e) {
  try {
    // Parse incoming request
    const data = JSON.parse(e.postData.contents);
    const email = data.email.toLowerCase().trim();
    const vaultId = data.vaultId.trim();
    
    // Open the spreadsheet
    const ss = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID'); // Replace with your Sheet ID
    const sheet = ss.getSheetByName('Vault Database');
    
    // Get all data
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // Search for matching record (skip header row)
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const sheetEmail = String(row[0]).toLowerCase().trim(); // Column A: Email
      const sheetMemberId = String(row[1]).trim(); // Column B: Member ID
      const dropboxLink = row[2]; // Column C: Dropbox Link
      
      // Check for match
      if (sheetEmail === email && sheetMemberId === vaultId) {
        // Log successful access (optional)
        logAccess(sheet, email, vaultId, 'Success');
        
        return ContentService
          .createTextOutput(JSON.stringify({
            success: true,
            dropboxLink: dropboxLink,
            firstName: row[3],
            lastName: row[4]
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // No match found
    logAccess(sheet, email, vaultId, 'Failed');
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Invalid email or Vault ID. Please check your credentials.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'System error. Please try again later.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Log access attempts for security auditing
function logAccess(sheet, email, vaultId, status) {
  const ss = sheet.getParent();
  let logSheet = ss.getSheetByName('Access Log');
  
  // Create log sheet if it doesn't exist
  if (!logSheet) {
    logSheet = ss.insertSheet('Access Log');
    logSheet.appendRow(['Timestamp', 'Email', 'Vault ID', 'Status', 'IP Address']);
  }
  
  const timestamp = new Date();
  logSheet.appendRow([timestamp, email, vaultId, status, '']);
}

// For testing - allows GET requests
function doGet(e) {
  return ContentService
    .createTextOutput('Vault Lookup API is running. Use POST requests only.')
    .setMimeType(ContentService.MimeType.TEXT);
}