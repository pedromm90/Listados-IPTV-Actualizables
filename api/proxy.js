// Vercel Serverless Function: HTTPS Proxy for HTTP streams and M3U lists
// This solves Mixed Content (HTTPS→HTTP) and CORS blocking issues

export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing "url" query parameter' });
  }

  // Set CORS headers to allow browser requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; IPTV-Proxy/1.0)',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Upstream responded with HTTP ${response.status}`,
      });
    }

    // Forward relevant headers from upstream
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    // Allow caching for stream segments (short TTL)
    res.setHeader('Cache-Control', 'public, max-age=2');

    // Get response as buffer and send it
    const buffer = Buffer.from(await response.arrayBuffer());
    return res.status(200).send(buffer);
  } catch (err) {
    console.error('Proxy fetch error:', err.message);
    return res.status(502).json({
      error: 'Could not reach the upstream server',
      details: err.message,
    });
  }
}
