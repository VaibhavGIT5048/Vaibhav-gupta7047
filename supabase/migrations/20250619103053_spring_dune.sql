/*
  # Fix Storage Bucket and Policies for Resume Upload

  1. Storage Setup
    - Ensure resumes bucket exists with proper configuration
    - Set correct file size limits and MIME types
    - Fix public access policies

  2. Security Policies
    - Allow public read access to resume files
    - Allow authenticated users to manage resume files
    - Proper bucket-level permissions
*/

-- Create storage bucket for resumes if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'resumes',
    'resumes',
    true,
    5242880, -- 5MB limit
    ARRAY['application/pdf']
  );
EXCEPTION WHEN unique_violation THEN
  -- Bucket already exists, update it
  UPDATE storage.buckets 
  SET 
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['application/pdf']
  WHERE id = 'resumes';
END $$;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view resume files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload resume files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete resume files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update resume files" ON storage.objects;

-- Create new storage policies
CREATE POLICY "Public can view resume files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can upload resume files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can delete resume files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can update resume files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'resumes');