export interface Profile {
  id: string;
  full_name: string;
  availability: string | null;
  play_style: string | null;
  created_at: string;
  skill_level: string | null;
  play_format: string | null;
  experience_years: number | null;
  preferred_court_id: string | null;
  availability_json: string | null;
  personality: string | null;
  bio: string | null;
  preferred_surface: string | null;
} 