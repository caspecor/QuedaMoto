'use client'

import React, { useState, useEffect } from 'react';
import { getPublicMeetups } from '@/app/(main)/meetups/actions';
import { MapboxView } from '@/components/map/MapboxView';

export function HomepageMap() {
  const [meetups, setMeetups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getPublicMeetups();
      setMeetups(res.meetups || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-center animate-pulse">
        <span className="text-white/20 font-bold uppercase tracking-widest text-[10px]">Cargando mapa...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/5 shadow-2xl group">
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-tr from-background via-transparent to-transparent opacity-60" />
      <MapboxView meetups={meetups} />
      
      {/* Overlay info */}
      <div className="absolute top-4 right-4 z-[9999] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 pointer-events-none">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] font-bold text-white uppercase tracking-wider">{meetups.length} Rutas en vivo</span>
      </div>
    </div>
  );
}
