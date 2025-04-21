import type { Court, CreateCourtInput } from '@/types/court';

export function validateCourtData(court: Partial<Court>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!court.name?.trim()) {
    errors.push('Court name is required');
  }

  if (typeof court.lat !== 'number' || isNaN(court.lat)) {
    errors.push('Valid latitude is required');
  } else if (court.lat < -90 || court.lat > 90) {
    errors.push('Latitude must be between -90 and 90');
  }

  if (typeof court.lng !== 'number' || isNaN(court.lng)) {
    errors.push('Valid longitude is required');
  } else if (court.lng < -180 || court.lng > 180) {
    errors.push('Longitude must be between -180 and 180');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function formatCourtDescription(description: string): string {
  const features = description.split('•').map(feature => feature.trim()).filter(Boolean);
  return features.join(' • ');
}

export function parseCourtFeatures(description: string): string[] {
  return description.split('•').map(feature => feature.trim()).filter(Boolean);
}

export function createCourtInput(data: Partial<CreateCourtInput>): CreateCourtInput {
  return {
    name: data.name || '',
    lat: Number(data.lat) || 0,
    lng: Number(data.lng) || 0,
    description: data.description || '',
    contact: data.contact || ''
  };
}

export function isValidCourtLocation(lat: number, lng: number): boolean {
  return (
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
} 