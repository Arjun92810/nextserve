'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

interface ProfileData {
  full_name: string;
  skill_level: string;
  play_format: string[];
  experience_years: string;
  personality: string;
  bio: string;
  preferred_surface: string;
}

export default function ProfileForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData>({
    full_name: '',
    skill_level: '',
    play_format: [],
    experience_years: '',
    personality: '',
    bio: '',
    preferred_surface: '',
  });

  const playFormatOptions = ['Singles', 'Doubles', 'Mixed', 'Rallying', 'Practice'];
  const personalityOptions = ['Chill', 'Competitive', 'Social', 'Quiet'];
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'USTA 3.0', 'USTA 3.5', 'USTA 4.0+'];
  const surfaceOptions = ['Hard', 'Clay', 'Grass', 'Any'];

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (data && !error) {
        setProfile({
          full_name: data.full_name || '',
          skill_level: data.skill_level || '',
          play_format: data.play_format ? data.play_format.split(',') : [],
          experience_years: data.experience_years?.toString() || '',
          personality: data.personality || '',
          bio: data.bio || '',
          preferred_surface: data.preferred_surface || '',
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const handleSave = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      alert('You must be logged in.');
      return;
    }

    const { error } = await supabase.from('profiles').upsert({
      id: session.user.id,
      full_name: profile.full_name,
      skill_level: profile.skill_level,
      play_format: profile.play_format.join(','),
      experience_years: profile.experience_years
        ? parseInt(profile.experience_years)
        : null,
      personality: profile.personality,
      bio: profile.bio,
      preferred_surface: profile.preferred_surface,
    });

    if (error) {
      console.error('Supabase error:', error);
      alert('Something went wrong while saving.');
    } else {
      alert('✅ Profile saved!');
    }
  };

  const togglePlayFormat = (format: string) => {
    setProfile((prev) => {
      const exists = prev.play_format.includes(format);
      const updated = exists
        ? prev.play_format.filter((f) => f !== format)
        : [...prev.play_format, format];
      return { ...prev, play_format: updated };
    });
  };

  if (loading) return <p className="text-center mt-20">Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold mb-6 text-green-700">Your Profile</h1>

      <label className="block mb-2 font-semibold">Full Name</label>
      <input
        type="text"
        value={profile.full_name}
        onChange={(e) =>
          setProfile({ ...profile, full_name: e.target.value })
        }
        className="w-full border p-2 mb-4"
      />

      <label className="block mb-2 font-semibold">Skill Level</label>
      <select
        value={profile.skill_level}
        onChange={(e) =>
          setProfile({ ...profile, skill_level: e.target.value })
        }
        className="w-full border p-2 mb-4"
      >
        <option value="">Select Skill Level</option>
        {skillLevels.map((level) => (
          <option key={level} value={level}>{level}</option>
        ))}
      </select>

      <label className="block mb-2 font-semibold">Play Format</label>
      <div className="flex flex-wrap gap-2 mb-4">
        {playFormatOptions.map((format) => (
          <button
            type="button"
            key={format}
            onClick={() => togglePlayFormat(format)}
            className={`px-3 py-1 rounded-full border ${
              profile.play_format.includes(format)
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            {format}
          </button>
        ))}
      </div>

      <label className="block mb-2 font-semibold">Years of Experience</label>
      <input
        type="number"
        min={0}
        value={profile.experience_years}
        onChange={(e) =>
          setProfile({ ...profile, experience_years: e.target.value })
        }
        className="w-full border p-2 mb-4"
      />

      <label className="block mb-2 font-semibold">Personality</label>
      <select
        value={profile.personality}
        onChange={(e) =>
          setProfile({ ...profile, personality: e.target.value })
        }
        className="w-full border p-2 mb-4"
      >
        <option value="">Choose</option>
        {personalityOptions.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <label className="block mb-2 font-semibold">Preferred Court Surface</label>
      <select
        value={profile.preferred_surface}
        onChange={(e) =>
          setProfile({ ...profile, preferred_surface: e.target.value })
        }
        className="w-full border p-2 mb-4"
      >
        <option value="">Choose Surface</option>
        {surfaceOptions.map((surface) => (
          <option key={surface} value={surface}>{surface}</option>
        ))}
      </select>

      <label className="block mb-2 font-semibold">Bio</label>
      <textarea
        rows={3}
        value={profile.bio}
        onChange={(e) =>
          setProfile({ ...profile, bio: e.target.value })
        }
        className="w-full border p-2 mb-4"
      />

      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
      >
        Save Profile
      </button>
    </div>
  );
}
