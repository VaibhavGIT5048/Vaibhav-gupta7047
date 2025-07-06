/*
  # Add Category Support to Projects

  1. Database Changes
    - Add `category` column to projects table
    - Add check constraint for valid categories
    - Update existing projects with default categories

  2. Categories
    - AI/ML: Artificial Intelligence and Machine Learning projects
    - Data Science & Analysis: Data analysis and visualization projects
    - Case Studies: Business case studies and research projects
    - Web Development: Full-stack web applications
    - Other: Miscellaneous projects
*/

-- Add category column to projects table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'category'
  ) THEN
    ALTER TABLE projects ADD COLUMN category text NOT NULL DEFAULT 'Other' 
    CHECK (category IN ('AI/ML', 'Data Science & Analysis', 'Case Studies', 'Web Development', 'Other'));
  END IF;
END $$;

-- Update existing projects with appropriate categories
UPDATE projects 
SET category = CASE 
  WHEN title ILIKE '%dashboard%' OR title ILIKE '%analysis%' OR title ILIKE '%data%' THEN 'Data Science & Analysis'
  WHEN title ILIKE '%epl%' OR title ILIKE '%football%' THEN 'Case Studies'
  WHEN title ILIKE '%car%' AND title ILIKE '%sales%' THEN 'Data Science & Analysis'
  ELSE 'Other'
END
WHERE category = 'Other';