// Debug script to check both sheets for a specific email
require('dotenv').config({ path: '.env.local' });
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

async function debugLookup() {
  const testEmail = 'iammagwaro@gmail.com';
  console.log(`🔍 Searching for: ${testEmail}\n`);

  try {
    // Create JWT auth
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    console.log(`📊 Spreadsheet: ${doc.title}\n`);

    // Check Vault Database sheet
    console.log('=== VAULT DATABASE SHEET ===');
    const vaultSheet = doc.sheetsByTitle['Vault Database'];
    if (vaultSheet) {
      await vaultSheet.loadHeaderRow();
      console.log('✓ Found sheet');
      console.log('📋 Headers:', vaultSheet.headerValues);
      
      const rows = await vaultSheet.getRows();
      console.log(`📝 Total rows: ${rows.length}`);
      
      const match = rows.find(row => {
        const rowEmail = row.get('Email')?.toLowerCase().trim();
        return rowEmail === testEmail.toLowerCase();
      });
      
      if (match) {
        console.log('✅ FOUND in Vault Database!');
        console.log('   Member ID:', match.get('Member ID'));
        console.log('   Email:', match.get('Email'));
        console.log('   First Name:', match.get('First Name'));
        console.log('   Last Name:', match.get('Last Name'));
      } else {
        console.log('❌ NOT FOUND in Vault Database');
        console.log('\n📧 Sample emails from this sheet (first 5):');
        rows.slice(0, 5).forEach((row, i) => {
          console.log(`   ${i + 1}. ${row.get('Email')}`);
        });
      }
    } else {
      console.log('❌ Sheet "Vault Database" not found');
    }

    console.log('\n=== SUCCESSOR TRACKING SHEET ===');
    const successorSheet = doc.sheetsByTitle['Successor Tracking'];
    if (successorSheet) {
      await successorSheet.loadHeaderRow();
      console.log('✓ Found sheet');
      console.log('📋 Headers:', successorSheet.headerValues);
      console.log('📋 Column Count:', successorSheet.columnCount);
      
      // Load cells to see all headers
      await successorSheet.loadCells('A1:Z1');
      console.log('\n🔍 Checking all header cells (showing all, even empty):');
      for (let i = 0; i < Math.min(20, successorSheet.columnCount); i++) {
        const cell = successorSheet.getCell(0, i);
        console.log(`   Column ${i} (${String.fromCharCode(65 + i)}): "${cell.value || '(empty)'}"`);
      }
      
      const rows = await successorSheet.getRows();
      console.log(`📝 Total rows: ${rows.length}`);
      
      const match = rows.find(row => {
        const rowEmail = row.get('Successor Email')?.toLowerCase().trim();
        return rowEmail === testEmail.toLowerCase();
      });
      
      if (match) {
        console.log('✅ FOUND in Successor Tracking!');
        console.log('   Successor_Member_ID:', match.get('Successor_Member_ID'));
        console.log('   Successor Email:', match.get('Successor Email'));
        console.log('   Successor Name:', match.get('Successor Name'));
      } else {
        console.log('❌ NOT FOUND in Successor Tracking');
        console.log('\n📧 Sample emails from this sheet (first 5):');
        rows.slice(0, 5).forEach((row, i) => {
          console.log(`   ${i + 1}. ${row.get('Successor Email')}`);
        });
        
        // Show all columns from first row to debug
        if (rows.length > 0) {
          console.log('\n🔍 All data from first row:');
          const firstRow = rows[0];
          console.log('   Raw data:', firstRow._rawData);
        }
      }
    } else {
      console.log('❌ Sheet "Successor Tracking" not found');
      console.log('\n📋 Available sheets:');
      doc.sheetsByIndex.forEach(sheet => {
        console.log(`   - "${sheet.title}"`);
      });
    }

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error(error);
  }
}

debugLookup();
