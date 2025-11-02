// Test Google Sheets connection
require('dotenv').config({ path: '.env.local' });
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

async function testConnection() {
  console.log('🔍 Testing Google Sheets Connection...\n');

  console.log('Environment Variables:');
  console.log('✓ GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID ? '✓ Set' : '✗ Missing');
  console.log('✓ GOOGLE_SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✓ Set' : '✗ Missing');
  console.log('✓ GOOGLE_PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? '✓ Set' : '✗ Missing');
  console.log('');

  try {
    console.log('📊 Connecting to Google Sheet...');

    console.log('🔐 Creating JWT auth...');
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    
    console.log('📖 Loading document info...');
    await doc.loadInfo();
    
    console.log('\n✅ SUCCESS! Connected to spreadsheet:');
    console.log('   Title:', doc.title);
    console.log('   Sheets:', doc.sheetCount);
    console.log('');
    
    console.log('📋 Available sheets:');
    doc.sheetsByIndex.forEach((sheet, index) => {
      console.log(`   ${index}: "${sheet.title}" (${sheet.rowCount} rows, ${sheet.columnCount} cols)`);
    });
    console.log('');
    
    // Try to read first sheet
    const sheet = doc.sheetsByIndex[0];
    console.log(`📄 Reading first sheet: "${sheet.title}"`);
    
    await sheet.loadHeaderRow();
    console.log('   Headers:', sheet.headerValues);
    
    const rows = await sheet.getRows();
    console.log(`   Data rows: ${rows.length}`);
    
    if (rows.length > 0) {
      console.log('\n📝 Sample row (first entry):');
      const firstRow = rows[0];
      sheet.headerValues.forEach(header => {
        console.log(`   ${header}: ${firstRow.get(header)}`);
      });
    }
    
    console.log('\n✅ All tests passed! Your setup is working correctly.');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nFull error:', error);
    
    if (error.message.includes('No permission')) {
      console.error('\n💡 FIX: Share the Google Sheet with this email:');
      console.error('   ', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
      console.error('   Give it "Editor" permissions');
    }
    
    if (error.message.includes('API has not been used')) {
      console.error('\n💡 FIX: Enable Google Sheets API in Google Cloud Console:');
      console.error('    https://console.cloud.google.com/apis/library/sheets.googleapis.com');
    }
  }
}

testConnection();

