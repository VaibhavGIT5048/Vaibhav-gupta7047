/*
  # Create competitions table

  1. New Tables
    - `competitions`
      - `id` (uuid, primary key)
      - `title` (text, competition name)
      - `description` (text, detailed description)
      - `event_type` (text, hackathon or competition)
      - `standing` (text, placement/ranking)
      - `date` (text, event date)
      - `location` (text, event location)
      - `organizer` (text, organizing body)
      - `team_size` (integer, number of team members)
      - `technologies` (text array, tech stack used)
      - `project_url` (text, optional project link)
      - `certificate_url` (text, optional certificate link)
      - `images` (text array, photo URLs)
      - `featured` (boolean, highlight important competitions)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `competitions` table
    - Add policy for public read access
    - Add policy for authenticated users to manage competitions

  3. Constraints
    - Check constraint for event_type (hackathon, competition)
    - Check constraint for team_size (1-10 members)
*/

CREATE TABLE IF NOT EXISTS competitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('hackathon', 'competition')),
  standing text NOT NULL,
  date text NOT NULL,
  location text NOT NULL,
  organizer text NOT NULL,
  team_size integer DEFAULT 1 CHECK (team_size >= 1 AND team_size <= 10),
  technologies text[] DEFAULT '{}',
  project_url text,
  certificate_url text,
  images text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read competitions"
  ON competitions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated can manage competitions"
  ON competitions
  FOR ALL
  TO authenticated
  USING (true);

CREATE TRIGGER update_competitions_updated_at
  BEFORE UPDATE ON competitions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();