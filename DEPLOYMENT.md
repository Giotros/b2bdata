# Deployment Guide - B2B Data Tracker

## Quick Start

Your analytics system is ready to deploy! Follow these steps:

---

## 1. Set Environment Variables

### For Vercel Deployment:

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variable:
   ```
   Name: ADMIN_PASSWORD
   Value: tryhackmenexttimebro123!?
   Environment: Production, Preview, Development
   ```
5. Click **Save**

### For Netlify Deployment:

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add:
   ```
   Key: ADMIN_PASSWORD
   Value: tryhackmenexttimebro123!?
   ```
5. Click **Save**

---

## 2. Deploy Your Code

### Option A: Git Push (Recommended)

```bash
git add .
git commit -m "Add privacy-friendly analytics system"
git push origin main
```

Your hosting provider (Vercel/Netlify) will automatically deploy.

### Option B: Manual Deploy

```bash
# Build locally
npm run build

# Deploy build folder to your hosting
```

---

## 3. Access Admin Dashboard

After deployment:

1. Visit `https://b2bdata.net/admin`
2. Enter password: `tryhackmenexttimebro123!?`
3. View your analytics!

---

## 4. Set Up Email (Recommended)

### Using Cloudflare Email Routing (100% Free):

1. Login to Cloudflare
2. Select `b2bdata.net` domain
3. Go to **Email** → **Email Routing**
4. Click **Get Started**
5. Add destination address (your personal email)
6. Create custom addresses:
   - `info@b2bdata.net` → forwards to your email
   - `support@b2bdata.net` → forwards to your email
   - `hello@b2bdata.net` → forwards to your email

### Sending Emails FROM info@b2bdata.net:

Use Gmail's "Send mail as" feature:

1. Gmail → Settings → Accounts and Import
2. "Send mail as" → Add another email address
3. Enter: `info@b2bdata.net`
4. Use Cloudflare's SMTP settings (provided in Email Routing dashboard)

---

## 5. Update Contact Email in Pages

After setting up email, update these files:

### Privacy Policy (`src/pages/Privacy.jsx`)
Line 128 and 156:
```javascript
contact us at info@b2bdata.net
```

### Cookie Policy (`src/pages/Cookies.jsx`)
Line 160:
```javascript
contact us at info@b2bdata.net
```

---

## 6. Verify Everything Works

### Test Analytics Tracking:

1. Visit your site
2. Accept cookies
3. Create a snapshot
4. Compare snapshots
5. Export CSV
6. Check `/admin` dashboard to see events

### Test Cookie Consent:

1. Open site in incognito/private mode
2. Cookie banner should appear
3. Test "Accept" and "Decline" buttons
4. Verify analytics only track when accepted

---

## 7. Optional: Upgrade to Database Storage

The analytics currently use in-memory storage (resets on server restart). For production, consider upgrading:

### Option A: Vercel KV (Redis) - Easiest

```bash
# Install Vercel KV
npm install @vercel/kv

# In Vercel dashboard, enable KV storage
# Update api/analytics.js to use KV instead of in-memory array
```

### Option B: MongoDB

```bash
npm install mongodb

# Add to .env:
MONGODB_URI=your-mongodb-connection-string
```

### Option C: Supabase (PostgreSQL)

```bash
npm install @supabase/supabase-js

# Add to .env:
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
```

See `ANALYTICS.md` for detailed implementation guides.

---

## 8. Security Checklist

- [x] Admin password set via environment variable
- [x] `.env.local` in `.gitignore`
- [x] Cookie consent implemented
- [x] Privacy policy updated
- [x] No third-party tracking
- [ ] SSL/HTTPS enabled (automatic with Vercel/Netlify)
- [ ] Consider rate limiting for `/api/analytics` endpoint
- [ ] Set up email for contact forms

---

## 9. Post-Deployment Tasks

1. **Test the admin dashboard**: Visit `/admin` and verify you can login
2. **Test analytics**: Create snapshots, comparisons, verify events appear in dashboard
3. **Set up email**: Configure Cloudflare Email Routing
4. **Update contact info**: Replace placeholder emails with `info@b2bdata.net`
5. **Monitor performance**: Check Vercel/Netlify analytics
6. **Backup strategy**: Consider exporting analytics data regularly

---

## 10. Maintenance

### Weekly:
- Check `/admin` dashboard for usage trends
- Review errors in analytics

### Monthly:
- Export analytics data (if using in-memory storage)
- Review and update privacy policy if needed
- Check for security updates: `npm audit`

### As Needed:
- Upgrade to database storage when traffic increases
- Add new analytics events for new features
- Customize dashboard charts

---

## Troubleshooting

### "Invalid credentials" when accessing /admin
- Check environment variable is set correctly in hosting dashboard
- Verify password matches exactly (case-sensitive)
- Try redeploying

### Analytics not showing in dashboard
- Verify cookie consent was accepted
- Check browser console for errors
- Confirm `/api/analytics` endpoint is accessible
- Remember: in-memory storage resets on deployment

### Cookie banner not appearing
- Clear browser localStorage
- Open in incognito/private mode
- Check if consent was already set

---

## File Structure

```
b2bdata/
├── src/
│   ├── utils/
│   │   └── analytics.js           # Client-side analytics tracking
│   ├── pages/
│   │   ├── Admin.jsx               # Admin wrapper
│   │   ├── AdminLogin.jsx          # Login page
│   │   ├── AdminDashboard.jsx      # Dashboard UI
│   │   ├── Privacy.jsx             # Updated privacy policy
│   │   └── Cookies.jsx             # Updated cookie policy
│   ├── App.jsx                     # Main app (with analytics integration)
│   └── main.jsx                    # Routes (includes /admin)
├── api/
│   └── analytics.js                # API endpoint for analytics
├── .env.local                      # Local environment (NOT in git)
├── .env.example                    # Example environment file
├── ANALYTICS.md                    # Analytics documentation
└── DEPLOYMENT.md                   # This file
```

---

## Support

- **Documentation**: See `ANALYTICS.md` for detailed analytics info
- **Issues**: Check browser console and Vercel/Netlify logs
- **Email**: Set up `info@b2bdata.net` for user support

---

**Ready to deploy?** Run `git push` and your analytics system will be live! 🚀
