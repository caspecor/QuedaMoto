'use client'

import React, { useState, useEffect } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

export interface MeetupPin {
  id: string;
  lat: number;
  lng: number;
  title: string;
}

export function MapboxView({ meetups }: { meetups: MeetupPin[] }) {
  const [viewState, setViewState] = useState({
    longitude: -16.642513, // Canary Islands
    latitude: 28.272336,
    zoom: 7
  });
  
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-muted/20 animate-pulse flex items-center justify-center select-none">
        <span className="text-muted-foreground font-medium">Cargando mapa...</span>
      </div>
    );
  }

  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      style={{ width: '100%', height: '100%' }}
    >
      <NavigationControl position="bottom-right" />
      {meetups.filter(m => m.lng && m.lat).map(m => (
        <Marker key={m.id} longitude={m.lng} latitude={m.lat} color="#f97316" anchor="bottom" />
      ))}
    </Map>
  );
}
