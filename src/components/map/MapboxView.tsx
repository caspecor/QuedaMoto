'use client'

import React, { useState, useEffect, useRef } from 'react';

export interface MeetupPin {
  id: string;
  lat: number;
  lng: number;
  title: string;
}

function LeafletMapView({ meetups }: { meetups: MeetupPin[] }) {
  const [L, setL] = useState<any>(null);
  const [MapContainer, setMapContainer] = useState<any>(null);
  const [TileLayer, setTileLayer] = useState<any>(null);
  const [Marker, setMarker] = useState<any>(null);
  const [Popup, setPopup] = useState<any>(null);

  useEffect(() => {
    Promise.all([import('leaflet'), import('react-leaflet')]).then(([leaflet, rl]) => {
      setL(leaflet);
      setMapContainer(() => rl.MapContainer);
      setTileLayer(() => rl.TileLayer);
      setMarker(() => rl.Marker);
      setPopup(() => rl.Popup);
    });
  }, []);

  if (!L || !MapContainer) {
    return (
      <div className="w-full h-full bg-muted/20 animate-pulse flex items-center justify-center select-none">
        <span className="text-muted-foreground font-medium">Cargando mapa...</span>
      </div>
    );
  }

  const customIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const validMeetups = meetups.filter(m => m.lat && m.lng);
  // Center on the first meetup pin, or default to Canary Islands
  const center: [number, number] = validMeetups.length > 0
    ? [validMeetups[0].lat, validMeetups[0].lng]
    : [28.272336, -16.642513];
  const zoom = validMeetups.length > 0 ? 14 : 8;

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {validMeetups.map(m => (
          <Marker key={m.id} position={[m.lat, m.lng]} icon={customIcon}>
            <Popup>
              <div className="text-sm font-bold">{m.title}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export function MapboxView({ meetups }: { meetups: MeetupPin[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) {
    return (
      <div className="w-full h-full bg-muted/20 animate-pulse flex items-center justify-center select-none">
        <span className="text-muted-foreground font-medium">Cargando mapa...</span>
      </div>
    );
  }
  return <LeafletMapView meetups={meetups} />;
}
