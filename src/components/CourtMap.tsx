'use client';
import { useEffect, useMemo, useState, ComponentType } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
} from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import { supabase } from '../lib/supabase';
import LocateControl from './LocateControl';
import CourtDetailsPanel from './CourtDetailsPanel';
import CourtFilters from './CourtFilters';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import type { MapComponentProps } from '@/types/court';
import type { ReactNode } from 'react';
import type { CourtDetailsPanelProps } from '@/types/map';
import type { FC } from 'react';
import { Court } from '@/types/court';
import { FilterState } from '@/types/filters';

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div className="h-[600px] bg-gray-100 animate-pulse" />
});

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function FlyToLocation({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 14);
  }, [lat, lng, map]);
  return null;
}

interface CourtMapProps {
  initialFilters?: FilterState;
  searchQuery?: string;
}

const CourtMap: FC<CourtMapProps> = ({ initialFilters, searchQuery = '' }) => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilters || {
    query: searchQuery,
    surface: [],
    type: [],
    lighted: undefined,
    indoor: undefined,
    reservable: undefined
  });
  const [showFilters, setShowFilters] = useState(false);

  // Update filters when searchQuery changes
  useEffect(() => {
    if (searchQuery !== undefined) {
      setFilters(prev => ({ ...prev, query: searchQuery }));
    }
  }, [searchQuery]);

  useEffect(() => {
    async function fetchCourts() {
      try {
        const { data, error } = await supabase
          .from('courts')
          .select('*');

        if (error) throw error;
        setCourts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch courts');
      } finally {
        setLoading(false);
      }
    }

    fetchCourts();
  }, []);

  const handleSelectCourt = (court: Court) => {
    setSelectedCourt(court);
  };

  const handleCloseDetails = () => {
    setSelectedCourt(null);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  if (loading) {
    return <div className="h-[600px] bg-gray-100 animate-pulse" />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="relative h-[600px]">
      <MapComponent
        courts={courts}
        selectedCourt={selectedCourt}
        onSelectCourt={handleSelectCourt}
        filters={filters}
      />
      
      {/* Filters Toggle Button */}
      <button 
        onClick={toggleFilters}
        className="absolute top-4 right-4 z-10 bg-white p-2 rounded-md shadow-md hover:bg-gray-100"
        title={showFilters ? "Hide Filters" : "Show Filters"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      </button>
      
      {/* Filters Overlay */}
      {showFilters && (
        <div className="absolute top-16 right-4 z-10 w-80 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
            <h3 className="font-bold">Filters</h3>
            <button onClick={toggleFilters} className="text-white hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="p-4 max-h-[400px] overflow-y-auto">
            <CourtFilters 
              filters={filters} 
              onFilterChange={handleFilterChange} 
            />
          </div>
        </div>
      )}
      
      {/* Court Details Panel */}
      {selectedCourt && (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-white shadow-lg">
          <CourtDetailsPanel 
            court={selectedCourt} 
            onClose={handleCloseDetails}
          />
        </div>
      )}
    </div>
  );
};

export default CourtMap;
