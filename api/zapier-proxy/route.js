import { NextResponse } from 'next/server';

// Helper function to create response with CORS headers
const createResponse = (data, status = 200) => {
  const response = NextResponse.json(data, { status });
  
  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', 'https://www.custodia.care');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  
  return response;
};

export const runtime = 'edge';

export async function POST(request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return createResponse({}, 200);
  }

  try {
    const { email, vaultId, timestamp } = await request.json();
    
    // Validate input
    if (!email || !vaultId) {
      return createResponse(
        { success: false, message: 'Email and Vault ID are required' },
        400
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
    return createResponse({ ...data, success: true });
    
  } catch (error) {
    console.error('Proxy error:', error);
    return createResponse(
      { success: false, message: 'Internal server error' },
      500
    );
  }
}

// Handle OPTIONS method for CORS preflight
export async function OPTIONS() {
  return createResponse({}, 204);
}
