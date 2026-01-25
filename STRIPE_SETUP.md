# Stripe Integration Setup Guide

This guide will help you set up Stripe payments for LubooKing, including card, Klarna, and Swish payments.

## Prerequisites

- A Stripe account (sign up at [stripe.com](https://stripe.com))
- Your LubooKing application running locally or deployed

## Step 1: Get Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. Copy the following keys:
   - **Publishable key** (starts with `pk_test_...` for test mode)
   - **Secret key** (starts with `sk_test_...` for test mode)

## Step 2: Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Step 3: Enable Payment Methods

1. In Stripe Dashboard, go to **Settings** → **Payment methods**
2. Enable the following:
   - ✅ **Card payments** (Visa, Mastercard, etc.)
   - ✅ **Klarna** (Buy now, pay later)
   - ✅ **Swish** (Swedish mobile payments)

**Note:** Swish and Klarna require you to:

- Have a Swedish business registration
- Complete additional verification in Stripe
- May require activating these in your Stripe settings

## Step 4: Set Up Webhooks (Production)

For production, you need to configure webhooks to handle payment confirmations:

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your endpoint URL:
   ```
   https://yourdomain.com/api/stripe/webhook
   ```
4. Select the following events:
   - `checkout.session.completed`
5. Copy the **Signing secret** and add it to your `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

## Step 5: Test in Development

For local testing, use Stripe CLI:

### Install Stripe CLI

```bash
# Windows (with Scoop)
scoop install stripe

# Mac
brew install stripe/stripe-cli/stripe

# Or download from https://stripe.com/docs/stripe-cli
```

### Forward webhooks to localhost

```bash
stripe listen --forward-to http://localhost:3002/api/stripe/webhook
```

This will give you a webhook secret starting with `whsec_` - add this to your `.env.local`.

## Step 6: Test Payments

Use these test card numbers in Stripe test mode:

| Card Number           | Result                            |
| --------------------- | --------------------------------- |
| `4242 4242 4242 4242` | Success                           |
| `4000 0025 0000 3155` | Requires 3D Secure authentication |
| `4000 0000 0000 9995` | Declined                          |

- Use any future expiry date (e.g., 12/34)
- Use any 3-digit CVC
- Use any postal code

## Currency Configuration

The system is currently configured for **SEK (Swedish Krona)**. To change:

1. Open `app/api/stripe/checkout/route.ts`
2. Find the line:
   ```typescript
   currency: "sek",
   ```
3. Change to your currency (e.g., `"usd"`, `"eur"`)

## Payment Flow

1. Customer selects "Pay online now"
2. System creates a booking with `payment_status: 'pending'`
3. Customer is redirected to Stripe Checkout
4. Customer completes payment (card, Klarna, or Swish)
5. Stripe sends webhook to confirm payment
6. System updates booking to `payment_status: 'paid'`
7. Customer is redirected back with confirmation

## Troubleshooting

### Webhook not receiving events

- Ensure Stripe CLI is running (`stripe listen`)
- Check your webhook secret is correct
- Verify endpoint URL is accessible

### Swish not available

- Swish requires Swedish business registration
- Contact Stripe support to activate
- Alternative: Use only card and Klarna for now

### Payment method not showing

- Check if payment method is enabled in Stripe Dashboard
- Some methods have geographical restrictions
- Test in different regions if needed

## Going Live

Before going to production:

1. Switch to **live mode** in Stripe Dashboard
2. Replace test keys with live keys:
   - `pk_live_...`
   - `sk_live_...`
3. Configure production webhook endpoint
4. Complete Stripe account verification
5. Test with small real payments first

## Support

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Payment Methods](https://stripe.com/docs/payments/payment-methods)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
