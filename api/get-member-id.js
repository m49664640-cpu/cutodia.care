/**
 * Circle Headless API - Get Member ID
 * 
 * This endpoint retrieves the logged-in Circle member's ID
 * using Circle's Headless API and session token.
 */

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get the session token from the request
    // Circle passes this in cookies or headers
    const sessionToken = req.cookies?.circle_session || 
                        req.headers.authorization?.replace('Bearer ', '') ||
                        req.query.session_token;

    if (!sessionToken) {
      return res.status(401).json({
        success: false,
        error: 'No session token provided',
        message: 'User must be logged in to Circle'
      });
    }

    // Call Circle's Headless API to get current user info
    const circleApiUrl = 'https://app.circle.so/api/v1/me';
    const circleApiToken = process.env.CIRCLE_API_TOKEN;

    if (!circleApiToken) {
      return res.status(500).json({
        success: false,
        error: 'Circle API token not configured',
        message: 'Server configuration error'
      });
    }

    console.log('Calling Circle API...');
    const response = await fetch(circleApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${circleApiToken}`,
        'Content-Type': 'application/json',
        'Cookie': `circle_session=${sessionToken}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Circle API error:', response.status, errorText);
      
      return res.status(response.status).json({
        success: false,
        error: 'Failed to fetch member data from Circle',
        details: errorText
      });
    }

    const userData = await response.json();
    console.log('Circle API response:', userData);

    // Extract member ID
    const memberId = userData.id || userData.community_member_id || userData.member_id;

    if (!memberId) {
      return res.status(404).json({
        success: false,
        error: 'Member ID not found in Circle response',
        data: userData
      });
    }

    // Return the member ID
    return res.status(200).json({
      success: true,
      member_id: memberId,
      email: userData.email,
      name: userData.name
    });

  } catch (error) {
    console.error('Error in get-member-id:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

