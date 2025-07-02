/*
  # Create About Table

  1. New Tables
    - `about`
      - `id` (uuid, primary key)
      - `content` (text)
      - `updated_at` (timestamp with default now())

  2. Security
    - Enable RLS on about table
    - Add policy for public read access
    - Add policy for authenticated admin access
*/

-- Create about table
CREATE TABLE IF NOT EXISTS about (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE about ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read about content"
  ON about
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated admin access (full CRUD)
CREATE POLICY "Authenticated can manage about content"
  ON about
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE TRIGGER update_about_updated_at
  BEFORE UPDATE ON about
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default about content
INSERT INTO about (content) VALUES
('I''m a passionate Computer Science student deeply immersed in the realms of Data Science and AI. With a hands-on approach to technologies like Python, SQL, Tableau, and Excel, I specialize in transforming raw data into actionable, impactful insights.

Driven by insatiable curiosity and a relentless pursuit of growth, I explore the art and science of data—constantly pushing boundaries and turning complex data into meaningful stories. My work is more than just code; it''s about building intelligent, dynamic solutions that pave the way for a smarter, data-driven future.

Let''s harness the power of data to shape tomorrow''s innovation—together.')
ON CONFLICT DO NOTHING;