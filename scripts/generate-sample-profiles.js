import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const names = [
  'Arjun Dhavle', 'Maya Patel', 'Ethan Kim', 'Sofia Rossi', 'Lucas Wang',
  'Priya Singh', 'Mateo Garcia', 'Olivia Brown', 'Noah Smith', 'Emma Johnson',
  'Ava Lee', 'Liam Martinez', 'Zoe Chen', 'Mason Clark', 'Chloe Davis'
];
const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'USTA 3.0', 'USTA 3.5', 'USTA 4.0+'];
const playFormats = ['Singles', 'Doubles', 'Mixed', 'Rallying', 'Practice'];
const personalities = ['Chill', 'Competitive', 'Social', 'Quiet'];
const surfaces = ['Hard', 'Clay', 'Grass', 'Any'];
const bios = [
  'Love to play on weekends and meet new people!',
  'Competitive spirit, always up for a challenge.',
  'Enjoys rallying and improving skills.',
  'Looking for doubles partners in the city.',
  'USTA player, open to all formats.',
  'Just started playing, eager to learn!',
  'Enjoys both singles and doubles.',
  'Prefers clay courts and early morning games.',
  'Social player, loves post-match coffee.',
  'Practices regularly, looking for hitting partners.'
];

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPlayFormat() {
  // Pick 1-3 random formats
  const shuffled = playFormats.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 3) + 1).join(',');
}

async function generateProfiles() {
  const profiles = names.slice(0, 15).map((name, i) => ({
    id: uuidv4(),
    full_name: name,
    skill_level: randomPick(skillLevels),
    play_format: randomPlayFormat(),
    experience_years: Math.floor(Math.random() * 15) + 1,
    personality: randomPick(personalities),
    bio: randomPick(bios),
    preferred_surface: randomPick(surfaces),
  }));

  for (const profile of profiles) {
    const { error } = await supabase.from('profiles').upsert(profile);
    if (error) {
      console.error('Error inserting profile:', profile.full_name, error.message);
    } else {
      console.log('Inserted profile:', profile.full_name);
    }
  }
}

generateProfiles().catch(console.error); 