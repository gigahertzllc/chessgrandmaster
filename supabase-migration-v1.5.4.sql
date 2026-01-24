-- ═══════════════════════════════════════════════════════════════════════════
-- ChessGrandmaster 2026 - INCREMENTAL MIGRATION v1.5.4
-- Run this if you already have the base tables from earlier versions
-- This only adds the NEW tables and won't conflict with existing ones
-- ═══════════════════════════════════════════════════════════════════════════

-- Audio tracks for Zone Mode (uploaded via Admin Panel)
CREATE TABLE IF NOT EXISTS audio_tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT,
  album TEXT,
  duration INTEGER, -- seconds
  file_url TEXT NOT NULL, -- Supabase Storage URL
  artwork_url TEXT, -- Album art URL
  tags TEXT[] DEFAULT '{}', -- e.g., ['zone', 'chill', 'focus']
  modes TEXT[] DEFAULT '{zone}', -- which modes this track plays in
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE audio_tracks ENABLE ROW LEVEL SECURITY;

-- Audio tracks are public read/write
DROP POLICY IF EXISTS "Anyone can view audio tracks" ON audio_tracks;
CREATE POLICY "Anyone can view audio tracks" ON audio_tracks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert audio tracks" ON audio_tracks;
CREATE POLICY "Anyone can insert audio tracks" ON audio_tracks FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update audio tracks" ON audio_tracks;
CREATE POLICY "Anyone can update audio tracks" ON audio_tracks FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete audio tracks" ON audio_tracks;
CREATE POLICY "Anyone can delete audio tracks" ON audio_tracks FOR DELETE USING (true);

-- Custom players created via Admin Panel
CREATE TABLE IF NOT EXISTS custom_players (
  id TEXT PRIMARY KEY, -- e.g., 'my_player_1'
  name TEXT NOT NULL,
  full_name TEXT,
  icon TEXT DEFAULT '♟️',
  born TEXT,
  died TEXT,
  birth_place TEXT,
  nationality TEXT,
  titles TEXT[], -- array of titles
  peak_rating INTEGER,
  world_champion TEXT,
  image_url TEXT,
  bio TEXT,
  playing_style TEXT,
  era TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Master games collection (admin imported PGNs for players like Fischer, Carlsen, etc.)
CREATE TABLE IF NOT EXISTS master_games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id TEXT NOT NULL, -- e.g., 'fischer', 'carlsen', 'morphy'
  game_id TEXT NOT NULL, -- unique identifier for deduplication
  white TEXT NOT NULL,
  black TEXT NOT NULL,
  white_elo TEXT,
  black_elo TEXT,
  result TEXT,
  year INTEGER,
  event TEXT,
  site TEXT,
  round TEXT,
  eco TEXT,
  pgn TEXT NOT NULL,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(player_id, game_id)
);

-- Player profile overrides (custom images, edited bios, etc.)
CREATE TABLE IF NOT EXISTS player_overrides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id TEXT NOT NULL UNIQUE, -- e.g., 'fischer', 'carlsen'
  custom_image_url TEXT, -- URL to custom uploaded image
  custom_bio TEXT,
  full_name TEXT,
  born TEXT,
  died TEXT,
  nationality TEXT,
  peak_rating INTEGER,
  world_champion TEXT,
  playing_style TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE custom_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_overrides ENABLE ROW LEVEL SECURITY;

-- Custom players are public read/write (in production, restrict to admin role)
DROP POLICY IF EXISTS "Anyone can view custom players" ON custom_players;
CREATE POLICY "Anyone can view custom players" ON custom_players FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert custom players" ON custom_players;
CREATE POLICY "Anyone can insert custom players" ON custom_players FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update custom players" ON custom_players;
CREATE POLICY "Anyone can update custom players" ON custom_players FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete custom players" ON custom_players;
CREATE POLICY "Anyone can delete custom players" ON custom_players FOR DELETE USING (true);

-- Master games are public read, anyone can write (in production, restrict to admin role)
DROP POLICY IF EXISTS "Anyone can view master games" ON master_games;
CREATE POLICY "Anyone can view master games" ON master_games FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert master games" ON master_games;
CREATE POLICY "Anyone can insert master games" ON master_games FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update master games" ON master_games;
CREATE POLICY "Anyone can update master games" ON master_games FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete master games" ON master_games;
CREATE POLICY "Anyone can delete master games" ON master_games FOR DELETE USING (true);

-- Player overrides are public read, anyone can write (in production, restrict to admin role)
DROP POLICY IF EXISTS "Anyone can view player overrides" ON player_overrides;
CREATE POLICY "Anyone can view player overrides" ON player_overrides FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can manage player overrides" ON player_overrides;
CREATE POLICY "Anyone can manage player overrides" ON player_overrides FOR ALL USING (true);

-- Indexes for performance (IF NOT EXISTS not supported for indexes, so we use exception handling)
DO $$ BEGIN
  CREATE INDEX idx_master_games_player ON master_games(player_id);
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;

DO $$ BEGIN
  CREATE INDEX idx_master_games_year ON master_games(year);
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;

-- Update user_preferences defaults if table exists
DO $$ BEGIN
  ALTER TABLE user_preferences ALTER COLUMN board_theme SET DEFAULT 'classic_wood';
EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE user_preferences ALTER COLUMN music_enabled SET DEFAULT true;
EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE user_preferences ALTER COLUMN music_volume SET DEFAULT 0.22;
EXCEPTION WHEN undefined_column THEN NULL;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- STORAGE BUCKET
-- ═══════════════════════════════════════════════════════════════════════════
-- Create storage bucket for player images
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
CREATE POLICY "Allow public uploads" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'assets');

DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
CREATE POLICY "Allow public read" ON storage.objects 
  FOR SELECT USING (bucket_id = 'assets');

DROP POLICY IF EXISTS "Allow public update" ON storage.objects;
CREATE POLICY "Allow public update" ON storage.objects 
  FOR UPDATE USING (bucket_id = 'assets');

DROP POLICY IF EXISTS "Allow public delete" ON storage.objects;
CREATE POLICY "Allow public delete" ON storage.objects 
  FOR DELETE USING (bucket_id = 'assets');

-- ═══════════════════════════════════════════════════════════════════════════
-- DONE! Your database is now updated for ChessGrandmaster v1.5.1
-- ═══════════════════════════════════════════════════════════════════════════
