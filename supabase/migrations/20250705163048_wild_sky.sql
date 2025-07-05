/*
  # Create theme preferences table

  1. New Tables
    - `theme_preferences`
      - `id` (uuid, primary key)
      - `user_session` (text, unique) - Session identifier for anonymous users
      - `theme` (text) - Theme preference ('light' or 'dark')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `theme_preferences` table
    - Add policies for public access to manage theme preferences
*/

CREATE TABLE IF NOT EXISTS theme_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_session text UNIQUE NOT NULL,
  theme text NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE theme_preferences ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read theme preferences
CREATE POLICY "Anyone can read theme preferences"
  ON theme_preferences
  FOR SELECT
  TO public
  USING (true);

-- Allow anyone to insert theme preferences
CREATE POLICY "Anyone can insert theme preferences"
  ON theme_preferences
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anyone to update their theme preferences
CREATE POLICY "Anyone can update their theme preferences"
  ON theme_preferences
  FOR UPDATE
  TO public
  USING (true);

-- Allow anyone to delete their theme preferences
CREATE POLICY "Anyone can delete their theme preferences"
  ON theme_preferences
  FOR DELETE
  TO public
  USING (true);

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER update_theme_preferences_updated_at
  BEFORE UPDATE ON theme_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();