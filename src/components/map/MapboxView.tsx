'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamic import for Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export interface MeetupPin {
  id: string;
  lat: number;
  lng: number;
  title: string;
}

export function MapboxView({ meetups }: { meetups: MeetupPin[] }) {
  const [isMounted, setIsMounted] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    // Import Leaflet dynamically to access its L object (for icons)
    import('leaflet').then(leaflet => {
      setL(leaflet);
    });
  }, []);

  if (!isMounted || !L) {
    return (
      <div className="w-full h-full bg-muted/20 animate-pulse flex items-center justify-center select-none">
        <span className="text-muted-foreground font-medium">Cargando mapa...</span>
      </div>
    );
  }

  // Custom icon for a premium look (using standard Leaflet markers with an orange filter or a custom SVG)
  const customIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="w-full h-full relative">
      {/* @ts-ignore - Dynamic components sometimes have type mismatches in Next.js */}
      <MapContainer 
        center={[28.272336, -16.642513]} 
        zoom={7} 
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        {/* Dark Mode tiles from CartoDB - No Card Required */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {meetups.filter(m => m.lng && m.lat).map(m => (
          /* @ts-ignore */
          <Marker 
            key={m.id} 
            position={[m.lat, m.lng]} 
            icon={customIcon}
          >
            <Popup>
              <div className="text-sm font-bold">{m.title}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
