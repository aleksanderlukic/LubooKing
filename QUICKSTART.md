# 🚀 Quick Start Guide

Get your Luccifadez booking platform running in under 10 minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Supabase account created
- [ ] Resend account created (optional, for emails)

## Step 1: Install Dependencies (2 min)

```bash
npm install
```

## Step 2: Configure Environment (3 min)

```bash
# Copy the example env file
cp .env.local.example .env.local
```

Edit `.env.local` and add:

```env
# Required
APP_MODE=single
SINGLE_BARBER_SLUG=luccifadez
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional (for emails)
RESEND_API_KEY=re_your_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Get Supabase Credentials

1. Go to https://supabase.com
2. Create new project (wait ~2 min for setup)
3. Go to Settings → API
4. Copy URL and keys

## Step 3: Set Up Database (3 min)

### Option A: Manual (Recommended for first time)

1. Go to your Supabase project
2. Click SQL Editor
3. Create new query
4. Copy & paste `supabase/migrations/20260115000001_initial_schema.sql`
5. Click Run
6. Repeat for:
   - `20260115000002_rls_policies.sql`
   - `20260115000003_storage_setup.sql`

### Option B: Using CLI

```bash
# Install Supabase CLI globally
npm install -g supabase

# Link to your project
npx supabase link --project-ref your-project-ref

# Run migrations
npm run db:push
```

## Step 4: Start Development Server (1 min)

```bash
npm run dev
```

Open http://localhost:3000

## Step 5: Create Your First Barber (2 min)

1. Click **Dashboard** in header
2. Click **Create Account**
3. Enter email & password
4. Fill in barber profile:
   - Slug: `luccifadez`
   - Shop name: Your business name
   - Address & city

## Step 6: Add Data Manually in Supabase

### Add Services

1. Go to Supabase → Table Editor → services
2. Click Insert → Insert row
3. Fill in:
   - `barber_id`: Your barber ID (from barbers table)
   - `title`: "Classic Haircut"
   - `duration_minutes`: 30
   - `price`: 25.00
   - `active`: true
4. Click Save
5. Repeat for more services

### Set Availability

1. Go to Supabase → Table Editor → availability
2. Click Insert → Insert row
3. Fill in:
   - `barber_id`: Your barber ID
   - `date`: "2026-01-20" (tomorrow)
   - `start_time`: "09:00"
   - `end_time`: "17:00"
4. Click Save
5. Repeat for more dates

## Step 7: Test Booking (2 min)

1. Visit http://localhost:3000
2. Click on your barber profile
3. Click "Book an Appointment"
4. Go through booking flow:
   - Select service
   - Select date
   - Select time
   - Enter customer details
   - Choose payment method
   - Confirm booking

## 🎉 Done!

Your booking platform is now running!

## Next Steps

### Enable Emails

1. Go to https://resend.com
2. Sign up & verify email
3. Get API key
4. Add to `.env.local`:
   ```env
   RESEND_API_KEY=re_your_key
   RESEND_FROM_EMAIL=onboarding@resend.dev
   ```
5. Restart server
6. Test booking to receive emails

### Deploy to Production

See [SETUP_GUIDE.md](./SETUP_GUIDE.md#production-deployment) for Vercel deployment.

## Common Issues

### "Cannot connect to database"

- Verify Supabase URL and keys
- Check if project is active in Supabase

### "No time slots available"

- Make sure you added availability for future dates
- Check that date is in YYYY-MM-DD format
- Verify barber_id matches

### "Emails not sending"

- Check Resend API key is correct
- Use default sender for testing: `onboarding@resend.dev`
- Check server logs for errors

### "Cannot create booking"

- Make sure service exists
- Verify time slot is available
- Check browser console for errors

## Support

Need help? Check:

1. [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Full feature list
2. [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup
3. [README.md](./README.md) - Complete documentation

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run linter
npm run db:push      # Apply database migrations
npm run db:reset     # Reset database (careful!)
```

---

**Time to first booking: ~10 minutes** ⚡

Happy booking! 💈✨
