/*
  # Add User Reference to Resume Files and Fix RLS Policies

  1. Database Changes
    - Add user_id column to resume_files table to track ownership
    - Update RLS policies to use proper user authentication
    - Ensure storage policies work correctly

  2. Security
    - Only authenticated users can upload/manage their own resume files
    - Public can read active resume files
    - Proper user isolation for resume management
*/

-- Add user_id column to resume_files table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'resume_files' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE resume_files ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Update existing resume files to have a default user_id (optional - for existing data)
-- You can remove this if you want to start fresh
UPDATE resume_files 
SET user_id = (SELECT id FROM auth.users LIMIT 1)
WHERE user_id IS NULL;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Public can read active resumes" ON resume_files;
DROP POLICY IF EXISTS "Authenticated users full access" ON resume_files;
DROP POLICY IF EXISTS "Anyone can read active resume files" ON resume_files;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON resume_files;

-- Create proper RLS policies
CREATE POLICY "Public can read active resume files"
  ON resume_files
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Users can manage their own resume files"
  ON resume_files
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to insert resume files (they become the owner)
CREATE POLICY "Authenticated users can insert resume files"
  ON resume_files
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Fix storage policies
DROP POLICY IF EXISTS "Public read resume files" ON storage.objects;
DROP POLICY IF EXISTS "Auth manage resume files" ON storage.objects;

-- Create proper storage policies
CREATE POLICY "Public can view resume files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can upload resume files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can delete their resume files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can update their resume files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'resumes');