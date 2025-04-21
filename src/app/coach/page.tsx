'use client';

import { useState, useEffect } from 'react';
import CoachCard from '@/components/CoachCard';
import { useGoogleMapsScript, Libraries } from 'use-google-maps-script';
import { MapPinIcon } from '@heroicons/react/24/solid';

declare global {
  interface Window {
    google: {
      maps: {
        places: {
          PlacesService: new (element: Element) => {
            textSearch: (
              request: {
                query: string;
                type: string;
              },
              callback: (
                results: Array<{
                  name?: string;
                  photos?: Array<{ getUrl: () => string }>;
                  rating?: number;
                  user_ratings_total?: number;
                  formatted_address?: string;
                  opening_hours?: { isOpen: () => boolean };
                  formatted_phone_number?: string;
                }> | null,
                status: 'OK' | string
              ) => void
            ) => void;
          };
          PlacesServiceStatus: {
            OK: 'OK';
          };
        };
      };
    };
  }
}

const libraries: Libraries = ['places'];

interface CoachResult {
  name: string;
  photo: string;
  rating: number;
  reviews: number;
  address: string;
  isOpen?: boolean;
  phone?: string;
}

export default function CoachPage() {
  const [coaches, setCoaches] = useState<CoachResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('');
  const { isLoaded, loadError } = useGoogleMapsScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries,
  });

  const searchCoaches = async () => {
    if (!isLoaded) return;
    
    setLoading(true);
    setError(null);

    try {
      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );

      const searchQuery = location ? 
        `tennis coach ${location}` : 
        'tennis coach near me';

      const request = {
        query: searchQuery,
        type: 'business',
      };

      service.textSearch(
        request,
        (results, status) => {
          if (status === 'OK' && results) {
            const coachResults = results.map(result => ({
              name: result.name || 'Unknown Coach',
              photo: result.photos?.[0]?.getUrl() || '/default-coach.jpg',
              rating: result.rating || 0,
              reviews: result.user_ratings_total || 0,
              address: result.formatted_address || 'Address not available',
              isOpen: result.opening_hours?.isOpen(),
              phone: result.formatted_phone_number,
            }));
            setCoaches(coachResults);
          } else {
            setError('No results found. Please try a different location.');
          }
          setLoading(false);
        }
      );
    } catch (err) {
      setError('Error fetching results. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      searchCoaches();
    }
  }, [isLoaded]);

  if (loadError) {
    return <div className="text-center p-8 text-red-600">Error loading Google Maps</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2d321c] mb-4">Find Tennis Coaches Near You</h1>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter location (e.g., New York, NY)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93a048]"
            />
            <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={searchCoaches}
            className="bg-[#93a048] text-white px-6 py-2 rounded-lg hover:bg-[#7a843c] transition duration-300"
          >
            Search
          </button>
        </div>
      </div>

      {error && (
        <div className="text-center p-4 text-red-600 mb-8">{error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-t-lg"></div>
              <div className="bg-white p-4 rounded-b-lg">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coaches.map((coach, index) => (
            <CoachCard key={index} {...coach} />
          ))}
        </div>
      )}
    </div>
  );
} 