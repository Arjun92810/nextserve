'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

type Profile = {
  id: string;
  full_name: string;
  avatar_url: string;
  website: string;
  updated_at: string;
  play_style: string;
  availability: string;
  preferred_format: string;
  preferred_surface: string;
  school: string;
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Partial<Profile>>({
    full_name: '',
    website: '',
    play_style: '',
    availability: '',
    preferred_format: '',
    preferred_surface: '',
    school: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const router = useRouter();

  // Fetch profile data
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    async function getProfile() {
      try {
        setIsLoading(true);
        if (!user?.id) {
          throw new Error('User ID not found');
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          // If profile doesn't exist, create a new one
          if (error.code === 'PGRST116') {
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([
                { 
                  id: user.id,
                  full_name: '',
                  website: '',
                  play_style: '',
                  availability: '',
                  preferred_format: '',
                  preferred_surface: '',
                  school: '',
                  updated_at: new Date().toISOString()
                }
              ])
              .select()
              .single();
              
            if (createError) throw createError;
            if (newProfile) {
              setProfile({
                full_name: newProfile.full_name || '',
                website: newProfile.website || '',
                play_style: newProfile.play_style || '',
                availability: newProfile.availability || '',
                preferred_format: newProfile.preferred_format || '',
                preferred_surface: newProfile.preferred_surface || '',
                school: newProfile.school || '',
              });
            }
          } else {
            throw error;
          }
        } else if (data) {
          setProfile({
            full_name: data.full_name || '',
            website: data.website || '',
            play_style: data.play_style || '',
            availability: data.availability || '',
            preferred_format: data.preferred_format || '',
            preferred_surface: data.preferred_surface || '',
            school: data.school || '',
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      getProfile();
    }
  }, [user, loading, router]);

  const handleSave = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profile?.full_name?.trim() || '',
          website: profile?.website?.trim() || '',
          play_style: profile?.play_style?.trim() || '',
          availability: profile?.availability?.trim() || '',
          preferred_format: profile?.preferred_format?.trim() || '',
          preferred_surface: profile?.preferred_surface?.trim() || '',
          school: profile?.school?.trim() || '',
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setSuccess('Profile updated successfully');
      setHasUnsavedChanges(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-blue-600">
            <h3 className="text-lg leading-6 font-medium text-white">Profile</h3>
            <p className="mt-1 max-w-2xl text-sm text-blue-100">
              Update your profile information
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6 p-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={user?.email || ''}
                readOnly
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-700 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">Your email cannot be changed</p>
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                id="full_name"
                value={profile.full_name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="url"
                name="website"
                id="website"
                value={profile.website}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="play_style" className="block text-sm font-medium text-gray-700">
                Play Style
              </label>
              <input
                type="text"
                name="play_style"
                id="play_style"
                value={profile.play_style}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                Availability
              </label>
              <input
                type="text"
                name="availability"
                id="availability"
                value={profile.availability}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="preferred_format" className="block text-sm font-medium text-gray-700">
                Preferred Format
              </label>
              <input
                type="text"
                name="preferred_format"
                id="preferred_format"
                value={profile.preferred_format}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="preferred_surface" className="block text-sm font-medium text-gray-700">
                Preferred Surface
              </label>
              <input
                type="text"
                name="preferred_surface"
                id="preferred_surface"
                value={profile.preferred_surface}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="school" className="block text-sm font-medium text-gray-700">
                School
              </label>
              <input
                type="text"
                name="school"
                id="school"
                value={profile.school}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              {hasUnsavedChanges && (
                <span className="inline-flex items-center px-4 py-2 text-sm text-amber-600">
                  You have unsaved changes
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={isSaving || !hasUnsavedChanges}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  hasUnsavedChanges
                    ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 