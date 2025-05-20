// src/reverseGeoCode.js
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'NextServe/1.0' } });
  const data = await res.json();
  return data.address?.city || data.address?.town || data.address?.village || null;
}

async function updateCourtsWithCity() {
  const { data: courts, error } = await supabase.from('courts').select('id, lat, lng');
  console.log('Number of courts fetched:', courts.length);
  if (error) throw error;

  for (const court of courts) {
    const city = await reverseGeocode(court.lat, court.lng);
    if (city) {
      const { error: updateError } = await supabase.from('courts').update({ city }).eq('id', court.id);
      if (updateError) {
        console.error(`Failed to update court ${court.id}:`, updateError);
      } else {
        console.log(`Updated court ${court.id} with city: ${city}`);
      }
    } else {
      console.log(`Could not find city for court ${court.id}`);
    }
    // To avoid rate limits
    await new Promise(res => setTimeout(res, 1200));
  }
}

updateCourtsWithCity().catch(console.error);