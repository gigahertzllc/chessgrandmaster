-- Chessmaster 2026 Database Schema
-- Run this in your Supabase SQL editor

-- Imported games (user's PGN uploads)
CREATE TABLE imported_games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  white TEXT,
  black TEXT,
  white_elo INTEGER,
  black_elo INTEGER,
  result TEXT,
  date TEXT,
  event TEXT,
  opening TEXT,
  pgn TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Master games collection (admin imported PGNs for players like Fischer, Carlsen, etc.)
CREATE TABLE master_games (
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
CREATE TABLE player_overrides (
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

-- Favorite games saved by users
CREATE TABLE favorite_games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  game_id TEXT NOT NULL,
  white TEXT,
  black TEXT,
  result TEXT,
  pgn TEXT,
  source TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game notes
CREATE TABLE game_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  game_id TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, game_id)
);

-- User preferences
CREATE TABLE user_preferences (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  app_theme TEXT DEFAULT 'dark',
  board_theme TEXT DEFAULT 'classic_wood',
  piece_set TEXT DEFAULT 'classic',
  sound_enabled BOOLEAN DEFAULT true,
  music_enabled BOOLEAN DEFAULT true,
  music_volume REAL DEFAULT 0.22,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE imported_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own data
CREATE POLICY "Users can view own imported games" ON imported_games
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own imported games" ON imported_games
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own imported games" ON imported_games
  FOR DELETE USING (auth.uid() = user_id);

-- Master games are public read, admin write
CREATE POLICY "Anyone can view master games" ON master_games
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert master games" ON master_games
  FOR INSERT WITH CHECK (true); -- In production, restrict to admin role

CREATE POLICY "Admins can update master games" ON master_games
  FOR UPDATE USING (true);

CREATE POLICY "Admins can delete master games" ON master_games
  FOR DELETE USING (true);

-- Player overrides are public read, admin write
CREATE POLICY "Anyone can view player overrides" ON player_overrides
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage player overrides" ON player_overrides
  FOR ALL USING (true); -- In production, restrict to admin role

CREATE POLICY "Users can view own favorite games" ON favorite_games
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorite games" ON favorite_games
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorite games" ON favorite_games
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own game notes" ON game_notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own game notes" ON game_notes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_master_games_player ON master_games(player_id);
CREATE INDEX idx_master_games_year ON master_games(year);
CREATE INDEX idx_imported_games_user ON imported_games(user_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- SUPABASE STORAGE
-- Run this in the Supabase Dashboard > Storage to create the bucket
-- ═══════════════════════════════════════════════════════════════════════════
-- 
-- 1. Go to Storage in your Supabase Dashboard
-- 2. Create a new bucket called "assets"
-- 3. Make it PUBLIC (for player images)
-- 4. Or run this in the SQL editor:
--
-- INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true);
--
-- Then add this policy to allow uploads:
-- CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'assets');
-- CREATE POLICY "Allow public read" ON storage.objects FOR SELECT USING (bucket_id = 'assets');
