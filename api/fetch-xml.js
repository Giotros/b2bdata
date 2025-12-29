export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    // Handle preflight request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
    // Get URL from query parameter
    const { url } = req.query;
  
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }
  
    try {
      // Fetch the XML
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
  
      const xmlData = await response.text();
      
      // Return the XML
      res.setHeader('Content-Type', 'text/xml');
      res.status(200).send(xmlData);
      
    } catch (error) {
      console.error('Fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch XML', details: error.message });
    }
  }