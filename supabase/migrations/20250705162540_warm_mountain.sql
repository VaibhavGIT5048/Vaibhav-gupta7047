/*
  # Create theme preferences table

  1. New Tables
    - `theme_preferences`
      - `id` (uuid, primary key)
      - `user_session` (text, unique identifier for anonymous users)
      - `theme` (text, 'light' or 'dark')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `theme_preferences` table
    - Add policy for public read/write access (since we support anonymous users)

  3. Notes
    - Uses session-based identification for anonymous users
    - Supports both authenticated and anonymous theme persistence
*/

CREATE TABLE IF NOT EXISTS theme_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_session text UNIQUE NOT NULL,
  theme text NOT NULL CHECK (theme IN ('light', 'dark')) DEFAULT 'light',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE theme_preferences ENABLE ROW LEVEL SECURITY;

-- Allow public access for theme preferences (anonymous users)
CREATE POLICY "Anyone can read theme preferences"
  ON theme_preferences
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert theme preferences"
  ON theme_preferences
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update their theme preferences"
  ON theme_preferences
  FOR UPDATE
  TO public
  USING (true);

-- Auto-update timestamps
CREATE TRIGGER update_theme_preferences_updated_at
  BEFORE UPDATE ON theme_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();