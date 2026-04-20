-- Migration: Add gallery_images table for dynamic gallery management
-- Date: 2026-04-15

CREATE TABLE gallery_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  src         TEXT NOT NULL,
  alt         TEXT NOT NULL,
  caption     TEXT,
  category    TEXT NOT NULL,
  width       INTEGER NOT NULL,
  height      INTEGER NOT NULL,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Public read access for gallery display
CREATE POLICY public_read ON gallery_images FOR SELECT USING (true);

-- Only service role can insert/update/delete
CREATE POLICY service_role_write ON gallery_images
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Index for default sort order
CREATE INDEX idx_gallery_images_sort ON gallery_images(sort_order ASC, created_at DESC);
