'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Court } from '@/types/court';

interface MapProps {
  courts: Court[];
  onCourtSelect?: (court: Court) => void;
}

export default function Map({ courts, onCourtSelect }: MapProps) {
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
        {courts.map((court) => (
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