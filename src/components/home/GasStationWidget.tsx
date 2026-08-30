'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Fuel, MapPin, ExternalLink, RefreshCw, Sparkles, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GasStationData {
  id: string;
  rotulo: string;
  direccion: string;
  municipio: string;
  provincia: string;
  precio95: number;
  precioDiesel: number;
  lat: number;
  lng: number;
}

export function GasStationWidget() {
  const [fuelType, setFuelType] = useState<'95' | 'diesel'>('95')
  const [top95, setTop95] = useState<GasStationData[]>([])
  const [topDiesel, setTopDiesel] = useState<GasStationData[]>([])
  const [updatedAt, setUpdatedAt] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function loadGasStations() {
      try {
        setLoading(true)
        const res = await fetch('/api/gasolineras')
        const data = await res.json()

        if (data.status === 'ok' && data.topGasolina95 && data.topDiesel) {
          setTop95(data.topGasolina95)
          setTopDiesel(data.topDiesel)
          setUpdatedAt(data.updatedAt || '')
        } else if (data.status === 'empty') {
          // DB not yet seeded – show empty state but no error
          setTop95([])
          setTopDiesel([])
        } else {
          setError(true)
        }
      } catch (e) {
        console.error('Error loading gas stations widget:', e)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    loadGasStations()
  }, [])

  const currentList = fuelType === '95' ? top95 : topDiesel

  return (
    <section className="py-16 px-4 relative z-10">
      <div className="container mx-auto">
        <div className="glass-card p-6 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-2">
                <Fuel className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-wider text-primary">Precios Oficiales de Hoy</span>
              </div>
              <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                Gasolineras más Económicas
                <span className="text-xs font-normal text-white/40 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 hidden sm:inline-block">
                  Islas Canarias 🇮🇨
                </span>
              </h3>
              <p className="text-xs md:text-sm text-white/40">
                Ahorra en cada repostaje antes de salir a la ruta. Actualizado diariamente.
              </p>
            </div>

            {/* Fuel Type Selector */}
            <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10 shrink-0 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setFuelType('95')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  fuelType === '95'
                    ? 'bg-primary text-black shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Gasolina 95
              </button>
              <button
                type="button"
                onClick={() => setFuelType('diesel')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  fuelType === 'diesel'
                    ? 'bg-primary text-black shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Diésel / Gasóleo
              </button>
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-44 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
              ))}
            </div>
          )}

          {/* Error fallback */}
          {!loading && error && (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center text-xs text-red-300">
              No se pudieron cargar los precios de las gasolineras hoy. Por favor, inténtalo más tarde.
            </div>
          )}

          {/* Gas Station Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentList.map((station, index) => {
                const price = fuelType === '95' ? station.precio95 : station.precioDiesel
                const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${station.rotulo} ${station.direccion} ${station.municipio}`
                )}`

                return (
                  <motion.div
                    key={station.id + index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-primary/40 rounded-2xl transition-all flex flex-col justify-between group relative overflow-hidden"
                  >
                    {/* Top Tag & Price */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-primary/20 text-primary border border-primary/30">
                          #{index + 1} Más Barata
                        </span>
                        <div className="text-right">
                          <span className="text-2xl font-black text-white tracking-tight group-hover:text-primary transition-colors">
                            {price.toFixed(3)}
                          </span>
                          <span className="text-[10px] font-bold text-white/50 ml-1">€/L</span>
                        </div>
                      </div>

                      {/* Station Name & Location */}
                      <div>
                        <h4 className="font-extrabold text-white text-base leading-tight group-hover:text-white transition-colors line-clamp-1">
                          {station.rotulo}
                        </h4>
                        <p className="text-xs text-white/50 font-medium mt-1 flex items-center gap-1 line-clamp-1">
                          <MapPin className="h-3 w-3 text-primary/70 shrink-0" />
                          {station.municipio}
                        </p>
                        <p className="text-[11px] text-white/30 line-clamp-1 mt-0.5 font-normal">
                          {station.direccion}
                        </p>
                      </div>
                    </div>

                    {/* How to Get There Action */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-white/40 uppercase font-semibold">Canarias</span>
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                      >
                        <Navigation className="h-3 w-3" />
                        Cómo llegar
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          {/* Footer note */}
          {!loading && updatedAt && (
            <div className="mt-6 text-right text-[10px] text-white/30 font-medium">
              Datos oficiales proporcionados por el MITECO • {updatedAt}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
