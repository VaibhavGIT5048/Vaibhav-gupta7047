/*
  # Create Storage Bucket for Resume Files

  1. Storage Setup
    - Create 'resumes' bucket for storing PDF files
    - Set up public access policies for resume downloads
    - Configure file upload policies for authenticated users

  2. Security
    - Allow public read access to resume files
    - Restrict upload/delete to authenticated users only
    - Set file size and type restrictions
*/

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  true,
  5242880, -- 5MB limit
  ARRAY['application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- Allow public access to view resume files
CREATE POLICY "Public can view resume files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'resumes');

-- Allow authenticated users to upload resume files
CREATE POLICY "Authenticated users can upload resume files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resumes' 
  AND (storage.foldername(name))[1] = 'resumes'
);

-- Allow authenticated users to delete resume files
CREATE POLICY "Authenticated users can delete resume files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'resumes');

-- Allow authenticated users to update resume files
CREATE POLICY "Authenticated users can update resume files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'resumes');