'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/profile';
import type { User } from '@supabase/supabase-js';

type NotificationType = {
  type: 'success' | 'error';
  message: string;
} | null;

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<NotificationType>(null);
  const [profile, setProfile] = useState<Partial<Profile>>({
    full_name: '',
    availability: '',
    play_style: '',
    skill_level: '',
    play_format: '',
    experience_years: null,
    preferred_surface: '',
    bio: '',
  });

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }
        setUser(user);

        // Fetch existing profile if it exists
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
          setNotification({
            type: 'error',
            message: 'Error loading profile. Please refresh the page.'
          });
        }

        if (data) {
          setProfile(data);
        }
      } catch (err: any) {
        console.error('Error:', err);
        setNotification({
          type: 'error',
          message: 'Error loading profile. Please refresh the page.'
        });
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    try {
      if (!user) throw new Error('No user found');

      const profileData = {
        id: user.id,
        full_name: profile.full_name,
        availability: profile.availability,
        play_style: profile.play_style,
        skill_level: profile.skill_level,
        play_format: profile.play_format,
        experience_years: profile.experience_years,
        preferred_surface: profile.preferred_surface,
        bio: profile.bio,
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (error) throw error;

      setNotification({
        type: 'success',
        message: 'Profile updated successfully!'
      });
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setNotification({
        type: 'error',
        message: 'Error updating profile. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Your Tennis Profile
            </h3>

            {notification && (
              <div className={`mt-4 p-4 rounded-md ${
                notification.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {notification.message}
              </div>
            )}

            <div className="mt-5">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    id="full_name"
                    value={profile.full_name || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="skill_level" className="block text-sm font-medium text-gray-700">
                    Skill Level
                  </label>
                  <select
                    id="skill_level"
                    name="skill_level"
                    value={profile.skill_level || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="play_style" className="block text-sm font-medium text-gray-700">
                    Play Style
                  </label>
                  <select
                    id="play_style"
                    name="play_style"
                    value={profile.play_style || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select style</option>
                    <option value="Aggressive Baseliner">Aggressive Baseliner</option>
                    <option value="Counter Puncher">Counter Puncher</option>
                    <option value="Serve and Volley">Serve and Volley</option>
                    <option value="All Court">All Court</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="play_format" className="block text-sm font-medium text-gray-700">
                    Preferred Format
                  </label>
                  <select
                    id="play_format"
                    name="play_format"
                    value={profile.play_format || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select format</option>
                    <option value="Singles">Singles</option>
                    <option value="Doubles">Doubles</option>
                    <option value="Both">Both</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                    Availability
                  </label>
                  <input
                    type="text"
                    name="availability"
                    id="availability"
                    placeholder="e.g., Weekends 9am-5pm"
                    value={profile.availability || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="preferred_surface" className="block text-sm font-medium text-gray-700">
                    Preferred Surface
                  </label>
                  <select
                    id="preferred_surface"
                    name="preferred_surface"
                    value={profile.preferred_surface || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select surface</option>
                    <option value="Hard">Hard</option>
                    <option value="Clay">Clay</option>
                    <option value="Grass">Grass</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    placeholder="Tell others about yourself..."
                    value={profile.bio || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 