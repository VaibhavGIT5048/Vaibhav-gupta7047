/*
  # Fix Resume Files RLS Policies - Final Fix

  1. Database Issues
    - The resume_files table doesn't have a user_id column
    - RLS policies were referencing non-existent columns
    - Need to create simple, working policies

  2. Security
    - Allow public read access to active resume files
    - Allow authenticated users full access to manage resume files
    - Remove any references to user_id since it doesn't exist
*/

-- Ensure RLS is enabled
ALTER TABLE resume_files ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Public can read active resume files" ON resume_files;
DROP POLICY IF EXISTS "Authenticated can manage resume files" ON resume_files;
DROP POLICY IF EXISTS "Anyone can read active resume files" ON resume_files;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON resume_files;
DROP POLICY IF EXISTS "Authenticated users can manage resume files" ON resume_files;

-- Create simple, working policies
CREATE POLICY "Public can read active resumes"
  ON resume_files
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users full access"
  ON resume_files
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix storage policies
DROP POLICY IF EXISTS "Public can view resume files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view resume files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload resume files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete resume files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update resume files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can manage resume files" ON storage.objects;

-- Create working storage policies
CREATE POLICY "Public read resume files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'resumes');

CREATE POLICY "Auth manage resume files"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'resumes')
  WITH CHECK (bucket_id = 'resumes');