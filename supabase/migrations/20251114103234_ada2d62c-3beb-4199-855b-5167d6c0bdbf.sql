-- Add image_url column to lifeBlock table
ALTER TABLE "lifeBlock" ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create RLS policies for lifeBlockImages bucket
CREATE POLICY "Public can view life block images"
ON storage.objects FOR SELECT
USING (bucket_id = 'lifeBlockImages');

CREATE POLICY "Authenticated users can upload life block images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'lifeBlockImages' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update own life block images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'lifeBlockImages' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own life block images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'lifeBlockImages' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);