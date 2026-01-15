-- Create storage buckets for barber assets

-- Barber logos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('barber-logos', 'barber-logos', true);

-- Gallery images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-images', 'gallery-images', true);

-- Extra section images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('extra-section-images', 'extra-section-images', true);

-- Storage policies for barber-logos
CREATE POLICY "Public can view logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'barber-logos');

CREATE POLICY "Authenticated users can upload logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'barber-logos');

CREATE POLICY "Users can update own logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'barber-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own logos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'barber-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for gallery-images
CREATE POLICY "Public can view gallery images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery-images');

CREATE POLICY "Authenticated users can upload gallery images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'gallery-images');

CREATE POLICY "Users can update own gallery images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'gallery-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own gallery images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'gallery-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for extra-section-images
CREATE POLICY "Public can view extra section images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'extra-section-images');

CREATE POLICY "Authenticated users can upload extra section images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'extra-section-images');

CREATE POLICY "Users can update own extra section images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'extra-section-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own extra section images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'extra-section-images' AND auth.uid()::text = (storage.foldername(name))[1]);
