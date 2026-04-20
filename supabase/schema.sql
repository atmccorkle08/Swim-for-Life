-- ============================================
-- SWIM FOR LIFE — Supabase Database Schema
-- Run this SQL once in the Supabase SQL Editor.
-- Do NOT run from the application.
-- ============================================

-- ============================================
-- REGISTRATIONS TABLE
-- Replaces Google Sheets as the primary store
-- ============================================
CREATE TABLE registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  child_name TEXT NOT NULL,
  child_age INTEGER NOT NULL CHECK (child_age >= 3 AND child_age <= 18),
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  swim_experience TEXT NOT NULL CHECK (swim_experience IN ('none', 'beginner', 'some')),
  has_special_needs BOOLEAN DEFAULT FALSE,
  special_needs_details TEXT,
  session_preference TEXT,
  photo_release_consent BOOLEAN NOT NULL DEFAULT FALSE,
  liability_waiver_agreed BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'confirmed', 'completed', 'cancelled'))
);

-- Index for coaches filtering by status
CREATE INDEX idx_registrations_status ON registrations(status);
-- Index for sorting by date
CREATE INDEX idx_registrations_created ON registrations(created_at DESC);

-- ============================================
-- DONORS TABLE
-- Populated by Stripe webhook (Phase 2)
-- ============================================
CREATE TABLE donors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('splash_supporter', 'wave_maker', 'tide_changer')),
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  display_consent BOOLEAN NOT NULL DEFAULT FALSE,
  is_recurring BOOLEAN DEFAULT FALSE,
  stripe_session_id TEXT UNIQUE,
  stripe_customer_id TEXT
);

-- Index for donor wall queries (only show those who opted in)
CREATE INDEX idx_donors_display ON donors(display_consent) WHERE display_consent = TRUE;
-- Index for tier grouping
CREATE INDEX idx_donors_tier ON donors(tier);

-- ============================================
-- CAMPAIGNS TABLE
-- Tracks fundraising goals and progress
-- ============================================
CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  label TEXT NOT NULL,
  goal_amount DECIMAL(10, 2) NOT NULL CHECK (goal_amount > 0),
  current_amount DECIMAL(10, 2) DEFAULT 0 CHECK (current_amount >= 0),
  is_active BOOLEAN DEFAULT TRUE
);

-- Only one campaign should be active at a time
CREATE UNIQUE INDEX idx_campaigns_active ON campaigns(is_active) WHERE is_active = TRUE;

-- Insert the default campaign
INSERT INTO campaigns (label, goal_amount, current_amount, is_active)
VALUES ('Help us fund Summer 2026 sessions', 5000, 0, true);

-- ============================================
-- CONTACT SUBMISSIONS TABLE
-- Stores contact form submissions
-- ============================================
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE
);

-- ============================================
-- ROW LEVEL SECURITY
-- All tables use RLS. Access is through the service role key
-- in API routes only — no direct client-side access.
-- ============================================
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Service role key bypasses RLS automatically.
-- No additional policies needed since all access goes through
-- server-side API routes using the service role key.

-- ============================================
-- HELPER FUNCTION: Auto-update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- GALLERY IMAGES TABLE
-- Stores metadata for gallery photos (files in Supabase Storage)
-- ============================================
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
