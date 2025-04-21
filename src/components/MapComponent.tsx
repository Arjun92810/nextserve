'use client';

import { Court } from '@/types/court';
import { FilterState } from '@/types/filters';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import the Map component with no SSR
const MapWithNoSSR = dynamic(
  () => import('./Map'),
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
    <div className="h-full w-full">
      <MapWithNoSSR 
        courts={courts}
        onCourtSelect={onSelectCourt}
        filters={filters}
      />
    </div>
  );
} 