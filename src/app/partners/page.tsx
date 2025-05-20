'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import ProfileCard from '@/components/ProfileCard';
import type { Profile } from '@/types/profile';
import { useCourts } from '@/hooks/useCourts';
import Select from 'react-select';

export default function PartnersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { courts } = useCourts();

  // Preferences state
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);
  const [radius, setRadius] = useState<number>(5); // in miles

  // Add city filter state
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Memoized list of unique cities from courts
  const cities = useMemo(() => {
    const citySet = new Set<string>();
    courts.forEach(court => {
      if (court.city) citySet.add(court.city);
    });
    return Array.from(citySet).sort();
  }, [courts]);

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

  // Haversine formula for distance in km
  function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Updated matching logic
  const matchedProfiles = profiles.filter(profile => {
    // Skill filter
    const skillOk = !selectedSkill || profile.skill_level === selectedSkill;

    // City filter
    let cityOk = true;
    if (selectedCity) {
      const profileCourt = courts.find(c => c.id === profile.preferred_court_id);
      cityOk = profileCourt?.city === selectedCity;
    }

    // Court filter
    let courtOk = true;
    if (selectedCourtId) {
      courtOk = profile.preferred_court_id === selectedCourtId;
    }

    // Location radius filter (only if court is selected)
    let radiusOk = true;
    if (selectedCourtId && radius) {
      const selectedCourt = courts.find(c => c.id === selectedCourtId);
      const profileCourt = courts.find(c => c.id === profile.preferred_court_id);
      if (selectedCourt && profileCourt) {
        const distance = getDistance(
          selectedCourt.lat, selectedCourt.lng,
          profileCourt.lat, profileCourt.lng
        );
        radiusOk = distance <= radius;
      }
    }

    // If city is selected, match by city; else if court is selected, match by court and radius; else show all
    if (selectedCity) {
      return skillOk && cityOk;
    } else if (selectedCourtId) {
      return skillOk && courtOk && radiusOk;
    } else {
      return skillOk;
    }
  });

  const courtOptions = courts
    .filter(court => court.name && /[a-zA-Z]/.test(court.name))
    .map(court => ({
      value: court.id,
      label: court.name
    }));

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Tennis Partners
          </h1>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            Find your tennis partner
          </p>
        </div>

        {/* Preferences UI */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-center">
          <select
            className="border rounded px-3 py-2"
            value={selectedSkill ?? ''}
            onChange={e => setSelectedSkill(e.target.value || null)}
          >
            <option value="">Any Skill</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <Select
            isDisabled={!!selectedCity}
            options={courtOptions}
            value={courtOptions.find(opt => opt.value === selectedCourtId) || null}
            onChange={opt => setSelectedCourtId(opt ? opt.value : null)}
            placeholder="Any Location"
            isClearable
            className="min-w-[200px]"
          />
         
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
              {matchedProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>

            {matchedProfiles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No partners found. Try adjusting your preferences!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 