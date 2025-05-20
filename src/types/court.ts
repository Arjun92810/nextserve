import { Dispatch, SetStateAction } from 'react';

export interface Court {
  id: string;
  name: string;
  lat: number;
  lng: number;
  city?: string;
  description?: string;
  surface?: string;
  type?: string;
  hours?: string;
  contact?: string;
  lighted?: boolean;
  indoor?: boolean;
  reservable?: boolean;
}

export interface FilterState {
  surface: string[];
  type: string[];
  lighted: boolean | null;
  indoor: boolean | null;
  reservable: boolean | null;
}

export interface MapComponentProps {
  courts: Court[];
  selectedCourt: Court | null;
  onSelectCourt: Dispatch<SetStateAction<Court | null>>;
  filters: {
    search: string;
    surface: string;
    type: string;
    lighted: boolean;
    indoor: boolean;
    reservable: boolean;
  };
}

export interface CourtDetailsPanelProps {
  court: Court;
  onClose: () => void;
}

export interface CourtFiltersProps {
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
}

// Helper type for creating a new court
export type CreateCourtInput = Omit<Court, 'id'>;

// Helper type for updating an existing court
export type UpdateCourtInput = Partial<CreateCourtInput>; 