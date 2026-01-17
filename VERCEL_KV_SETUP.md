# Vercel KV Setup Instructions

## What Changed
Analytics data is now persisted using Vercel KV (Redis) instead of in-memory storage. This means your analytics data will survive deployments and server restarts.

## Setup Steps (One-time)

### 1. Create Vercel KV Database
1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (`b2bdata`)
3. Click on the **Storage** tab
4. Click **Create Database**
5. Select **KV** (Redis)
6. Choose a name (e.g., `b2bdata-analytics`)
7. Select the region closest to your users
8. Click **Create**

### 2. Connect to Your Project
The KV database will automatically be connected to your project. Vercel will add the required environment variables:
- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

### 3. Deploy
Push your changes to trigger a new deployment:
```bash
git add .
git commit -m "Add persistent analytics with Vercel KV"
git push
```

## Verification
1. Visit your site and trigger some analytics events (create snapshot, compare, etc.)
2. Go to Admin Dashboard
3. Refresh the page - data should persist
4. Deploy again - data should still be there

## Free Tier Limits
Vercel KV free tier includes:
- 256 MB storage
- 3,000 commands per day
- 10,000 events at ~1KB each = ~10MB (well under limit)
- Daily limit: 3,000 commands / 2 (read+write per event) = 1,500 events/day

This is more than enough for your use case.

## Local Development
The code includes fallback to empty array if KV is not available, so local development will work but won't persist data. To test persistence locally, you can:
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel env pull` to get production environment variables
3. Run: `vercel dev` instead of `npm run dev`

## Troubleshooting

### Error: "KV is not defined"
- Make sure you created the KV database in Vercel dashboard
- Redeploy after creating the database

### Error: "Unauthorized" in admin
- Make sure `ADMIN_PASSWORD` environment variable is set in Vercel
- Check that you're using the correct password

### Data not persisting
- Verify KV database is created and connected
- Check Vercel deployment logs for errors
- Ensure environment variables are set

## Code Changes
- Updated `api/analytics.js` to use `@vercel/kv` instead of in-memory array
- Added `@vercel/kv` package to dependencies
- No frontend changes required - API interface remains the same
