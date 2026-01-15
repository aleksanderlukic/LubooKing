# Luccifadez - Premium Barber Booking Platform

A production-ready full-stack web application built with Next.js, Tailwind CSS, and Supabase for barber booking management. Supports both single barber mode and marketplace mode.

## 🚀 Features

### Public Features

- 🏠 **Home Page** - Browse barbers (marketplace) or direct to barber profile (single mode)
- 💈 **Barber Profiles** - View services, gallery, and book appointments
- 📅 **Smart Booking Flow** - Service → Date → Time → Details → Payment → Confirmation
- 🌓 **Theme Toggle** - Light/Dark mode support
- 🔔 **Notifications** - Subscribe to get notified when new slots become available
- ❌ **Cancellation** - Cancel bookings up to 24 hours before appointment

### Barber Dashboard

- 📊 **Dashboard** - View stats and quick actions
- 📅 **Booking Management** - View and update booking statuses
- 💼 **Service Management** - CRUD operations for services
- ⏰ **Availability Management** - Set working hours and dates
- 🖼️ **Gallery Management** - Upload and manage portfolio images
- ⚙️ **Profile Settings** - Update shop information and settings

### Technical Features

- 🔒 **Authentication** - Supabase Auth with email/password
- 🗄️ **Database** - PostgreSQL with Row Level Security
- 📦 **Storage** - Supabase Storage for images
- 💳 **Payments** - Stripe integration ready
- 📧 **Email Notifications** - Resend integration
- 🚀 **Double Booking Prevention** - Database-level exclusion constraints
- ⏱️ **24-Hour Cancellation Rule** - Enforced in backend

## 📚 Documentation

- [Setup Guide](./SETUP_GUIDE.md) - Complete setup instructions
- Database schema in `supabase/migrations/`
- API documentation below

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Email**: Resend
- **Payments**: Stripe (ready to integrate)
- **Validation**: Zod
- **Date Handling**: date-fns

## 🚀 Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your credentials
   ```

3. **Run migrations** (see SETUP_GUIDE.md)

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open** http://localhost:3000

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.

## 📁 Project Structure

```
luccifadez/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── auth/              # Auth callback
│   ├── barbers/           # Barber pages
│   ├── dashboard/         # Dashboard pages
│   └── login/             # Login page
├── components/            # React components
│   ├── booking/           # Booking flow
│   ├── layout/            # Layout components
│   ├── notifications/     # Notification components
│   ├── providers/         # Context providers
│   └── ui/                # UI components
├── lib/                   # Utilities and helpers
│   ├── supabase/          # Supabase client setup
│   ├── utils/             # Helper functions
│   ├── config.ts          # App configuration
│   └── validations.ts     # Zod schemas
├── supabase/              # Supabase files
│   └── migrations/        # Database migrations
└── public/                # Static files
```

## 🔧 Configuration

### Mode Selection

**Single Barber Mode** (for Luccifadez):

```env
APP_MODE=single
SINGLE_BARBER_SLUG=luccifadez
```

**Marketplace Mode**:

```env
APP_MODE=marketplace
```

## 📊 Database Schema

### Main Tables

- **barbers** - Barber profiles and shop information
- **services** - Services offered by barbers
- **availability** - Working hours and dates
- **bookings** - Customer bookings
- **payments** - Payment records
- **notification_subscriptions** - Email notification subscribers
- **gallery_images** - Portfolio images

## 🌐 API Routes

### Public Endpoints

- `POST /api/bookings` - Create a booking
- `GET /api/bookings/[id]` - Get booking details
- `POST /api/bookings/[id]/cancel` - Cancel a booking
- `GET /api/availability/dates` - Get available dates
- `GET /api/availability/slots` - Get available time slots
- `POST /api/notifications/subscribe` - Subscribe to notifications

## 📧 Email Notifications

The app sends emails for:

1. **Booking Confirmation** - Includes cancellation link
2. **Booking Cancellation** - Confirmation of cancellation
3. **Slot Available** - Notifies subscribers of new openings

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed deployment instructions.

## 🔐 Security

- ✅ Row Level Security (RLS) on all tables
- ✅ Server-side validation with Zod
- ✅ Secure authentication with Supabase Auth
- ✅ Cancellation tokens for booking management
- ✅ Service role key kept server-side only

## 📝 License

This project is private and proprietary.

## 🙏 Credits

Built for Luccifadez using Next.js, Supabase, and modern web technologies.
