'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const useMapEvents = dynamic(() => import('react-leaflet').then(mod => mod.useMapEvents), { ssr: false });

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  defaultLat?: number;
  defaultLng?: number;
}

function LocationMarker({ onLocationSelect, position }: { onLocationSelect: (lat: number, lng: number) => void, position: [number, number] | null }) {
  const map = (require('react-leaflet') as any).useMapEvents({
    click(e: any) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

// Since useMapEvents needs to be a result of a hook call within MapContainer, 
// and we are using dynamic imports, let's restructure slightly for reliability.

export function MapPicker({ onLocationSelect, defaultLat = 28.272336, defaultLng = -16.642513 }: MapPickerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [L, setL] = useState<any>(null);
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    setIsMounted(true);
    import('leaflet').then(leaflet => {
      setL(leaflet);
    });
  }, []);

  if (!isMounted || !L) return <div className="h-64 bg-muted animate-pulse rounded-xl" />;

  const customIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Helper component to handle clicks
  const MapEvents = () => {
    const { useMapEvents: useMapEventsHook } = require('react-leaflet');
    useMapEventsHook({
      click(e: any) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  return (
    <div className="h-64 w-full rounded-xl overflow-hidden border border-border shadow-inner relative z-0">
      {/* @ts-ignore */}
      <MapContainer 
        center={[defaultLat, defaultLng]} 
        zoom={10} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapEvents />
        {position && <Marker position={position} icon={customIcon} />}
      </MapContainer>
      <div className="absolute bottom-2 left-2 z-[1000] bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase border border-border/50">
        Haz click para marcar el punto
      </div>
    </div>
  );
}
