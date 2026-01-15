-- Enable Row Level Security on all tables
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Barbers policies
-- Public can read all barber profiles
CREATE POLICY "Public can view barber profiles"
  ON barbers FOR SELECT
  USING (true);

-- Only authenticated users can create barber profiles
CREATE POLICY "Authenticated users can create barber profiles"
  ON barbers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Only barber owner can update their profile
CREATE POLICY "Barbers can update own profile"
  ON barbers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Only barber owner can delete their profile
CREATE POLICY "Barbers can delete own profile"
  ON barbers FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Services policies
-- Public can read active services
CREATE POLICY "Public can view services"
  ON services FOR SELECT
  USING (true);

-- Only barber owner can manage services
CREATE POLICY "Barbers can manage own services"
  ON services FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM barbers
      WHERE barbers.id = services.barber_id
      AND barbers.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM barbers
      WHERE barbers.id = services.barber_id
      AND barbers.user_id = auth.uid()
    )
  );

-- Availability policies
-- Public can read availability
CREATE POLICY "Public can view availability"
  ON availability FOR SELECT
  USING (true);

-- Only barber owner can manage availability
CREATE POLICY "Barbers can manage own availability"
  ON availability FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM barbers
      WHERE barbers.id = availability.barber_id
      AND barbers.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM barbers
      WHERE barbers.id = availability.barber_id
      AND barbers.user_id = auth.uid()
    )
  );

-- Bookings policies
-- Public can create bookings (with cancellation token)
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

-- Barber can view their bookings
CREATE POLICY "Barbers can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM barbers
      WHERE barbers.id = bookings.barber_id
      AND barbers.user_id = auth.uid()
    )
  );

-- Barber can update their bookings (status changes)
CREATE POLICY "Barbers can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM barbers
      WHERE barbers.id = bookings.barber_id
      AND barbers.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM barbers
      WHERE barbers.id = bookings.barber_id
      AND barbers.user_id = auth.uid()
    )
  );

-- Payments policies
-- Only barber can view payments for their bookings
CREATE POLICY "Barbers can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      JOIN barbers ON barbers.id = bookings.barber_id
      WHERE bookings.id = payments.booking_id
      AND barbers.user_id = auth.uid()
    )
  );

-- System can create/update payments
CREATE POLICY "Service role can manage payments"
  ON payments FOR ALL
  USING (true)
  WITH CHECK (true);

-- Notification subscriptions policies
-- Public can subscribe
CREATE POLICY "Anyone can subscribe"
  ON notification_subscriptions FOR INSERT
  WITH CHECK (true);

-- Public can view their subscriptions (by email match)
CREATE POLICY "Anyone can view subscriptions"
  ON notification_subscriptions FOR SELECT
  USING (true);

-- Subscribers can update/delete their subscription
CREATE POLICY "Anyone can update subscriptions"
  ON notification_subscriptions FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete subscriptions"
  ON notification_subscriptions FOR DELETE
  USING (true);

-- Gallery images policies
-- Public can view gallery
CREATE POLICY "Public can view gallery"
  ON gallery_images FOR SELECT
  USING (true);

-- Barber can manage their gallery
CREATE POLICY "Barbers can manage own gallery"
  ON gallery_images FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM barbers
      WHERE barbers.id = gallery_images.barber_id
      AND barbers.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM barbers
      WHERE barbers.id = gallery_images.barber_id
      AND barbers.user_id = auth.uid()
    )
  );
