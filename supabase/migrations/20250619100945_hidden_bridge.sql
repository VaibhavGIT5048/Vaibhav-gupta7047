/*
  # Portfolio Database Schema

  1. New Tables
    - `experiences`
      - `id` (uuid, primary key)
      - `role` (text)
      - `organization` (text)
      - `period` (text)
      - `location` (text)
      - `description` (text)
      - `type` (text, either 'professional' or 'leadership')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `skills`
      - `id` (uuid, primary key)
      - `name` (text)
      - `level` (integer)
      - `type` (text, either 'technical' or 'soft')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image` (text)
      - `github_url` (text)
      - `live_url` (text, nullable)
      - `tech` (text array)
      - `featured` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `resume_files`
      - `id` (uuid, primary key)
      - `filename` (text)
      - `file_url` (text)
      - `file_size` (bigint)
      - `mime_type` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated admin access
*/

-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  organization text NOT NULL,
  period text NOT NULL,
  location text NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('professional', 'leadership')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  level integer NOT NULL DEFAULT 0 CHECK (level >= 0 AND level <= 100),
  type text NOT NULL CHECK (type IN ('technical', 'soft')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image text DEFAULT '',
  github_url text NOT NULL,
  live_url text,
  tech text[] NOT NULL DEFAULT '{}',
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create resume_files table
CREATE TABLE IF NOT EXISTS resume_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  file_url text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_files ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read experiences"
  ON experiences
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read skills"
  ON skills
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read projects"
  ON projects
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read active resume files"
  ON resume_files
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Create policies for authenticated admin access (full CRUD)
CREATE POLICY "Authenticated can manage experiences"
  ON experiences
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can manage skills"
  ON skills
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can manage projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can manage resume files"
  ON resume_files
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resume_files_updated_at
  BEFORE UPDATE ON resume_files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default data
INSERT INTO experiences (role, organization, period, location, description, type) VALUES
('Data Science Intern', 'Radius Synergies International', 'June–July 2025', 'Remote', 'Worked on data analysis projects, developed machine learning models, and created data visualizations to support business decision-making processes.', 'professional'),
('Campus Ambassador', 'LinkedIn', 'Sept 2024–Present', 'New Delhi, India', 'Represent LinkedIn on campus, organize networking events, and help students build professional connections and enhance their LinkedIn presence.', 'leadership'),
('Student Placement Coordinator', 'CDC', 'Jan 2025–Present', 'New Delhi, India', 'Coordinate placement activities, liaise between students and recruiters, and assist in organizing recruitment drives and career development programs.', 'leadership'),
('Technical Lead', 'HackWithIndia', 'Apr 2025–Present', 'Remote', 'Lead technical initiatives, mentor participants in hackathons, and oversee the development of innovative solutions for various challenges.', 'leadership'),
('Co-Lead, Management Team', 'DataDynamos', 'Sept 2024–Present', 'New Delhi, India', 'Co-lead the management team, organize data science workshops and competitions, and foster a community of data enthusiasts and professionals.', 'leadership');

INSERT INTO skills (name, level, type) VALUES
('Python', 90, 'technical'),
('SQL', 50, 'technical'),
('Tableau', 90, 'technical'),
('Excel', 70, 'technical'),
('Data Analysis', 88, 'technical'),
('Machine Learning', 25, 'technical'),
('Problem Solving', 0, 'soft'),
('Critical Thinking', 0, 'soft'),
('Communication', 0, 'soft'),
('Team Leadership', 0, 'soft'),
('Project Management', 0, 'soft'),
('Adaptability', 0, 'soft');

INSERT INTO projects (title, description, image, github_url, live_url, tech, featured) VALUES
('Car Sales Analytics Dashboard', 'Interactive dashboard built with Tableau showcasing comprehensive car sales analysis with dynamic filters and real-time insights.', 'https://i.ytimg.com/vi/J_QHdHgRJow/hqdefault.jpg', '', 'https://public.tableau.com/app/profile/vaibhav.gupta7707/viz/Car_sales_dashboard/Dashboard1?publish=yes', ARRAY['Tableau', 'Data Analysis', 'Business Intelligence'], true),
('EPL Data Analysis', 'Project Structure Data Source: Football statistics dataset (includes metrics like goals, assists, minutes played, passing accuracy, and disciplinary records). Tool: Tableau Desktop / Tableau Public for visualization and dashboard creation.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'https://github.com/VaibhavGIT5048/Data_Analysis.git', '', ARRAY['Python', 'Data Analysis', 'Tableau'], true);