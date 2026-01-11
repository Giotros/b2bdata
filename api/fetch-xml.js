export default async function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  console.log('🔄 Fetching XML from:', url);

  try {
    // Fetch with timeout and proper headers
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/xml, text/xml, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache'
      }
    });
    
    clearTimeout(timeoutId);

    console.log('📡 Response status:', response.status);
    console.log('📄 Content-Type:', response.headers.get('content-type'));

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    const data = await response.text();

    console.log('✅ Data length:', data.length);
    console.log('📝 First 200 chars:', data.substring(0, 200));

    // Check if response is actually XML
    if (!data.trim().startsWith('<')) {
      console.error('❌ Response is not XML!');
      throw new Error('Response is not XML (starts with: ' + data.substring(0, 50) + '...)');
    }

    // Return XML with correct content type
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.status(200).send(data);

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.name === 'AbortError') {
      return res.status(504).json({ 
        error: 'Request timeout. The XML feed took too long to respond (30s limit).' 
      });
    }

    res.status(500).json({ 
      error: error.message || 'Failed to fetch XML',
      url: url
    });
  }
}
