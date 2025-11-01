import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, vaultId } = await request.json();
    
    // Call Zapier webhook
    const zapierResponse = await fetch('https://hooks.zapier.com/hooks/catch/24850708/ui7zb0u/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, vaultId })
    });
    
    const zapierData = await zapierResponse.json();
    
    // If Zapier found a match, it will return the dropboxUrl in the response
    if (zapierData.dropboxUrl) {
      return NextResponse.json(
        { dropboxUrl: zapierData.dropboxUrl },
        { status: 200 }
      );
    }
    
    // If no match found in Zapier
    return NextResponse.json(
      { message: 'Invalid Vault ID or Email' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
