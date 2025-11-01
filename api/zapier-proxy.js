// Using native fetch available in Vercel's Node.js environment
export default async function handler(req, res) {
  // Set CORS headers for all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  };

  // Handle preflight requests for CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    // Forward the request to Zapier
    const response = await fetch('https://hooks.zapier.com/hooks/catch/24850708/ui7zb0u/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body || {}),
    });

    const data = await response.json();
    
    // Return the response from Zapier with CORS headers
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('Error in zapier-proxy:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
}

export const config = {
  runtime: 'edge', // Use Edge Runtime for better performance
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: '5mb',
  },
};