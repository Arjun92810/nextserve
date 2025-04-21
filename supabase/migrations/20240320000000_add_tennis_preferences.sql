-- Add tennis preference fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS play_style text,
ADD COLUMN IF NOT EXISTS availability text,
ADD COLUMN IF NOT EXISTS preferred_format text,
ADD COLUMN IF NOT EXISTS preferred_surface text,
ADD COLUMN IF NOT EXISTS school text;

-- Update RLS policies to allow users to update their own profiles
CREATE POLICY "Users can update their own profiles"
ON profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Insert the provided tennis preferences
UPDATE profiles
SET 
  play_style = 'Serve and Volley',
  availability = 'Weekends 2 - 7 pm',
  preferred_format = 'Singles',
  preferred_surface = 'Hard',
  school = 'Franklin High'
WHERE id = auth.uid(); 