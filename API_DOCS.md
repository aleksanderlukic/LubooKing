# API Documentation

Complete API reference for the Luccifadez booking platform.

## Base URL

- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

## Authentication

Most public endpoints don't require authentication. Dashboard endpoints require authentication via Supabase Auth.

### Headers

```
Content-Type: application/json
```

For authenticated requests:

```
Authorization: Bearer <supabase_jwt_token>
```

---

## Public Endpoints

### Get Available Dates

Get list of dates that have availability for a specific barber and service.

**Endpoint:** `GET /api/availability/dates`

**Query Parameters:**

- `barberId` (required) - UUID of the barber
- `serviceId` (required) - UUID of the service

**Response:**

```json
{
  "dates": ["2026-01-20", "2026-01-21", "2026-01-22"]
}
```

**Example:**

```bash
curl "http://localhost:3000/api/availability/dates?barberId=123&serviceId=456"
```

---

### Get Time Slots

Get available time slots for a specific date, barber, and service.

**Endpoint:** `GET /api/availability/slots`

**Query Parameters:**

- `barberId` (required) - UUID of the barber
- `serviceId` (required) - UUID of the service
- `date` (required) - Date in YYYY-MM-DD format

**Response:**

```json
{
  "slots": [
    {
      "start": "2026-01-20T09:00:00Z",
      "end": "2026-01-20T09:30:00Z",
      "available": true
    },
    {
      "start": "2026-01-20T09:30:00Z",
      "end": "2026-01-20T10:00:00Z",
      "available": false
    }
  ]
}
```

**Example:**

```bash
curl "http://localhost:3000/api/availability/slots?barberId=123&serviceId=456&date=2026-01-20"
```

---

### Create Booking

Create a new booking.

**Endpoint:** `POST /api/bookings`

**Request Body:**

```json
{
  "barberId": "uuid",
  "serviceId": "uuid",
  "startsAt": "2026-01-20T09:00:00Z",
  "endsAt": "2026-01-20T09:30:00Z",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "1234567890",
  "locationType": "in-shop",
  "customerAddress": "",
  "paymentMethod": "on-site"
}
```

**Field Validation:**

- `locationType`: Must be "in-shop" or "home-visit"
- `paymentMethod`: Must be "on-site" or "online"
- `customerEmail`: Must be valid email
- `customerPhone`: Minimum 10 digits
- `customerName`: Minimum 2 characters
- `customerAddress`: Required if locationType is "home-visit"

**Response:**

```json
{
  "bookingId": "uuid",
  "paymentUrl": "https://checkout.stripe.com/..." // Only if paymentMethod is "online"
}
```

**Error Response:**

```json
{
  "error": "Time slot may no longer be available."
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "barberId": "123",
    "serviceId": "456",
    "startsAt": "2026-01-20T09:00:00Z",
    "endsAt": "2026-01-20T09:30:00Z",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "1234567890",
    "locationType": "in-shop",
    "paymentMethod": "on-site"
  }'
```

---

### Get Booking Details

Get details of a specific booking.

**Endpoint:** `GET /api/bookings/:id`

**URL Parameters:**

- `id` (required) - UUID of the booking

**Response:**

```json
{
  "id": "uuid",
  "barber_id": "uuid",
  "service_id": "uuid",
  "starts_at": "2026-01-20T09:00:00Z",
  "ends_at": "2026-01-20T09:30:00Z",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "1234567890",
  "location_type": "in-shop",
  "customer_address": null,
  "payment_method": "on-site",
  "payment_status": "pending",
  "status": "booked",
  "cancelled_at": null,
  "created_at": "2026-01-19T10:00:00Z",
  "services": {
    "title": "Classic Haircut",
    "price": 25.0
  },
  "barbers": {
    "shop_name": "Luccifadez"
  }
}
```

**Example:**

```bash
curl http://localhost:3000/api/bookings/123
```

---

### Cancel Booking

Cancel an existing booking (must be at least 24 hours before appointment).

**Endpoint:** `POST /api/bookings/:id/cancel`

**URL Parameters:**

- `id` (required) - UUID of the booking

**Request Body:**

```json
{
  "token": "cancellation_token"
}
```

**Response:**

```json
{
  "success": true
}
```

**Error Responses:**

24-hour rule violation:

```json
{
  "error": "Bookings can only be cancelled at least 24 hours before the appointment"
}
```

Invalid token:

```json
{
  "error": "Booking not found or invalid cancellation token"
}
```

Already cancelled:

```json
{
  "error": "Booking is already cancelled"
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/bookings/123/cancel \
  -H "Content-Type: application/json" \
  -d '{"token": "abc123def456"}'
```

---

### Subscribe to Notifications

Subscribe an email to receive notifications when new slots become available.

**Endpoint:** `POST /api/notifications/subscribe`

**Request Body:**

```json
{
  "barberId": "uuid",
  "subscriberEmail": "customer@example.com"
}
```

**Response:**

```json
{
  "message": "Subscribed successfully"
}
```

If already subscribed:

```json
{
  "message": "Already subscribed"
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/notifications/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "barberId": "123",
    "subscriberEmail": "customer@example.com"
  }'
```

---

## Internal Endpoints

These endpoints are called internally by the application.

### Send Booking Confirmation Email

**Endpoint:** `POST /api/emails/booking-confirmation`

**Request Body:**

```json
{
  "bookingId": "uuid"
}
```

---

### Send Cancellation Email

**Endpoint:** `POST /api/emails/booking-cancellation`

**Request Body:**

```json
{
  "bookingId": "uuid"
}
```

---

### Send Slot Available Email

**Endpoint:** `POST /api/emails/slot-available`

**Request Body:**

```json
{
  "email": "subscriber@example.com",
  "barberName": "Luccifadez",
  "date": "2026-01-20T09:00:00Z"
}
```

---

### Notify Subscribers of Available Slot

**Endpoint:** `POST /api/notifications/slot-available`

**Request Body:**

```json
{
  "bookingId": "uuid"
}
```

---

## Error Codes

All endpoints return standard HTTP status codes:

- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `404` - Not Found
- `500` - Internal Server Error

Error responses always include an `error` field:

```json
{
  "error": "Description of what went wrong"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding rate limiting middleware.

---

## Webhooks

### Stripe Webhook (Not Yet Implemented)

For online payments, you'll need to implement:

**Endpoint:** `POST /api/webhooks/stripe`

**Events to handle:**

- `checkout.session.completed` - Update booking payment status
- `payment_intent.succeeded` - Confirm payment

**Example implementation:**

```typescript
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    // Update booking payment status
  }

  return NextResponse.json({ received: true });
}
```

---

## Database Direct Access

For advanced use cases, you can query the database directly using Supabase client:

```typescript
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();

// Get all barbers
const { data: barbers } = await supabase.from("barbers").select("*");

// Get services for a barber
const { data: services } = await supabase
  .from("services")
  .select("*")
  .eq("barber_id", barberId)
  .eq("active", true);
```

---

## Testing

### Test with cURL

Create a booking:

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d @booking-data.json
```

Where `booking-data.json`:

```json
{
  "barberId": "your-barber-id",
  "serviceId": "your-service-id",
  "startsAt": "2026-01-20T09:00:00Z",
  "endsAt": "2026-01-20T09:30:00Z",
  "customerName": "Test User",
  "customerEmail": "test@example.com",
  "customerPhone": "1234567890",
  "locationType": "in-shop",
  "paymentMethod": "on-site"
}
```

### Test with JavaScript

```javascript
const response = await fetch("/api/bookings", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    barberId: "123",
    serviceId: "456",
    startsAt: "2026-01-20T09:00:00Z",
    endsAt: "2026-01-20T09:30:00Z",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "1234567890",
    locationType: "in-shop",
    paymentMethod: "on-site",
  }),
});

const data = await response.json();
```

---

## Notes

- All dates should be in ISO 8601 format
- All UUIDs are generated by Supabase
- Cancellation tokens are generated automatically
- Booking status can be: `booked`, `completed`, `no-show`, `cancelled`
- Payment status can be: `pending`, `completed`, `failed`, `refunded`

---

For more information, see:

- [README.md](./README.md)
- [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
