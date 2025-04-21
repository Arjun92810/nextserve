import { Court } from './court';

export interface FilterState {
  query: string;
  surface: string[];
  type: string[];
  lighted: boolean | undefined;
  indoor: boolean | undefined;
  reservable: boolean | undefined;
}

export interface MapFilters {
  search: string;
  surface: string;
  type: string;
  lighted: boolean;
  indoor: boolean;
  reservable: boolean;
}

export interface MapComponentProps {
  courts: Court[];
  selectedCourt: Court | null;
  onSelectCourt: (court: Court) => void;
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
  court: {
    id: string;
    name: string;
    description?: string;
    surface?: string;
    type?: string;
    hours?: string;
    contact?: string;
    lighted?: boolean;
    indoor?: boolean;
    reservable?: boolean;
  };
  onClose: () => void;
} 