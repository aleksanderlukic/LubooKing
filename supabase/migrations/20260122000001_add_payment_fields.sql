-- Add payment_intent_id to bookings table for Stripe integration
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_payment_intent ON bookings(payment_intent_id);

-- Update payment_status to include 'paid'
ALTER TABLE bookings 
DROP CONSTRAINT IF EXISTS bookings_payment_status_check;

ALTER TABLE bookings
ADD CONSTRAINT bookings_payment_status_check 
CHECK (payment_status IN ('pending', 'paid', 'completed', 'failed', 'refunded'));
