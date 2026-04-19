'use client'

import React, { useState, useEffect } from 'react';

export interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  defaultLat?: number;
  defaultLng?: number;
}

// Inner map component, only rendered client-side
function LeafletMapPicker({ onLocationSelect, defaultLat, defaultLng }: MapPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [L, setL] = useState<any>(null);
  const [MapContainer, setMapContainer] = useState<any>(null);
  const [TileLayer, setTileLayer] = useState<any>(null);
  const [Marker, setMarker] = useState<any>(null);
  const [useMapEvents, setUseMapEvents] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      import('leaflet'),
      import('react-leaflet'),
    ]).then(([leaflet, reactLeaflet]) => {
      setL(leaflet);
      setMapContainer(() => reactLeaflet.MapContainer);
      setTileLayer(() => reactLeaflet.TileLayer);
      setMarker(() => reactLeaflet.Marker);
      setUseMapEvents(() => reactLeaflet.useMapEvents);
    });
  }, []);

  if (!L || !MapContainer) {
    return <div className="h-64 bg-muted animate-pulse rounded-xl flex items-center justify-center text-muted-foreground text-sm">Cargando mapa...</div>;
  }

  const customIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  function MapEvents() {
    useMapEvents({
      click(e: any) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  return (
    <div className="h-64 w-full rounded-xl overflow-hidden border border-border shadow-inner relative">
      <MapContainer
        center={[defaultLat ?? 28.272336, defaultLng ?? -16.642513]}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapEvents />
        {position && <Marker position={position} icon={customIcon} />}
      </MapContainer>
      <div className="absolute bottom-2 left-2 z-[1000] bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase border border-border/50 pointer-events-none">
        Haz click para marcar el punto
      </div>
    </div>
  );
}

export function MapPicker(props: MapPickerProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="h-64 bg-muted animate-pulse rounded-xl" />;
  return <LeafletMapPicker {...props} />;
}
