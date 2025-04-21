import { importCourts } from '@/utils/import-courts';

const courtsData = [
  {
    id: '019fd6ea-a608-4ea0-b2dc-1276d36c4d25',
    name: 'Overpeck County Park Tennis Courts',
    lat: 40.8647,
    lng: -74.006,
    description: '10 courts • Spacious • Bergen County park',
    contact: 'co.bergen.nj.us'
  },
  {
    id: '043a87e0-ec32-4522-b7fe-9a63f88acb3e',
    name: 'North Bergen Tennis Courts',
    lat: 40.8041,
    lng: -74.0131,
    description: '4 public courts • Recently resurfaced',
    contact: 'northbergen.org'
  },
  {
    id: '202cca32-876e-4b23-a7d2-80a1e504bf05',
    name: 'Stevens Institute Tennis Courts',
    lat: 40.744,
    lng: -74.0256,
    description: '6 courts • Private • Students only',
    contact: 'stevens.edu'
  },
  // Add the rest of the courts from your dashboard...
];

async function importAllCourts() {
  try {
    const result = await importCourts(courtsData);
    console.log(`Successfully imported ${result.length} courts`);
  } catch (error) {
    console.error('Failed to import courts:', error);
  }
}

// Only run if this file is being executed directly
if (require.main === module) {
  importAllCourts();
} 