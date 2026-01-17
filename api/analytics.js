// Analytics collection and retrieval API
// Uses Vercel KV (Redis) for persistent storage

import { kv } from '@vercel/kv';

// Admin password from environment variable (required for production)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// KV storage key
const ANALYTICS_KEY = 'b2b-analytics-events';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST: Store analytics events
  if (req.method === 'POST') {
    try {
      const { events } = req.body;

      if (!events || !Array.isArray(events)) {
        return res.status(400).json({ error: 'Invalid events data' });
      }

      // Get existing events from KV
      let analyticsData = await kv.get(ANALYTICS_KEY) || [];

      // Add new events
      analyticsData.push(...events);

      // Keep only last 10,000 events to prevent storage bloat
      if (analyticsData.length > 10000) {
        analyticsData = analyticsData.slice(-10000);
      }

      // Save back to KV
      await kv.set(ANALYTICS_KEY, analyticsData);

      return res.status(200).json({ success: true, stored: events.length });
    } catch (error) {
      console.error('Error storing analytics:', error);
      return res.status(500).json({ error: 'Failed to store analytics' });
    }
  }

  // GET: Retrieve analytics data (admin only)
  if (req.method === 'GET') {
    try {
      // Check authorization
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get all events from KV
      const analyticsData = await kv.get(ANALYTICS_KEY) || [];

      // Get query parameters for filtering
      const { startDate, endDate, eventType, limit = 1000 } = req.query;

      let filteredData = [...analyticsData];

      // Filter by date range
      if (startDate) {
        filteredData = filteredData.filter(
          event => new Date(event.timestamp) >= new Date(startDate)
        );
      }
      if (endDate) {
        filteredData = filteredData.filter(
          event => new Date(event.timestamp) <= new Date(endDate)
        );
      }

      // Filter by event type
      if (eventType) {
        filteredData = filteredData.filter(event => event.event === eventType);
      }

      // Limit results
      const limitedData = filteredData.slice(-parseInt(limit));

      // Calculate statistics
      const stats = calculateStats(filteredData);

      return res.status(200).json({
        events: limitedData,
        stats,
        total: filteredData.length,
      });
    } catch (error) {
      console.error('Error retrieving analytics:', error);
      return res.status(500).json({ error: 'Failed to retrieve analytics' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function calculateStats(events) {
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const eventsByType = {};
  const eventsByDay = {};
  const uniqueSessions = new Set();
  const browsers = {};
  const languages = {};
  const referrers = {};

  let totalSnapshots = 0;
  let totalComparisons = 0;
  let totalExports = 0;
  let totalErrors = 0;
  let cookieConsents = { accepted: 0, declined: 0 };

  events.forEach(event => {
    const timestamp = new Date(event.timestamp);
    const dateKey = timestamp.toISOString().split('T')[0];

    // Count by type
    eventsByType[event.event] = (eventsByType[event.event] || 0) + 1;

    // Count by day
    eventsByDay[dateKey] = (eventsByDay[dateKey] || 0) + 1;

    // Unique sessions
    if (event.sessionId) {
      uniqueSessions.add(event.sessionId);
    }

    // Browser detection
    if (event.properties?.userAgent) {
      const ua = event.properties.userAgent;
      let browser = 'Other';
      if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
      else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
      else if (ua.includes('Firefox')) browser = 'Firefox';
      else if (ua.includes('Edg')) browser = 'Edge';
      browsers[browser] = (browsers[browser] || 0) + 1;
    }

    // Language detection
    if (event.properties?.language) {
      const lang = event.properties.language.split('-')[0];
      languages[lang] = (languages[lang] || 0) + 1;
    }

    // Referrer tracking
    if (event.properties?.referrer) {
      const ref = event.properties.referrer === 'direct' ? 'Direct' : new URL(event.properties.referrer).hostname;
      referrers[ref] = (referrers[ref] || 0) + 1;
    }

    // Feature-specific counts
    if (event.event === 'snapshot_created') totalSnapshots++;
    if (event.event === 'comparison_made') totalComparisons++;
    if (event.event === 'csv_export') totalExports++;
    if (event.event === 'error') totalErrors++;
    if (event.event === 'cookie_consent') {
      if (event.properties.accepted) cookieConsents.accepted++;
      else cookieConsents.declined++;
    }
  });

  // Time-based stats
  const events24h = events.filter(e => new Date(e.timestamp) >= last24h).length;
  const events7d = events.filter(e => new Date(e.timestamp) >= last7d).length;
  const events30d = events.filter(e => new Date(e.timestamp) >= last30d).length;

  return {
    total: {
      events: events.length,
      sessions: uniqueSessions.size,
      snapshots: totalSnapshots,
      comparisons: totalComparisons,
      exports: totalExports,
      errors: totalErrors,
    },
    timeRanges: {
      last24h: events24h,
      last7d: events7d,
      last30d: events30d,
    },
    eventsByType,
    eventsByDay,
    browsers,
    languages,
    referrers,
    cookieConsents,
  };
}
