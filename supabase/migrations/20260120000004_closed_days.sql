-- Create closed_days table for holidays, sick days, etc.
CREATE TABLE IF NOT EXISTS closed_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  reason_type TEXT NOT NULL, -- 'holiday', 'sick', 'vacation', 'closed'
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(barber_id, date)
);

-- Index for better performance
CREATE INDEX idx_closed_days_barber_date ON closed_days(barber_id, date);

-- RLS policies
ALTER TABLE closed_days ENABLE ROW LEVEL SECURITY;

-- Public can view closed days
CREATE POLICY "Public can view closed days"
  ON closed_days FOR SELECT
  USING (true);

-- Barbers can manage their own closed days
CREATE POLICY "Barbers can manage own closed days"
  ON closed_days FOR ALL
  USING (
    barber_id IN (
      SELECT id FROM barbers
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    barber_id IN (
      SELECT id FROM barbers
      WHERE user_id = auth.uid()
    )
  );
