'use client'

import React, { useState, useEffect, useRef } from 'react';

export interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  externalPosition?: [number, number] | null; // driven from parent (geocoding / GPS)
  defaultLat?: number;
  defaultLng?: number;
}

function LeafletMapPicker({ onLocationSelect, externalPosition, defaultLat, defaultLng }: MapPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(externalPosition ?? null);
  const [L, setL] = useState<any>(null);
  const [MapContainer, setMapContainer] = useState<any>(null);
  const [TileLayer, setTileLayer] = useState<any>(null);
  const [Marker, setMarker] = useState<any>(null);
  const [useMapEvents, setUseMapEvents] = useState<any>(null);
  const [useMap, setUseMap] = useState<any>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    Promise.all([import('leaflet'), import('react-leaflet')]).then(([leaflet, rl]) => {
      setL(leaflet);
      setMapContainer(() => rl.MapContainer);
      setTileLayer(() => rl.TileLayer);
      setMarker(() => rl.Marker);
      setUseMapEvents(() => rl.useMapEvents);
      setUseMap(() => rl.useMap);
    });
  }, []);

  // Sync external position (geocoding / GPS) to internal state + fly map
  useEffect(() => {
    if (!externalPosition) return;
    setPosition(externalPosition);
    if (mapRef.current) {
      mapRef.current.flyTo(externalPosition, 15, { duration: 1 });
    }
  }, [externalPosition]);

  if (!L || !MapContainer) {
    return (
      <div className="h-72 bg-muted animate-pulse rounded-xl flex items-center justify-center text-muted-foreground text-sm">
        Cargando mapa...
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

  // Helper to capture map instance and handle clicks
  function MapController() {
    const map = useMap();
    mapRef.current = map;
    useMapEvents({
      click(e: any) {
        const latlng: [number, number] = [e.latlng.lat, e.latlng.lng];
        setPosition(latlng);
        onLocationSelect(latlng[0], latlng[1]);
      },
    });
    return null;
  }

  return (
    <div className="h-72 w-full rounded-xl overflow-hidden border border-border shadow-inner relative">
      <MapContainer
        center={position ?? [defaultLat ?? 28.272336, defaultLng ?? -16.642513]}
        zoom={position ? 15 : 10}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapController />
        {position && <Marker position={position} icon={customIcon} />}
      </MapContainer>
      <div className="absolute bottom-2 left-2 z-[1000] bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase border border-border/50 pointer-events-none">
        {position ? '📍 Marcado' : 'Haz click para marcar el punto'}
      </div>
    </div>
  );
}

export function MapPicker(props: MapPickerProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="h-72 bg-muted animate-pulse rounded-xl" />;
  return <LeafletMapPicker {...props} />;
}
