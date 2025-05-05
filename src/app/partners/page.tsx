'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ProfileCard from '@/components/ProfileCard';
import type { Profile } from '@/types/profile';

export default function PartnersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        console.log('Fetching profiles...');
        
        // Query all fields that match our Profile type
        const { data, error, count } = await supabase
          .from('profiles')
          .select(`
            id,
            full_name,
            availability,
            play_style,
            skill_level,
            play_format,
            preferred_surface,
            bio,
            created_at,
            experience_years,
            preferred_court_id,
            availability_json,
            personality
          `, { count: 'exact' })
          .order('created_at', { ascending: false });

        console.log('Query response:', {
          count,
          error,
          data: data ? data.map(p => ({
            id: p.id,
            name: p.full_name,
            style: p.play_style
          })) : null
        });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (!data) {
          console.log('No data returned from query');
          setProfiles([]);
          return;
        }

        console.log('Profiles fetched successfully:', {
          count: data.length,
          profiles: data
        });

        // Cast the data to Profile[] since we know it matches our type
        setProfiles(data as Profile[]);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Failed to load profiles. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchProfiles();
  }, []);

  // Log current state
  console.log('Current state:', { profiles, loading, error });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Members
          </h1>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            Find your perfect tennis partner in Jersey City
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading partners...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>

            {profiles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No partners found. Be the first to join!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 