import { supabase } from '@/lib/supabase';
import type { Court, CreateCourtInput } from '@/types/court';

interface RawCourtData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  contact: string;
}

export async function importCourts(courts: RawCourtData[]) {
  const processedCourts = courts.map(court => {
    // Extract features from description
    const description = court.description;
    
    // Parse common features from description
    const isLighted = description.toLowerCase().includes('lighting') || description.toLowerCase().includes('lighted');
    const isIndoor = description.toLowerCase().includes('indoor');
    const isReservable = description.toLowerCase().includes('reservation') || description.toLowerCase().includes('reservable');
    
    // Try to extract surface type
    let surface = null;
    if (description.toLowerCase().includes('hard court')) surface = 'hard';
    else if (description.toLowerCase().includes('clay')) surface = 'clay';
    else if (description.toLowerCase().includes('grass')) surface = 'grass';
    
    // Try to extract court type
    let type = 'public';
    if (description.toLowerCase().includes('private')) type = 'private';
    else if (description.toLowerCase().includes('school')) type = 'school';
    
    return {
      id: court.id,
      name: court.name,
      lat: court.lat,
      lng: court.lng,
      description: court.description,
      contact: court.contact,
      surface,
      type,
      lighted: isLighted,
      indoor: isIndoor,
      reservable: isReservable
    };
  });

  const { data, error } = await supabase
    .from('courts')
    .upsert(processedCourts, {
      onConflict: 'id'
    })
    .select();

  if (error) {
    throw new Error(`Failed to import courts: ${error.message}`);
  }

  return data;
}

export async function importCourtFromRow(row: any): Promise<CreateCourtInput> {
  return {
    name: row.name,
    lat: parseFloat(row.lat),
    lng: parseFloat(row.lng),
    description: row.description || '',
    contact: row.contact || '',
    surface: row.surface || null,
    type: row.type || 'public',
    lighted: row.lighted === 'true' || row.description.toLowerCase().includes('lighting'),
    indoor: row.indoor === 'true' || row.description.toLowerCase().includes('indoor'),
    reservable: row.reservable === 'true' || row.description.toLowerCase().includes('reservation')
  };
}

export function validateCourtRow(row: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!row.name) errors.push('Name is required');
  if (!row.lat || isNaN(parseFloat(row.lat))) errors.push('Valid latitude is required');
  if (!row.lng || isNaN(parseFloat(row.lng))) errors.push('Valid longitude is required');

  const lat = parseFloat(row.lat);
  const lng = parseFloat(row.lng);

  if (lat < -90 || lat > 90) errors.push('Latitude must be between -90 and 90');
  if (lng < -180 || lng > 180) errors.push('Longitude must be between -180 and 180');

  return {
    isValid: errors.length === 0,
    errors
  };
} 