'use client';

import { Court } from '@/types/court';
import { FilterState } from '@/types/filters';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-gray-600">Loading map...</div>
    </div>
  )
});

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
    <div className="w-full h-full">
      <LeafletMap 
        courts={courts}
        selectedCourt={selectedCourt}
        onSelectCourt={onSelectCourt}
        filters={filters}
      />
    </div>
  );
} 