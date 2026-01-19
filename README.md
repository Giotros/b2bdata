# B2B Data Tracker

> Track products that are MOVING in your supplier's catalog. Find hot sellers before your competition does.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://b2bdata.net)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8)](https://tailwindcss.com/)

**🚀 Try it now:** [b2bdata.net](https://b2bdata.net)

---

## 🎯 Try It With Real Data (5 minutes)

Download these sample XML files and see the tool in action:

### 📥 Demo Files
1. **[products_snapshot_jan_10.xml](demo/products_snapshot_jan_10.xml)** - Initial snapshot (18 products)
2. **[products_snapshot_jan_16.xml](demo/products_snapshot_jan_16.xml)** - 6 days later (20 products, multiple changes)

### 🔥 What You'll Discover:
- **9 price drops** (up to 15% off - save money on restocking!)
- **Hot sellers identified** (one product lost 80% inventory in 6 days)
- **Low stock alerts** (3 products almost sold out)
- **New products detected** (2 new items added to catalog)
- **Massive restocks** (Portable SSD: 62 → 185 units)

### 📝 How to Use Demo Files:

**Step 1: Create First Snapshot**
1. Go to [b2bdata.net](https://b2bdata.net)
2. Click **"Create Snapshot"** tab
3. Upload `products_snapshot_jan_10.xml`
4. Click **"Create Snapshot"** button
5. Download the `.json` file (save it!)

**Step 2: Compare Snapshots**
1. Click **"Compare Snapshots"** tab
2. Upload the `.json` file you just downloaded (old snapshot)
3. Upload `products_snapshot_jan_16.xml` (new XML feed)
4. Click **"Compare Snapshots"** button

**Step 3: Analyze Results**
- See price changes highlighted in green/red
- View inventory trends with charts
- Filter by category (Hot Sellers, Price Drops, etc.)
- Export to CSV for deeper analysis

---

## 💡 What It Does

**Track the products that are MOVING** in your supplier's catalog. Compare XML feeds from different dates to discover:

- 📉 **Price changes** - Catch price drops, improve your margins
- 📊 **Hot sellers** - Stock fast-moving products before competitors
- ⚡ **Inventory alerts** - Get notified when stock is low
- 🆕 **New products** - Be first to offer new items
- 📈 **Sales velocity** - Identify trending products

---

## 🎯 2 MASSIVE Business Benefits

✅ **Access to Supplier Data**
Turn raw XML feeds into actionable intelligence. See price changes, inventory levels, and new product launches instantly.

✅ **Usable Data to Fight Competition**
Know what's selling BEFORE your competitors do. Stock hot products early, catch price drops fast, identify market trends.

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite (HMR, blazing fast builds)
- **Styling**: TailwindCSS (utility-first)
- **Charts**: Recharts (data visualization)
- **XML Parsing**: DOMParser API (client-side, no backend needed)
- **Backend**: Vercel Serverless Functions + Vercel KV (Redis)
- **Routing**: React Router DOM v6
- **Analytics**: Self-hosted, GDPR-friendly
- **Deployment**: Vercel

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/Giotros/b2bdata.git
cd b2bdata

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) to see it running.

---

## 📂 Project Structure

```
b2bdata/
├── src/
│   ├── App.jsx              # Main application logic
│   ├── components/          # Reusable components
│   │   └── SEO.jsx          # Dynamic SEO meta tags
│   ├── utils/               # Utilities
│   │   └── analytics.js     # Privacy-first analytics
│   └── pages/               # Route pages
│       ├── Terms.jsx        # Terms of Use
│       ├── Privacy.jsx      # Privacy Policy
│       ├── Cookies.jsx      # Cookie Policy
│       └── Admin.jsx        # Analytics dashboard
├── api/
│   ├── fetch-xml.js         # CORS proxy for XML feeds
│   └── analytics.js         # Analytics API (Vercel KV)
├── demo/
│   ├── products_snapshot_jan_10.xml   # Demo file 1
│   ├── products_snapshot_jan_16.xml   # Demo file 2
│   └── LINKEDIN_DEMO_GUIDE.md         # Demo guide
└── public/
    ├── robots.txt           # SEO robots file
    ├── sitemap.xml          # SEO sitemap
    ├── favicon.svg          # Logo (SVG)
    ├── favicon.ico          # Favicon (ICO)
    └── *.png                # Favicon (PNG variants)
```

---

## 🔒 Privacy & Compliance

- ✅ **No third-party tracking** - No Google Analytics, no Facebook Pixel
- ✅ **Client-side processing** - Your XML data never leaves your browser
- ✅ **GDPR compliant** - Full cookie consent management
- ✅ **Self-hosted analytics** - Privacy-first, Vercel KV (Redis)
- ✅ **Open source** - Review the code yourself

---

## 📸 Screenshots

*Coming soon - Add screenshots of your application here*

---

## 🌟 Features

- 📊 **Smart XML Parsing** - Auto-detects product fields (SKU, name, price, quantity)
- 🔄 **Snapshot Comparison** - Compare feeds from different dates
- 📈 **Visual Analytics** - Interactive charts and trend analysis
- 🔥 **Hot Seller Detection** - Identify best-selling products automatically
- 💾 **CSV Export** - Export comparison results for Excel/Sheets
- 🎨 **Dark Mode UI** - Modern, clean interface with TailwindCSS
- 📱 **Mobile Responsive** - Works on desktop, tablet, and mobile
- ⚡ **Fast Performance** - Client-side processing, instant results

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**Georgios Trochidis**

Portfolio project showcasing:
- React 18 & modern hooks
- Serverless architecture (Vercel)
- Privacy-focused development
- Real-world B2B data processing

---

## 🔗 Links

- **Live Site**: [b2bdata.net](https://b2bdata.net)
- **GitHub**: [github.com/Giotros/b2bdata](https://github.com/Giotros/b2bdata)

---

Built with ❤️ using React, TailwindCSS, and modern web technologies