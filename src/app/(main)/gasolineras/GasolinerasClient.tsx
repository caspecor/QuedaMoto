'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Fuel, MapPin, Navigation, ExternalLink, SlidersHorizontal, ChevronDown, ChevronUp,
  ArrowLeft, Trophy, RefreshCw, Search, X, Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const ISLANDS = [
  'Gran Canaria',
  'Tenerife',
  'Lanzarote',
  'Fuerteventura',
  'La Palma',
  'La Gomera',
  'El Hierro',
]

const FUEL_TYPES = [
  { value: '95', label: 'Gasolina 95' },
  { value: 'diesel', label: 'Diésel' },
  { value: '98', label: 'Gasolina 98' },
]

interface Station {
  id: string
  rotulo: string
  direccion: string | null
  municipio: string | null
  provincia: string | null
  cp: string | null
  isla: string | null
  lat: number | null
  lng: number | null
  precio95: number | null
  precioDiesel: number | null
  precio98: number | null
  horario: string | null
}

export default function GasolinerasClient() {
  const [stations, setStations] = useState<Station[]>([])
  const [top4, setTop4] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatedAt, setUpdatedAt] = useState('')

  // Filters
  const [isla, setIsla] = useState('')
  const [fuelType, setFuelType] = useState<'95' | 'diesel' | '98'>('95')
  const [maxPrice, setMaxPrice] = useState('')
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Pagination
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const LIMIT = 20

  const buildQuery = useCallback((pg = 1) => {
    const params = new URLSearchParams()
    params.set('fuel', fuelType)
    params.set('page', String(pg))
    params.set('limit', String(LIMIT))
    if (isla) params.set('isla', isla)
    if (maxPrice) params.set('max', maxPrice)
    return `/api/gasolineras/all?${params.toString()}`
  }, [isla, fuelType, maxPrice])

  const buildTop4Query = useCallback(() => {
    const params = new URLSearchParams()
    params.set('fuel', fuelType)
    params.set('mode', 'top4')
    if (isla) params.set('isla', isla)
    return `/api/gasolineras/all?${params.toString()}`
  }, [isla, fuelType])

  // Load data when filters change
  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const [listRes, top4Res] = await Promise.all([
          fetch(buildQuery(1)),
          fetch(buildTop4Query()),
        ])
        if (!listRes.ok || !top4Res.ok) throw new Error('API error')

        const listData = await listRes.json()
        const top4Data = await top4Res.json()

        if (!cancelled) {
          setStations(listData.stations || [])
          setTop4(top4Data.stations || [])
          setHasMore(listData.hasMore || false)
          setUpdatedAt(listData.updatedAt || '')
          setPage(1)
        }
      } catch (e: any) {
        if (!cancelled) setError('No se pudieron cargar los datos.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [buildQuery, buildTop4Query])

  async function loadMore() {
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const res = await fetch(buildQuery(nextPage))
      const data = await res.json()
      setStations(prev => [...prev, ...(data.stations || [])])
      setHasMore(data.hasMore || false)
      setPage(nextPage)
    } catch {
      // silently fail on "load more"
    } finally {
      setLoadingMore(false)
    }
  }

  function getPrice(s: Station) {
    if (fuelType === 'diesel') return s.precioDiesel
    if (fuelType === '98') return s.precio98
    return s.precio95
  }

  function formatPrice(p: number | null) {
    if (!p) return '—'
    return `${p.toFixed(3)} €/L`
  }

  function mapLink(s: Station) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${s.rotulo} ${s.direccion || ''} ${s.municipio || ''}`
    )}`
  }

  // Client-side text search filter
  const filtered = search.trim()
    ? stations.filter(s =>
        s.rotulo.toLowerCase().includes(search.toLowerCase()) ||
        (s.municipio || '').toLowerCase().includes(search.toLowerCase()) ||
        (s.direccion || '').toLowerCase().includes(search.toLowerCase())
      )
    : stations

  return (
    <div className="min-h-screen bg-mesh pt-28 sm:pt-32 pb-16">
      <div className="container mx-auto px-3.5 sm:px-6 max-w-7xl">

        {/* Top Back Nav (Mobile only) & Header */}
        <div className="mb-6 sm:mb-10">
          <Link 
            href="/" 
            className="md:hidden inline-flex items-center gap-2 text-white/50 hover:text-white text-xs sm:text-sm mb-4 transition-colors py-1.5 px-3 rounded-xl bg-white/5 border border-white/10"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a inicio
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/15 border border-primary/30 rounded-full mb-2.5 shadow-[0_0_15px_rgba(255,77,0,0.2)] animate-pulse">
                <span className="text-xs">⛽</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                  Precios Oficiales de Hoy · MITECO
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
                Gasolineras <span className="text-primary italic">Canarias</span>
              </h1>
              <p className="mt-1.5 text-white/50 text-xs sm:text-base max-w-2xl">
                Encuentra el combustible más barato en las 7 islas antes de tu próxima ruta.
              </p>
            </div>
            {updatedAt && (
              <p className="text-[11px] text-white/30 shrink-0 self-start md:self-auto bg-black/30 px-2.5 py-1 rounded-lg border border-white/5">
                📅 Actualizado: {updatedAt}
              </p>
            )}
          </div>
        </div>

        {/* Quick Island Selector (Horizontal Scroll on Mobile) */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
            <button
              type="button"
              onClick={() => setIsla('')}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                isla === ''
                  ? 'bg-primary text-black border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                  : 'bg-white/5 text-white/70 border-white/10 hover:text-white hover:bg-white/10'
              }`}
            >
              🇮🇨 Todas las Islas
            </button>
            {ISLANDS.map((islandName) => (
              <button
                key={islandName}
                type="button"
                onClick={() => setIsla(islandName)}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  isla === islandName
                    ? 'bg-primary text-black border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'bg-white/5 text-white/70 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                {islandName}
              </button>
            ))}
          </div>
        </div>

        {/* Fuel Quick Switcher */}
        <div className="flex items-center justify-between gap-3 mb-6 bg-black/40 p-1.5 rounded-2xl border border-white/10 max-w-md">
          {FUEL_TYPES.map(ft => (
            <button
              key={ft.value}
              type="button"
              onClick={() => setFuelType(ft.value as any)}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                fuelType === ft.value
                  ? 'bg-primary text-black shadow-md scale-[1.01]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {ft.label}
            </button>
          ))}
        </div>

        {/* Top 4 Pinned Section */}
        {!loading && top4.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between gap-2 mb-3.5">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <Trophy className="h-3.5 w-3.5" />
                </div>
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                  Top 4 más económicas {isla ? `en ${isla}` : 'en Canarias'}
                </h2>
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                {FUEL_TYPES.find(f => f.value === fuelType)?.label}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {top4.map((s, i) => {
                const price = getPrice(s)
                return (
                  <motion.div
                    key={s.id + i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 bg-gradient-to-b from-primary/10 to-primary/5 border border-primary/30 rounded-2xl flex flex-col justify-between gap-3 shadow-lg relative overflow-hidden group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-black px-2 py-0.5 bg-primary text-black rounded-md shrink-0 shadow-sm">
                        #{i + 1} Más Barata
                      </span>
                      <div className="text-right">
                        <span className="text-2xl font-black text-white group-hover:text-primary transition-colors">
                          {price ? price.toFixed(3) : '—'}
                        </span>
                        <span className="text-[10px] font-bold text-white/50 ml-1">€/L</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-white text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {s.rotulo}
                      </h3>
                      <p className="text-xs text-white/60 flex items-center gap-1 mt-0.5 line-clamp-1">
                        <MapPin className="h-3 w-3 shrink-0 text-primary" />
                        {s.isla ? `${s.isla} · ` : ''}{s.municipio}
                      </p>
                      {s.direccion && (
                        <p className="text-[11px] text-white/35 line-clamp-1 mt-0.5">
                          {s.direccion}
                        </p>
                      )}
                    </div>

                    <a
                      href={mapLink(s)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-primary/20 hover:bg-primary text-primary hover:text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all mt-1"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      Cómo llegar (Google Maps)
                    </a>
                  </motion.div>
                )
              })}
            </div>
          </section>
        )}

        {/* Filters and Search Bar */}
        <div className="glass-card rounded-2xl border border-white/10 mb-6 overflow-hidden">
          <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="text"
                placeholder="Buscar por gasolinera o municipio (ej. Telde, Disa...)"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-8 bg-black/40 border-white/10 text-white text-xs sm:text-sm h-10 rounded-xl"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Toggle Advanced Filters Button */}
            <button
              type="button"
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center justify-center gap-2 px-4 h-10 text-xs font-bold rounded-xl border transition-all shrink-0 ${
                showFilters || maxPrice
                  ? 'bg-primary/20 border-primary/40 text-primary'
                  : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>{showFilters ? 'Ocultar Filtros' : 'Más Filtros'}</span>
              {maxPrice && (
                <span className="px-1.5 py-0.2 text-[9px] font-black bg-primary text-black rounded-full">
                  1
                </span>
              )}
              {showFilters ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-white/10 overflow-hidden"
              >
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Max Price Filter */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-white/50">
                      Precio máximo por litro (€/L)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="3"
                      step="0.01"
                      placeholder="Ej: 1.35"
                      value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                      className="bg-black/40 border-white/10 text-white h-10 rounded-xl"
                    />
                  </div>

                  {/* Island Select fallback */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-white/50">
                      Seleccionar Isla
                    </label>
                    <select
                      value={isla}
                      onChange={e => setIsla(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 h-10 text-xs sm:text-sm text-white focus:outline-none focus:border-primary/50"
                    >
                      <option value="">Todas las islas</option>
                      {ISLANDS.map(i => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {(isla || maxPrice || search) && (
                  <div className="px-4 pb-3.5 flex justify-end">
                    <button
                      type="button"
                      onClick={() => { setIsla(''); setMaxPrice(''); setSearch('') }}
                      className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
                    >
                      <X className="h-3 w-3" /> Limpiar todos los filtros
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center text-xs sm:text-sm text-red-300 mb-6">
            {error}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
            ))}
          </div>
        )}

        {/* Stations List */}
        {!loading && !error && (
          <>
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-xs text-white/50">
                Mostrando <span className="text-white font-bold">{filtered.length}</span> gasolineras
                {isla ? ` en ${isla}` : ' en Canarias'}
              </p>
            </div>

            {filtered.length === 0 && (
              <div className="py-16 text-center text-white/40 text-xs sm:text-sm bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                No se encontraron gasolineras con esos filtros. Prueba a cambiar la isla o el precio máximo.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filtered.map((s, i) => {
                const price = getPrice(s)
                const isTop4 = top4.some(t => t.id === s.id)
                return (
                  <motion.div
                    key={s.id + i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between gap-3 transition-all hover:border-primary/40 hover:bg-white/[0.05] ${
                      isTop4
                        ? 'bg-primary/[0.04] border-primary/25'
                        : 'bg-white/[0.02] border-white/8'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          {isTop4 && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 bg-primary text-black rounded">
                              TOP
                            </span>
                          )}
                          <span className="text-[10px] font-semibold text-white/50 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                            {s.isla || 'Canarias'}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-white text-sm sm:text-base leading-tight line-clamp-1">
                          {s.rotulo}
                        </h3>
                        <p className="text-xs text-white/50 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-primary/70 shrink-0" />
                          <span className="line-clamp-1">{s.municipio}{s.municipio && s.direccion ? ' · ' : ''}{s.direccion}</span>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className={`text-2xl font-black ${isTop4 ? 'text-primary' : 'text-white'}`}>
                          {price ? price.toFixed(3) : '—'}
                        </p>
                        {price && <p className="text-[10px] text-white/40 font-bold">€/L</p>}
                      </div>
                    </div>

                    {/* Secondary prices row */}
                    <div className="flex items-center gap-2.5 text-[11px] text-white/40 bg-black/20 p-2 rounded-xl border border-white/5 overflow-x-auto scrollbar-none">
                      {fuelType !== '95' && s.precio95 && (
                        <span className="shrink-0">G95: <strong className="text-white/70">{s.precio95.toFixed(3)}€</strong></span>
                      )}
                      {fuelType !== 'diesel' && s.precioDiesel && (
                        <span className="shrink-0">Diésel: <strong className="text-white/70">{s.precioDiesel.toFixed(3)}€</strong></span>
                      )}
                      {fuelType !== '98' && s.precio98 && (
                        <span className="shrink-0">98: <strong className="text-white/70">{s.precio98.toFixed(3)}€</strong></span>
                      )}
                    </div>

                    {/* Action button */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      {s.horario ? (
                        <p className="text-[10px] text-white/30 line-clamp-1 flex-1">{s.horario}</p>
                      ) : <span />}
                      <a
                        href={mapLink(s)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-black font-bold text-xs transition-all shrink-0 ml-2"
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

            {/* Load more button */}
            {hasMore && !search && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="w-full sm:w-auto h-12 px-8 rounded-xl border-white/20 text-white hover:bg-white/10 font-bold text-xs sm:text-sm"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" /> Cargando más gasolineras…
                    </span>
                  ) : 'Ver más gasolineras'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
