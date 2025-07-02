/*
  # Fix Resume Upload RLS Policies

  1. Database Changes
    - Update RLS policies for resume_files table
    - Allow authenticated users to insert/update/delete resume files
    - Maintain public read access for active resumes

  2. Security
    - Proper RLS policies that don't block legitimate operations
    - Maintain security while allowing functionality
*/

-- Drop existing policies for resume_files
DROP POLICY IF EXISTS "Public can read active resume files" ON resume_files;
DROP POLICY IF EXISTS "Authenticated can manage resume files" ON resume_files;

-- Create new, more permissive policies for resume_files
CREATE POLICY "Anyone can read active resume files"
  ON resume_files
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow all operations for authenticated users"
  ON resume_files
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure storage policies are correct
DROP POLICY IF EXISTS "Public can view resume files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload resume files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete resume files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update resume files" ON storage.objects;

-- Create simplified storage policies
CREATE POLICY "Anyone can view resume files"
ON storage.objects FOR SELECT
USING (bucket_id = 'resumes');

CREATE POLICY "Authenticated can manage resume files"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'resumes')
WITH CHECK (bucket_id = 'resumes');