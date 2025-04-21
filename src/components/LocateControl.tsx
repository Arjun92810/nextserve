'use client';

import { useMap } from 'react-leaflet';

export default function LocateControl() {
  const map = useMap();

  function handleLocate() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 14);
      },
      () => {
        alert('Unable to retrieve your location.');
      }
    );
  }

  return (
    <button
  onClick={handleLocate}
  className="fixed top-4 right-4 z-[9999] bg-white px-4 py-2 rounded shadow hover:bg-gray-100 text-sm"
>
  📍 Use My Location
</button>
    );
}
