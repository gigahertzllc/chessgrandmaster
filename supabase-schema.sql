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
  board_theme TEXT DEFAULT 'default',
  piece_set TEXT DEFAULT 'cburnett',
  sound_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE imported_games ENABLE ROW LEVEL SECURITY;
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
