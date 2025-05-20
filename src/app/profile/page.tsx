'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useCourts } from '@/hooks/useCourts';
import Select from 'react-select';

const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'USTA 3.0', 'USTA 3.5', 'USTA 4.0+'];
const playFormatOptions = ['Singles', 'Doubles', 'Mixed', 'Rallying', 'Practice'];
const personalityOptions = ['Chill', 'Competitive', 'Social', 'Quiet'];
const surfaceOptions = ['Hard', 'Clay', 'Grass', 'Any'];

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { courts } = useCourts();
  const [profile, setProfile] = useState<{
    full_name: string;
    skill_level: string;
    play_format: string[];
    experience_years: string;
    personality: string;
    bio: string;
    preferred_surface: string;
    preferred_court_id: string;
  }>({
    full_name: '',
    skill_level: '',
    play_format: [],
    experience_years: '',
    personality: '',
    bio: '',
    preferred_surface: '',
    preferred_court_id: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const router = useRouter();

  const courtOptions = courts
    .filter(court => court.name && /[a-zA-Z]/.test(court.name))
    .map(court => ({
      value: court.id,
      label: court.name
    }));

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    async function getProfile() {
      try {
        setIsLoading(true);
        if (!user?.id) throw new Error('User ID not found');
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (error && error.code !== 'PGRST116') throw error;
        if (data) {
          setProfile({
            full_name: data.full_name || '',
            skill_level: data.skill_level || '',
            play_format: data.play_format ? data.play_format.split(',') : [],
            experience_years: data.experience_years?.toString() || '',
            personality: data.personality || '',
            bio: data.bio || '',
            preferred_surface: data.preferred_surface || '',
            preferred_court_id: data.preferred_court_id || '',
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    if (user) getProfile();
  }, [user, loading, router]);

  const handleSave = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: profile.full_name.trim(),
        skill_level: profile.skill_level,
        play_format: profile.play_format.join(','),
        experience_years: profile.experience_years ? parseInt(profile.experience_years) : null,
        personality: profile.personality,
        bio: profile.bio,
        preferred_surface: profile.preferred_surface,
        preferred_court_id: profile.preferred_court_id || null,
      });
      if (error) throw error;
      setSuccess('Profile updated successfully');
      setHasUnsavedChanges(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    setHasUnsavedChanges(true);
  };

  const togglePlayFormat = (format: string) => {
    setProfile(prev => {
      const exists = prev.play_format.includes(format);
      const updated = exists
        ? prev.play_format.filter((f: string) => f !== format)
        : [...prev.play_format, format];
      return { ...prev, play_format: updated };
    });
    setHasUnsavedChanges(true);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6 text-green-700">Your Profile</h1>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}
        <label className="block mb-2 font-semibold">Full Name</label>
        <input
          type="text"
          name="full_name"
          value={profile.full_name}
          onChange={handleChange}
          className="w-full border p-2 mb-4"
        />
        <label className="block mb-2 font-semibold">Skill Level</label>
        <select
          name="skill_level"
          value={profile.skill_level}
          onChange={handleChange}
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
          name="experience_years"
          value={profile.experience_years}
          onChange={handleChange}
          className="w-full border p-2 mb-4"
        />
        <label className="block mb-2 font-semibold">Personality</label>
        <select
          name="personality"
          value={profile.personality}
          onChange={handleChange}
          className="w-full border p-2 mb-4"
        >
          <option value="">Choose</option>
          {personalityOptions.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <label className="block mb-2 font-semibold">Preferred Court Surface</label>
        <select
          name="preferred_surface"
          value={profile.preferred_surface}
          onChange={handleChange}
          className="w-full border p-2 mb-4"
        >
          <option value="">Choose Surface</option>
          {surfaceOptions.map((surface) => (
            <option key={surface} value={surface}>{surface}</option>
          ))}
        </select>
        <label className="block mb-2 font-semibold">Preferred Court</label>
        <Select
          options={courtOptions}
          value={courtOptions.find(opt => opt.value === profile.preferred_court_id) || null}
          onChange={opt => {
            setProfile(prev => ({ ...prev, preferred_court_id: opt ? opt.value : '' }));
            setHasUnsavedChanges(true);
          }}
          placeholder="Select Preferred Court"
          isClearable
          className="mb-4 min-w-[200px]"
        />
        <label className="block mb-2 font-semibold">Bio</label>
        <textarea
          name="bio"
          rows={3}
          value={profile.bio}
          onChange={handleChange}
          className="w-full border p-2 mb-4"
        />
        <button
          onClick={handleSave}
          disabled={isSaving || !hasUnsavedChanges}
          className={`bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition ${
            isSaving || !hasUnsavedChanges ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
} 