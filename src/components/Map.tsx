'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Court } from '@/types/court';
import type { FilterState } from '@/types/filters';

interface MapProps {
  courts: Court[];
  onCourtSelect?: (court: Court) => void;
  filters?: FilterState;
}

export default function Map({ courts, onCourtSelect, filters }: MapProps) {
  // Initialize Leaflet default icon
  useEffect(() => {
    const IconDefault = L.Icon.Default as any;
    delete IconDefault.prototype._getIconUrl;
    IconDefault.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  // Filter courts based on search query and filters
  const filteredCourts = useMemo(() => {
    if (!filters) return courts;
    
    return courts.filter(court => {
      // Search query filter
      if (filters.query && filters.query.trim() !== '') {
        const query = filters.query.toLowerCase();
        const nameMatch = court.name.toLowerCase().includes(query);
        const descriptionMatch = court.description?.toLowerCase().includes(query) || false;
        
        if (!nameMatch && !descriptionMatch) {
          return false;
        }
      }
      
      // Surface filter
      if (filters.surface && filters.surface.length > 0 && court.surface) {
        if (!filters.surface.includes(court.surface)) {
          return false;
        }
      }
      
      // Type filter
      if (filters.type && filters.type.length > 0 && court.type) {
        if (!filters.type.includes(court.type)) {
          return false;
        }
      }
      
      // Lighted filter
      if (filters.lighted !== undefined && court.lighted !== undefined) {
        if (court.lighted !== filters.lighted) {
          return false;
        }
      }
      
      // Indoor filter
      if (filters.indoor !== undefined && court.indoor !== undefined) {
        if (court.indoor !== filters.indoor) {
          return false;
        }
      }
      
      // Reservable filter
      if (filters.reservable !== undefined && court.reservable !== undefined) {
        if (court.reservable !== filters.reservable) {
          return false;
        }
      }
      
      return true;
    });
  }, [courts, filters]);

  return (
    <>
      <MapContainer 
        center={[40.73, -74.06]} // Jersey City coordinates
        zoom={13} 
        scrollWheelZoom={true} 
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filteredCourts.map((court) => (
          <Marker
            key={court.id}
            position={[court.lat, court.lng]}
            eventHandlers={{
              click: () => onCourtSelect?.(court),
            }}
          >
            <Tooltip>
              <div>
                <strong>{court.name}</strong><br />
                {court.description}
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
      <style jsx global>{`
        .leaflet-container {
          height: 100%;
          width: 100%;
        }
      `}</style>
    </>
  );
} 