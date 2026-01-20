/**
 * Vercel Serverless Function: Chess Coach API
 * 
 * This proxies requests to Claude API, keeping your API key secure on the server.
 * 
 * Setup in Vercel:
 * 1. Go to Project Settings → Environment Variables
 * 2. Add: ANTHROPIC_API_KEY = sk-ant-api03-...
 * 3. Redeploy
 */

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get API key from environment (server-side only, never exposed to browser)
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ 
      error: 'API key not configured',
      message: 'Add ANTHROPIC_API_KEY to Vercel environment variables'
    });
  }

  try {
    const { prompt, system, maxTokens = 150 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        system: system || 'You are a helpful chess coach.',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Claude API error:', error);
      return res.status(response.status).json({ 
        error: 'Claude API error',
        details: error
      });
    }

    const data = await response.json();
    
    // Extract text from response
    const text = data.content?.find(c => c.type === 'text')?.text || '';
    
    return res.status(200).json({ 
      text,
      usage: data.usage
    });

  } catch (error) {
    console.error('Coach API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
}
