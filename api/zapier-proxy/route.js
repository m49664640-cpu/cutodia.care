import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const { email, vaultId, timestamp } = await request.json();
    
    // Validate input
    if (!email || !vaultId) {
      return NextResponse.json(
        { success: false, message: 'Email and Vault ID are required' },
        { status: 400 }
      );
    }

    const zapierResponse = await fetch('https://hooks.zapier.com/hooks/catch/24850708/ui7zb0u/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, vaultId, timestamp })
    });

    if (!zapierResponse.ok) {
      throw new Error('Failed to fetch from Zapier');
    }

    const data = await zapierResponse.json();

    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': 'https://www.custodia.care',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
    
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS method for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://www.custodia.care',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
