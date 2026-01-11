# B2B Data Tracker

> A privacy-friendly tool to track supplier pricing and inventory changes over time

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://b2bdata.net)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8)](https://tailwindcss.com/)

## Overview

B2B Data Tracker helps businesses monitor supplier XML feeds and identify trending products through snapshot comparison. Built with privacy-first principles - all data processing happens client-side.

**Live Demo:** [b2bdata.net](https://b2bdata.net)

## Key Features

- 📊 **XML Feed Parsing** - Smart detection of product fields (SKU, name, price, quantity)
- 🔄 **Snapshot Comparison** - Compare feeds from different dates
- 📈 **Visual Analytics** - Charts and trend analysis
- 🔥 **Hot Seller Detection** - Identify best-selling products
- 💾 **CSV Export** - Export comparison results
- 🔒 **Privacy-First** - Self-hosted analytics, no Google tracking
- 🍪 **GDPR Compliant** - Full cookie consent management

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Backend**: Serverless functions
- **Deployment**: Vercel

## How It Works

1. **Create Snapshot** - Parse supplier XML feed and download as JSON
2. **Wait & Repeat** - Create another snapshot days/weeks later
3. **Compare** - Upload both snapshots to see changes
4. **Analyze** - Identify hot sellers, price changes, stock movements

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Environment Variables

For admin analytics dashboard:

```bash
ADMIN_PASSWORD=your-secure-password
```

## Project Structure

```
b2bdata/
├── src/
│   ├── App.jsx           # Main application
│   ├── utils/            # Analytics utilities
│   └── pages/            # Route pages
├── api/
│   ├── fetch-xml.js      # CORS proxy
│   └── analytics.js      # Analytics API
└── public/
    └── favicon.svg       # Branding
```

## Privacy & Compliance

- ✅ No third-party tracking
- ✅ Client-side data processing
- ✅ GDPR-compliant cookies
- ✅ Self-hosted analytics

## License

MIT License

## Author

**Georgios Trochidis** - Portfolio project showcasing React, serverless architecture, and privacy-focused development.

---

Built with React, TailwindCSS, and modern web technologies