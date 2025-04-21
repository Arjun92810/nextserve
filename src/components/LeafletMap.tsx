'use client';

import { useEffect, useRef, useState } from 'react';
import { Court } from '@/types/court';
import { FilterState } from '@/types/filters';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Jersey City coordinates
const JERSEY_CITY_COORDS = {
  lat: 40.7178,
  lng: -74.0431
};

// Default zoom level for Jersey City
const DEFAULT_ZOOM = 15;

interface LeafletMapProps {
  courts?: Court[];
  selectedCourt: Court | null;
  onSelectCourt: (court: Court) => void;
  filters?: FilterState;
}

export default function LeafletMap({ 
  courts = [], 
  selectedCourt, 
  onSelectCourt, 
  filters = {
    query: '',
    surface: [],
    type: [],
    lighted: undefined,
    indoor: undefined,
    reservable: undefined
  }
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapReady, setMapReady] = useState(false);
  const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Function to get user's location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userLatLng = L.latLng(latitude, longitude);
        setUserLocation(userLatLng);
        
        // Add a marker for user's location
        if (mapRef.current) {
          // Remove previous user location marker if it exists
          const userMarker = markersRef.current.find(m => m.options.title === 'Your Location');
          if (userMarker) {
            userMarker.remove();
          }
          
          // Add new user location marker
          const newUserMarker = L.marker(userLatLng, {
            icon: L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
              iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            }),
            title: 'Your Location'
          }).addTo(mapRef.current);
          
          newUserMarker.bindPopup('<div class="p-2"><h3 class="font-bold">Your Location</h3></div>');
          markersRef.current.push(newUserMarker);
          
          // Find nearest court
          findNearestCourt(userLatLng);
        }
      },
      (error) => {
        setLocationError("Unable to retrieve your location: " + error.message);
      }
    );
  };

  // Function to find the nearest court
  const findNearestCourt = (userLatLng: L.LatLng) => {
    if (!courts.length) return;
    
    let nearestCourt = courts[0];
    let shortestDistance = userLatLng.distanceTo([nearestCourt.lat, nearestCourt.lng]);
    
    courts.forEach(court => {
      const distance = userLatLng.distanceTo([court.lat, court.lng]);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestCourt = court;
      }
    });
    
    // Center map on nearest court
    if (mapRef.current) {
      mapRef.current.setView([nearestCourt.lat, nearestCourt.lng], DEFAULT_ZOOM);
      onSelectCourt(nearestCourt);
    }
  };

  useEffect(() => {
    // Only run this effect on the client side
    if (typeof window === 'undefined') return;
    
    const mapContainer = mapContainerRef.current;
    if (!mapContainer) return;

    // Fix Leaflet marker icons
    const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png';
    const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
    const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';

    // Clean up existing map instance
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Initialize new map instance centered on Jersey City with closer zoom
    mapRef.current = L.map(mapContainer).setView([JERSEY_CITY_COORDS.lat, JERSEY_CITY_COORDS.lng], DEFAULT_ZOOM);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current);

    // Add a marker for Jersey City center
    const cityMarker = L.marker([JERSEY_CITY_COORDS.lat, JERSEY_CITY_COORDS.lng], {
      icon: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    }).addTo(mapRef.current);
    
    cityMarker.bindPopup('<div class="p-2"><h3 class="font-bold">Jersey City</h3><p>Center of the map</p></div>');

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Filter courts based on criteria
    const filteredCourts = courts.filter(court => {
      // Search filter
      const matchesSearch = !filters.query || 
        court.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        (court.description && court.description.toLowerCase().includes(filters.query.toLowerCase()));
      
      // Surface filter - check if court surface is in the selected surfaces array
      const matchesSurface = filters.surface.length === 0 || 
        (court.surface && filters.surface.includes(court.surface.toLowerCase()));
      
      // Type filter - check if court type is in the selected types array
      const matchesType = filters.type.length === 0 || 
        (court.type && filters.type.includes(court.type.toLowerCase()));
      
      // Boolean filters
      const matchesLighted = filters.lighted === undefined || 
        (court.lighted !== undefined && court.lighted === filters.lighted);
      
      const matchesIndoor = filters.indoor === undefined || 
        (court.indoor !== undefined && court.indoor === filters.indoor);
      
      const matchesReservable = filters.reservable === undefined || 
        (court.reservable !== undefined && court.reservable === filters.reservable);

      return matchesSearch && matchesSurface && matchesType && 
             matchesLighted && matchesIndoor && matchesReservable;
    });

    // Add markers for filtered courts
    const bounds = L.latLngBounds([]);
    filteredCourts.forEach(court => {
      const marker = L.marker([court.lat, court.lng], {
        icon: L.icon({
          iconUrl,
          iconRetinaUrl,
          shadowUrl,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      }).addTo(mapRef.current!);

      // Create tooltip content with basic info
      const tooltipContent = `
        <div class="p-1">
          <h3 class="font-bold">${court.name}</h3>
          ${court.surface ? `<p>Surface: ${court.surface}</p>` : ''}
          ${court.type ? `<p>Type: ${court.type}</p>` : ''}
        </div>
      `;
      
      // Add tooltip to marker
      marker.bindTooltip(tooltipContent, {
        direction: 'top',
        offset: L.point(0, -20),
        className: 'court-tooltip'
      });

      // Create popup content with full details
      const popupContent = `
        <div class="p-2">
          <h3 class="font-bold">${court.name}</h3>
          ${court.description ? `<p>${court.description}</p>` : ''}
          ${court.surface ? `<p>Surface: ${court.surface}</p>` : ''}
          ${court.type ? `<p>Type: ${court.type}</p>` : ''}
          ${court.lighted !== undefined ? `<p>Lighted: ${court.lighted ? 'Yes' : 'No'}</p>` : ''}
          ${court.indoor !== undefined ? `<p>Indoor: ${court.indoor ? 'Yes' : 'No'}</p>` : ''}
          ${court.reservable !== undefined ? `<p>Reservable: ${court.reservable ? 'Yes' : 'No'}</p>` : ''}
        </div>
      `;

      marker.bindPopup(popupContent);

      if (selectedCourt?.id === court.id) {
        marker.setIcon(L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        }));
      }

      marker.on('click', () => onSelectCourt(court));
      markersRef.current.push(marker);
      bounds.extend([court.lat, court.lng]);
    });

    // Handle zooming based on filtered courts
    if (filteredCourts.length > 0) {
      // If we have courts, fit to their bounds but ensure we don't zoom out too far
      mapRef.current.fitBounds(bounds, { 
        padding: [50, 50],
        maxZoom: DEFAULT_ZOOM // Don't zoom out beyond our default zoom level
      });
    } else {
      // If no courts, always center on Jersey City with our default zoom
      mapRef.current.setView([JERSEY_CITY_COORDS.lat, JERSEY_CITY_COORDS.lng], DEFAULT_ZOOM);
    }
    
    // Add a button to reset the view to Jersey City
    const resetButton = L.Control.extend({
      options: {
        position: 'bottomright'
      },
      
      onAdd: function() {
        const div = L.DomUtil.create('div', 'leaflet-control leaflet-bar');
        div.innerHTML = '<a href="#" title="Reset to Jersey City" style="font-size: 18px; font-weight: bold;">JC</a>';
        div.onclick = function() {
          mapRef.current?.setView([JERSEY_CITY_COORDS.lat, JERSEY_CITY_COORDS.lng], DEFAULT_ZOOM);
          return false;
        };
        return div;
      }
    });
    
    new resetButton().addTo(mapRef.current);
    
    // Add a button to find nearest court
    const findNearestButton = L.Control.extend({
      options: {
        position: 'bottomright'
      },
      
      onAdd: function() {
        const div = L.DomUtil.create('div', 'leaflet-control leaflet-bar');
        div.innerHTML = '<a href="#" title="Find Nearest Court" style="font-size: 18px; font-weight: bold;">📍</a>';
        div.onclick = function() {
          getUserLocation();
          return false;
        };
        return div;
      }
    });
    
    new findNearestButton().addTo(mapRef.current);
    
    // Mark the map as ready
    setMapReady(true);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [courts, selectedCourt, onSelectCourt, filters]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full relative"
      style={{ zIndex: mapReady ? 1 : 0 }} 
    />
  );
} 