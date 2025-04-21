export interface Court {
    id: string;
    name: string;
    lat: number;
    lng: number;
    description: string;
    contact: string;
    surface?: string;
    type?: string;
    lighted?: boolean;
    indoor?: boolean;
    reservable?: boolean;
    hours?: string;
  }
  