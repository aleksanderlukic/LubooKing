# Luccifadez Setup Guide

Complete step-by-step guide to set up and deploy the Luccifadez barber booking platform.

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Supabase Configuration](#supabase-configuration)
3. [Environment Variables](#environment-variables)
4. [Database Setup](#database-setup)
5. [Email Setup (Resend)](#email-setup-resend)
6. [Stripe Setup (Optional)](#stripe-setup-optional)
7. [First Barber Account](#first-barber-account)
8. [Production Deployment](#production-deployment)

---

## Initial Setup

### 1. Install Dependencies

```bash
cd luccifadez
npm install
```

### 2. Choose Your Mode

Decide if you want:

- **Single Mode**: One barber only (Luccifadez brand)
- **Marketplace Mode**: Multiple barbers can join

---

## Supabase Configuration

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and project name
4. Set database password (save this!)
5. Choose region closest to your users
6. Wait for project to be ready

### 2. Get Your Credentials

In your Supabase project:

1. Go to **Settings** → **API**
2. Copy:
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - anon/public key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - service_role key (`SUPABASE_SERVICE_ROLE_KEY`) - Keep this secret!

### 3. Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Go to **Authentication** → **URL Configuration**
4. Add redirect URLs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)
5. Disable email confirmations if you want simpler signup:
   - Go to **Authentication** → **Settings**
   - Uncheck "Enable email confirmations"

---

## Environment Variables

### 1. Create Environment File

```bash
cp .env.local.example .env.local
```

### 2. Fill in Values

Edit `.env.local`:

```env
# App Configuration
APP_MODE=single                    # or "marketplace"
SINGLE_BARBER_SLUG=luccifadez     # your brand name (lowercase, no spaces)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Email (Resend) - Set up later
RESEND_API_KEY=re_123456789
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Stripe - Optional for now
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Database Setup

### Method 1: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize (if needed)
npx supabase init

# Link to your project
npx supabase link --project-ref your-project-ref

# Run migrations
npx supabase db push
```

### Method 2: Manual SQL Execution

1. Go to your Supabase project
2. Click on **SQL Editor**
3. Create a new query
4. Copy and paste each migration file in order:
   - `supabase/migrations/20260115000001_initial_schema.sql`
   - `supabase/migrations/20260115000002_rls_policies.sql`
   - `supabase/migrations/20260115000003_storage_setup.sql`
5. Run each one

### Verify Database Setup

In Supabase SQL Editor, run:

```sql
-- Should show all tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- Should show all storage buckets
SELECT * FROM storage.buckets;
```

You should see tables: barbers, services, availability, bookings, payments, notification_subscriptions, gallery_images

---

## Email Setup (Resend)

### 1. Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for free account
3. Verify your email

### 2. Add Domain (Production)

For production, add your domain:

1. Go to **Domains** → **Add Domain**
2. Follow DNS configuration steps
3. Wait for verification

For development, use the default `onboarding@resend.dev` sender.

### 3. Get API Key

1. Go to **API Keys**
2. Create new API key
3. Copy the key
4. Add to `.env.local`:
   ```env
   RESEND_API_KEY=re_your_key_here
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   ```

### 4. Test Email

Start your dev server and try creating a test booking to verify emails work.

---

## Stripe Setup (Optional)

Only needed if you want online payments.

### 1. Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Sign up
3. Complete business verification

### 2. Get API Keys

1. Go to **Developers** → **API Keys**
2. Copy:
   - Publishable key
   - Secret key
3. Add to `.env.local`

### 3. Set Up Webhooks

1. Go to **Developers** → **Webhooks**
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy webhook secret

### 4. Implement Payment (TODO)

The code has placeholders for Stripe. Uncomment and implement in:

- `app/api/bookings/route.ts`
- Create `app/api/webhooks/stripe/route.ts`

---

## First Barber Account

### 1. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

### 2. Create Barber Account

1. Click **Dashboard** in header
2. Click **Create Account**
3. Enter email and password
4. Check email for confirmation (if enabled)

### 3. Create Barber Profile

After signing up:

1. You'll be prompted to create a profile
2. Fill in:
   - Slug: `luccifadez` (or your brand name)
   - Shop name: Your business name
   - Address and city
   - Enable home visits (if applicable)

### 4. Add Services

1. Go to **Dashboard** → **Manage Services**
2. Click **Add Service**
3. Fill in:
   - Title: e.g., "Classic Haircut"
   - Duration: 30 minutes
   - Price: 25.00
   - Active: Yes
4. Repeat for all services

### 5. Set Availability

1. Go to **Dashboard** → **Set Availability**
2. Select a date
3. Add time range: e.g., 9:00 AM - 5:00 PM
4. Save

### 6. Upload Images

1. Go to **Dashboard** → **Gallery**
2. Upload portfolio images
3. Go to **Dashboard** → **Profile Settings**
4. Upload logo

### 7. Test Booking

1. Visit your public profile: http://localhost:3000/barbers/luccifadez
2. Try making a test booking
3. Check email for confirmation

---

## Production Deployment

### Deploy to Vercel

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click **New Project**
   - Import your GitHub repository
   - Configure:
     - Framework: Next.js
     - Build command: `npm run build`
     - Output directory: `.next`

3. **Add Environment Variables**

   In Vercel project settings, add all variables from `.env.local`:
   - APP_MODE
   - SINGLE_BARBER_SLUG
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - RESEND_API_KEY
   - RESEND_FROM_EMAIL
   - NEXT_PUBLIC_APP_URL (use your Vercel domain)
   - Stripe keys (if using)

4. **Deploy**
   - Click **Deploy**
   - Wait for build to complete
   - Visit your live site!

5. **Update Supabase URLs**
   - Go to Supabase **Authentication** → **URL Configuration**
   - Add production redirect URL: `https://yourdomain.vercel.app/auth/callback`

6. **Configure Custom Domain** (Optional)
   - In Vercel, go to **Settings** → **Domains**
   - Add your custom domain
   - Follow DNS configuration steps
   - Update `NEXT_PUBLIC_APP_URL` environment variable

---

## Post-Deployment Checklist

- [ ] Test login/signup
- [ ] Create barber profile
- [ ] Add services
- [ ] Set availability
- [ ] Upload images
- [ ] Test booking flow
- [ ] Verify emails arrive
- [ ] Test booking cancellation
- [ ] Test notification subscription
- [ ] Check mobile responsiveness
- [ ] Test dark mode

---

## Common Issues

### Database Connection Error

- Verify Supabase URL and keys
- Check if project is active in Supabase dashboard

### Emails Not Sending

- Verify Resend API key
- Check sender email is verified
- Look at Vercel logs for errors

### Images Not Uploading

- Check storage policies in Supabase
- Verify file size limits
- Check browser console for errors

### Build Errors on Vercel

- Check Node.js version (18+)
- Verify all dependencies are in package.json
- Check build logs for specific errors

---

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check Supabase logs
3. Check browser console
4. Review this documentation
5. Check environment variables

---

## Next Steps

Once deployed:

1. Share your booking link with customers
2. Monitor bookings in dashboard
3. Respond to bookings promptly
4. Keep services and availability updated
5. Collect customer feedback
6. Consider adding reviews/ratings

Enjoy your new booking platform! 🎉
