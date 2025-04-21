'use client';

import { Court } from '@/types/court';
import { FilterState } from '@/types/filters';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import react-leaflet components with no SSR
const MapWithNoSSR = dynamic(
  () => import('react-leaflet').then((mod) => {
    return { default: mod.MapContainer };
  }),
  { ssr: false }
);

interface MapComponentProps {
  courts?: Court[];
  selectedCourt: Court | null;
  onSelectCourt: (court: Court) => void;
  filters?: FilterState;
}

export default function MapComponent({ 
  courts = [], 
  selectedCourt, 
  onSelectCourt,
  filters
}: MapComponentProps) {
  return (
    <div style={{ height: '400px', width: '100%' }}>
      <MapWithNoSSR 
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%' }}
      >
        {/* TileLayer and Marker components will be rendered client-side only */}
      </MapWithNoSSR>
    </div>
  );
} 