'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Fuel, MapPin, Navigation, ExternalLink, SlidersHorizontal, ChevronDown, ChevronUp,
  ArrowLeft, Trophy, RefreshCw, Search, X
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
  const [showFilters, setShowFilters] = useState(true)

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
    <div className="min-h-screen bg-mesh pt-20">
      <div className="container mx-auto px-4 py-10 max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Volver a inicio
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-3">
                <Fuel className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                  Precios Oficiales · MITECO
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
                Gasolineras <span className="text-primary italic">Canarias</span>
              </h1>
              <p className="mt-2 text-white/40 text-sm md:text-base">
                Todas las gasolineras de las 7 islas, actualizadas diariamente
              </p>
            </div>
            {updatedAt && (
              <p className="text-[11px] text-white/30 shrink-0">
                Actualizado: {updatedAt}
              </p>
            )}
          </div>
        </div>

        {/* Top 4 pinned */}
        {!loading && top4.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-black uppercase tracking-widest text-white/70">
                Top 4 más baratas
                {isla ? ` en ${isla}` : ' en Canarias'}
                {' — '}{FUEL_TYPES.find(f => f.value === fuelType)?.label}
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {top4.map((s, i) => {
                const price = getPrice(s)
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 bg-primary/5 border border-primary/30 rounded-2xl flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-black px-2 py-0.5 bg-primary text-black rounded-md shrink-0">
                        #{i + 1}
                      </span>
                      <span className="text-xl font-black text-primary">{formatPrice(price)}</span>
                    </div>
                    <div>
                      <p className="font-extrabold text-white text-sm line-clamp-1">{s.rotulo}</p>
                      <p className="text-[11px] text-white/50 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0 text-primary/60" />
                        {s.isla || s.municipio}
                      </p>
                    </div>
                    <a
                      href={mapLink(s)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-primary/80 hover:text-primary flex items-center gap-1"
                    >
                      <Navigation className="h-3 w-3" /> Cómo llegar
                    </a>
                  </motion.div>
                )
              })}
            </div>
          </section>
        )}

        {/* Filter bar */}
        <div className="glass-card rounded-2xl border border-white/10 mb-6 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowFilters(v => !v)}
            className="flex items-center justify-between w-full px-5 py-4 text-sm font-bold text-white/70 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              Filtros
              {(isla || maxPrice) && (
                <span className="ml-1 px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-black rounded-full border border-primary/30">
                  activos
                </span>
              )}
            </span>
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-white/10 overflow-hidden"
              >
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Fuel type */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-white/50">Combustible</label>
                    <div className="flex gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
                      {FUEL_TYPES.map(ft => (
                        <button
                          key={ft.value}
                          type="button"
                          onClick={() => setFuelType(ft.value as any)}
                          className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                            fuelType === ft.value
                              ? 'bg-primary text-black shadow-sm'
                              : 'text-white/60 hover:text-white'
                          }`}
                        >
                          {ft.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Island */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-white/50">Isla</label>
                    <select
                      value={isla}
                      onChange={e => setIsla(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
                    >
                      <option value="">Todas las islas</option>
                      {ISLANDS.map(i => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>

                  {/* Max price */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-white/50">
                      Precio máximo (€/L)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="3"
                      step="0.01"
                      placeholder="Ej: 1.50"
                      value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                      className="bg-black/40 border-white/10 text-white"
                    />
                  </div>

                  {/* Text search */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-white/50">Buscar nombre / municipio</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                      <Input
                        type="text"
                        placeholder="Repsol, Telde…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-8 bg-black/40 border-white/10 text-white"
                      />
                      {search && (
                        <button
                          type="button"
                          onClick={() => setSearch('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Clear filters */}
                {(isla || maxPrice || search) && (
                  <div className="px-5 pb-4">
                    <button
                      type="button"
                      onClick={() => { setIsla(''); setMaxPrice(''); setSearch('') }}
                      className="text-xs text-white/40 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <X className="h-3 w-3" /> Limpiar filtros
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Station list */}
        {error && (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center text-sm text-red-300">
            {error}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-44 bg-white/5 animate-pulse rounded-2xl" />
            ))}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-white/40">
                Mostrando <span className="text-white font-bold">{filtered.length}</span> gasolineras
                {isla ? ` en ${isla}` : ' en Canarias'}
              </p>
            </div>

            {filtered.length === 0 && (
              <div className="py-20 text-center text-white/30 text-sm">
                No se encontraron gasolineras con esos filtros.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((s, i) => {
                const price = getPrice(s)
                const isTop4 = top4.some(t => t.id === s.id)
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.5) }}
                    className={`p-5 rounded-2xl border flex flex-col justify-between gap-3 transition-all hover:border-primary/40 hover:bg-white/[0.05] ${
                      isTop4
                        ? 'bg-primary/5 border-primary/20'
                        : 'bg-white/[0.02] border-white/8'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {isTop4 && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 bg-primary text-black rounded">
                              TOP
                            </span>
                          )}
                          <span className="text-[10px] font-semibold text-white/40 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                            {s.isla || 'Canarias'}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-white text-sm leading-tight line-clamp-1">
                          {s.rotulo}
                        </h3>
                        <p className="text-[11px] text-white/50 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-primary/60 shrink-0" />
                          <span className="line-clamp-1">{s.municipio}{s.municipio && s.direccion ? ' · ' : ''}{s.direccion}</span>
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-2xl font-black ${isTop4 ? 'text-primary' : 'text-white'}`}>
                          {price ? price.toFixed(3) : '—'}
                        </p>
                        {price && <p className="text-[10px] text-white/40">€/L</p>}
                      </div>
                    </div>

                    {/* Other prices */}
                    <div className="flex items-center gap-3 text-[11px] text-white/40">
                      {fuelType !== '95' && s.precio95 && (
                        <span>G95: <span className="text-white/60 font-semibold">{s.precio95.toFixed(3)}€</span></span>
                      )}
                      {fuelType !== 'diesel' && s.precioDiesel && (
                        <span>Diésel: <span className="text-white/60 font-semibold">{s.precioDiesel.toFixed(3)}€</span></span>
                      )}
                      {fuelType !== '98' && s.precio98 && (
                        <span>98: <span className="text-white/60 font-semibold">{s.precio98.toFixed(3)}€</span></span>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      {s.horario ? (
                        <p className="text-[10px] text-white/30 line-clamp-1 flex-1">{s.horario}</p>
                      ) : <span />}
                      <a
                        href={mapLink(s)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline ml-2 shrink-0"
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

            {/* Load more */}
            {hasMore && !search && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" /> Cargando…
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
