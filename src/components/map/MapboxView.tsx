'use client'

import React, { useState, useEffect } from 'react';

export interface MeetupPin {
  id: string;
  lat: number | null;
  lng: number | null;
  title: string;
}

function LeafletMapView({ meetups }: { meetups: MeetupPin[] }) {
  const [L, setL] = useState<any>(null);
  const [MapContainer, setMapContainer] = useState<any>(null);
  const [TileLayer, setTileLayer] = useState<any>(null);
  const [Marker, setMarker] = useState<any>(null);
  const [Popup, setPopup] = useState<any>(null);
  const [useMap, setUseMap] = useState<any>(null);

  useEffect(() => {
    Promise.all([import('leaflet'), import('react-leaflet')]).then(([leaflet, rl]) => {
      setL(leaflet);
      setMapContainer(() => rl.MapContainer);
      setTileLayer(() => rl.TileLayer);
      setMarker(() => rl.Marker);
      setPopup(() => rl.Popup);
      setUseMap(() => rl.useMap);
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

  const validMeetups = meetups.filter(m => 
    m.lat !== null && m.lng !== null && 
    m.lat !== 0 && m.lng !== 0
  );

  const hasLocation = validMeetups.length > 0;
  const center: [number, number] = hasLocation
    ? [validMeetups[0].lat!, validMeetups[0].lng!]
    : [28.3, -16.0];
  
  const zoom = hasLocation ? 7 : 6;

  function MapResizer() {
    const map = useMap();
    
    useEffect(() => {
      const handleResize = () => {
        map.invalidateSize();
      };

      const timers = [50, 250, 500, 1000].map(delay => 
        setTimeout(() => map.invalidateSize(), delay)
      );

      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        timers.forEach(t => clearTimeout(t));
      };
    }, [map]);
    
    return null;
  }

  return (
    <div className="w-full h-full relative border-r border-border/10">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
      >
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapResizer />
        {validMeetups.map(m => (
          <Marker key={m.id} position={[m.lat!, m.lng!]} icon={customIcon}>
            <Popup>
              <div className="text-sm font-bold">{m.title}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {!hasLocation && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-warning/90 backdrop-blur-sm text-warning-foreground px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 border border-warning/50">
          <span>⚠️ Ubicación no especificada con exactitud en el mapa</span>
        </div>
      )}
    </div>
  );
}

export function MapboxView({ meetups }: { meetups: MeetupPin[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  
  if (!mounted) {
    return (
      <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center select-none">
        <span className="text-muted-foreground/50 font-medium">Iniciando...</span>
      </div>
    );
  }
  
  return <LeafletMapView meetups={meetups} />;
}