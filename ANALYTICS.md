# Analytics System Documentation

## Overview

B2B Data Tracker now includes a **privacy-friendly, self-hosted analytics system** that tracks user behavior without relying on third-party services like Google Analytics. This system is fully GDPR-compliant and respects user privacy.

---

## Features

### Privacy-First Design
- **No third-party tracking**: All analytics data is processed on your own servers
- **Anonymous sessions**: Uses session IDs instead of cookies or persistent identifiers
- **User consent required**: Analytics only track users who accept cookies
- **No personal data**: We don't collect names, emails, or any identifying information

### Tracked Events
- Page views
- Snapshot creation (with source type and product count)
- Comparison operations (with change statistics)
- CSV exports
- Cookie consent decisions
- Errors and issues

### Admin Dashboard
A comprehensive dashboard at `/admin` provides:
- Real-time analytics visualization
- Usage statistics and trends
- Browser and language distribution
- Referrer tracking
- Event-type breakdowns
- Daily activity charts

---

## Architecture

### Client-Side (`src/utils/analytics.js`)
The analytics utility automatically:
1. Generates anonymous session IDs (stored in `sessionStorage`)
2. Queues events for batch sending
3. Automatically flushes events every 5 seconds or when queue reaches 10 events
4. Sends events to `/api/analytics` endpoint
5. Includes context like browser info, screen resolution, language, etc.

### Server-Side (`api/analytics.js`)
The API endpoint:
- **POST**: Accepts analytics events from the client
- **GET**: Returns analytics data (admin only, requires password)
- Stores events in-memory (limited to last 10,000 events)
- Calculates real-time statistics

### Admin Interface (`src/pages/Admin.jsx`)
Features:
- Password-protected access
- Auto-refresh every 30 seconds
- Visual charts and graphs (using Recharts)
- Exportable data

---

## Setup Instructions

### 1. Environment Variables (Production)

For production deployment, set an admin password:

```bash
# In your Vercel/Netlify dashboard or .env file
ADMIN_PASSWORD=your-secure-password-here
```

**Default password (development)**: `admin123`

⚠️ **Important**: Change the default password before deploying to production!

### 2. Storage Configuration

The current implementation uses **in-memory storage** which means:
- Analytics reset when the server restarts
- Limited to 10,000 most recent events
- Suitable for small-scale tracking

#### Upgrading to Persistent Storage

For production use, replace in-memory storage with a database:

**Option A: Vercel KV (Redis)**
```javascript
import { kv } from '@vercel/kv';

// Store event
await kv.lpush('analytics:events', JSON.stringify(event));
await kv.ltrim('analytics:events', 0, 9999); // Keep last 10k

// Retrieve events
const events = await kv.lrange('analytics:events', 0, -1);
```

**Option B: MongoDB**
```javascript
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db('analytics');
const collection = db.collection('events');

// Store event
await collection.insertOne(event);

// Retrieve events
const events = await collection.find({}).toArray();
```

**Option C: Supabase (PostgreSQL)**
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Store event
await supabase.from('analytics_events').insert(event);

// Retrieve events
const { data } = await supabase.from('analytics_events').select('*');
```

---

## Usage

### Accessing the Admin Dashboard

1. Navigate to `/admin` in your browser
2. Enter the admin password (default: `admin123`)
3. View real-time analytics

### Tracked Metrics

The dashboard shows:

#### Overview Cards
- Total events
- Unique sessions
- Snapshots created
- Comparisons made
- CSV exports
- Errors logged
- Cookie consent rate

#### Charts
- Daily event trends (last 14 days)
- Event type distribution (pie chart)
- Browser usage (bar chart)
- Top referrers
- Language distribution

#### Time Ranges
- Last 24 hours
- Last 7 days
- Last 30 days
- All time

---

## API Reference

### POST /api/analytics

Store analytics events.

**Request Body:**
```json
{
  "events": [
    {
      "event": "snapshot_created",
      "timestamp": "2025-01-12T10:30:00.000Z",
      "sessionId": "1234567890-abc123",
      "properties": {
        "source": "file",
        "productCount": 150,
        "userAgent": "Mozilla/5.0...",
        "language": "en-US",
        "screenResolution": "1920x1080",
        "viewport": "1536x864",
        "referrer": "direct",
        "path": "/"
      }
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "stored": 1
}
```

### GET /api/analytics

Retrieve analytics data (admin only).

**Headers:**
```
Authorization: Bearer your-admin-password
```

**Query Parameters:**
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string
- `eventType` (optional): Filter by event type
- `limit` (optional): Max events to return (default: 1000)

**Response:**
```json
{
  "events": [...],
  "stats": {
    "total": { ... },
    "timeRanges": { ... },
    "eventsByType": { ... },
    "eventsByDay": { ... },
    "browsers": { ... },
    "languages": { ... },
    "referrers": { ... },
    "cookieConsents": { ... }
  },
  "total": 5000
}
```

---

## Integration

Analytics are automatically tracked in `App.jsx`:

```javascript
import analytics from './utils/analytics';

// Track page view
useEffect(() => {
  if (cookieConsent) {
    analytics.trackPageView();
  }
}, [cookieConsent]);

// Track snapshot creation
analytics.trackSnapshotCreated('file', 150);

// Track comparison
analytics.trackComparisonMade(45, 5, 2);

// Track CSV export
analytics.trackCsvExport(100);

// Track errors
analytics.trackError('snapshot_creation', 'XML parsing failed');
```

---

## Privacy & Compliance

### GDPR Compliance
- ✅ User consent required (cookie banner)
- ✅ No personal data collected
- ✅ Right to decline tracking
- ✅ Clear privacy policy
- ✅ Data minimization
- ✅ No third-party sharing

### Cookie Policy
- **Essential cookies**: Cookie consent preference (localStorage)
- **Analytics cookies**: Session ID (sessionStorage - expires on browser close)

### User Rights
Users can:
- Decline analytics tracking
- Clear their session ID (by closing browser)
- Use all features without accepting analytics

---

## Customization

### Adding Custom Events

1. Add tracking method to `src/utils/analytics.js`:
```javascript
trackCustomEvent(eventData) {
  this.track('custom_event', eventData);
}
```

2. Call it in your component:
```javascript
analytics.trackCustomEvent({ action: 'button_click', label: 'export_pdf' });
```

3. View in admin dashboard

### Modifying Dashboard

Edit `src/pages/AdminDashboard.jsx` to:
- Add new charts
- Change metrics displayed
- Customize time ranges
- Add filtering options

---

## Security Notes

1. **Change default password** before production deployment
2. Use environment variables for sensitive data
3. Implement rate limiting on analytics endpoint (optional)
4. Consider adding IP-based authentication for extra security
5. Use HTTPS in production (automatic with Vercel/Netlify)

---

## Troubleshooting

### Analytics not tracking
1. Check if user accepted cookies (cookie banner)
2. Verify `/api/analytics` endpoint is accessible
3. Check browser console for errors
4. Ensure `cookieConsent` state is true

### Dashboard shows no data
1. Verify admin password is correct
2. Check if any events have been tracked
3. Restart server (in-memory storage resets)
4. Check network tab for API errors

### Events not persisting
- **In-memory storage**: Events reset on server restart
- **Solution**: Implement database storage (see Setup Instructions)

---

## Future Improvements

- [ ] Add database persistence (Vercel KV, MongoDB, Supabase)
- [ ] Implement data export (CSV, JSON)
- [ ] Add date range picker in dashboard
- [ ] Create email reports (daily/weekly summaries)
- [ ] Add A/B testing support
- [ ] Implement funnel analysis
- [ ] Add user flow visualization
- [ ] Support for custom dashboards

---

## License

This analytics system is part of B2B Data Tracker and follows the same license.

---

## Support

For questions or issues:
- Check this documentation
- Review code comments in source files
- Contact: b2bdata.net

---

**Last Updated**: January 12, 2025
