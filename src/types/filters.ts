export interface FilterState {
  query: string;
  surface: string[];
  type: string[];
  lighted: boolean | undefined;
  indoor: boolean | undefined;
  reservable: boolean | undefined;
} 