// worker.js - Telegram Bot Checker
export default {
  async fetch(request, env, ctx) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle OPTIONS request for CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // API routes
      if (path === '/check' && request.method === 'POST') {
        return await handleCheck(request);
      } else if (path === '/status' && request.method === 'GET') {
        return handleStatus();
      } else if (path === '/verify' && request.method === 'POST') {
        return await handleVerify(request);
      } else if (path === '/user/info' && request.method === 'POST') {
        return await handleUserInfo(request);
      } else {
        return new Response('Welcome to Telegram Check API\n\nEndpoints:\n- POST /check\n- GET /status\n- POST /verify\n- POST /user/info', {
          headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }
};

// Handle user check
async function handleCheck(request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const data = await request.json();
    const { userId, username, chatId } = data;

    if (!userId && !username) {
      return new Response(JSON.stringify({
        success: false,
        error: 'User ID or username is required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Simulate Telegram API check
    const isMember = await checkTelegramMembership(userId, username, chatId);
    const userInfo = await getUserTelegramInfo(userId, username);

    return new Response(JSON.stringify({
      success: true,
      data: {
        isMember,
        userInfo,
        timestamp: new Date().toISOString(),
        checkId: generateCheckId()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Handle verification
async function handleVerify(request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const data = await request.json();
    const { token, userId } = data;

    if (!token) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Verification token is required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const isValid = await validateVerificationToken(token, userId);

    return new Response(JSON.stringify({
      success: true,
      data: {
        isValid,
        verifiedAt: new Date().toISOString(),
        userId
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Handle user info
async function handleUserInfo(request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const data = await request.json();
    const { userId, username } = data;

    if (!userId && !username) {
      return new Response(JSON.stringify({
        success: false,
        error: 'User ID or username is required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userInfo = await getUserTelegramInfo(userId, username);

    return new Response(JSON.stringify({
      success: true,
      data: {
        userInfo,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Handle status
function handleStatus() {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  return new Response(JSON.stringify({
    success: true,
    data: {
      status: 'online',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime ? process.uptime() : 'unknown'
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Simulated Telegram API functions
async function checkTelegramMembership(userId, username, chatId) {
  // This is a simulated function
  // In production, you would use the real Telegram Bot API
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Mock logic - 70% chance of being a member
  const random = Math.random();
  return random > 0.3;
}

async function getUserTelegramInfo(userId, username) {
  // Simulate user info retrieval
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const mockUsers = {
    '123456789': {
      id: 123456789,
      username: username || 'test_user',
      firstName: 'John',
      lastName: 'Doe',
      isBot: false,
      languageCode: 'en'
    },
    '987654321': {
      id: 987654321,
      username: 'premium_user',
      firstName: 'Jane',
      lastName: 'Smith',
      isBot: false,
      languageCode: 'en',
      isPremium: true
    }
  };

  if (userId && mockUsers[userId]) {
    return mockUsers[userId];
  }

  return {
    id: userId || Math.floor(Math.random() * 1000000000),
    username: username || 'unknown',
    firstName: 'User',
    lastName: 'Unknown',
    isBot: false,
    languageCode: 'en',
    isMock: true
  };
}

async function validateVerificationToken(token, userId) {
  // Simulate token validation
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Mock validation logic
  if (!token || token.length < 10) {
    return false;
  }

  // Simple hash validation simulation
  const expectedHash = `verify_${userId || 'unknown'}_${Math.floor(Date.now() / 3600000)}`;
  const tokenHash = await simpleHash(token);
  const expectedTokenHash = await simpleHash(expectedHash);

  return tokenHash === expectedTokenHash;
}

// Helper functions
function generateCheckId() {
  return 'chk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

async function simpleHash(str) {
  // Simple hash function for demo
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}
