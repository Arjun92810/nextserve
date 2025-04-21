-- Add tennis preference fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS play_style text,
ADD COLUMN IF NOT EXISTS availability text,
ADD COLUMN IF NOT EXISTS preferred_format text,
ADD COLUMN IF NOT EXISTS preferred_surface text,
ADD COLUMN IF NOT EXISTS school text; 