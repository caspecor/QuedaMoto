import React from 'react'
import { Fuel, MapPin, Navigation, ExternalLink, Star, Compass, Zap } from 'lucide-react'
import { db } from '@/db'
import { gasolinerasCanarias } from '@/db/schema'
import { isNotNull } from 'drizzle-orm'

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export interface MeetupGasStationItem {
  id: string
  rotulo: string
  direccion: string | null
  municipio: string | null
  provincia: string | null
  isla: string | null
  lat: number | null
  lng: number | null
  precio95: number | null
  precioDiesel: number | null
  distanceKm: number
}

export async function MeetupGasStations({ lat, lng }: { lat: number | null | undefined; lng: number | null | undefined }) {
  if (!lat || !lng) return null

  let closest: MeetupGasStationItem | null = null
  let cheapest: MeetupGasStationItem | null = null

  try {
    const all = await db
      .select()
      .from(gasolinerasCanarias)
      .where(isNotNull(gasolinerasCanarias.precio95))

    if (!all || all.length === 0) return null

    const valid = all
      .filter(s => s.lat && s.lng)
      .map(s => ({
        id: s.id,
        rotulo: s.rotulo,
        direccion: s.direccion,
        municipio: s.municipio,
        provincia: s.provincia,
        isla: s.isla,
        lat: s.lat,
        lng: s.lng,
        precio95: s.precio95,
        precioDiesel: s.precioDiesel,
        distanceKm: getDistanceKm(lat, lng, s.lat!, s.lng!),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)

    if (valid.length === 0) return null

    // 1. Closest station to meetup start point
    closest = valid[0]

    // 2. Cheapest station within a reasonable radius (closest 30 stations or ~25km)
    const nearby = valid.slice(0, 30)
    const sortedByPrice = [...nearby].sort(
      (a, b) => (a.precio95 ?? 99) - (b.precio95 ?? 99)
    )

    cheapest = sortedByPrice[0]

    // If cheapest is the exact same station as closest, try to pick the 2nd cheapest nearby if available
    const isSame = cheapest.id === closest.id
    if (isSame && sortedByPrice.length > 1) {
      // If there's another option with different distance, we can show it as an alternative or show both badges on one card
    }
  } catch (err) {
    console.error('Error fetching gas stations for meetup:', err)
    return null
  }

  if (!closest) return null

  const isSameStation = cheapest && closest.id === cheapest.id
  const stationsToShow = isSameStation
    ? [{ ...closest, isClosest: true, isCheapest: true }]
    : [
        { ...closest, isClosest: true, isCheapest: false },
        { ...cheapest!, isClosest: false, isCheapest: true },
      ]

  return (
    <div className="space-y-4 animate-reveal [animation-delay:0.25s]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
            <Fuel className="h-3.5 w-3.5" />
          </div>
          <h3 className="font-black text-xs uppercase tracking-widest text-white/70">
            Repostaje antes de la ruta
          </h3>
        </div>
        <span className="text-[10px] text-white/40 font-medium hidden sm:inline">
          Precios actualizados MITECO
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {stationsToShow.map((station, idx) => {
          const isRecommended = station.isCheapest
          const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${station.rotulo} ${station.direccion || ''} ${station.municipio || ''}`
          )}`

          return (
            <div
              key={station.id + idx}
              className={`p-4 sm:p-5 rounded-3xl border flex flex-col justify-between gap-3 transition-all relative overflow-hidden ${
                isRecommended
                  ? 'bg-gradient-to-b from-primary/15 via-primary/5 to-transparent border-primary/40 shadow-lg shadow-primary/5'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between gap-2">
                {isRecommended ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary text-black font-black text-[10px] uppercase tracking-wider shadow-sm">
                    <Star className="h-3 w-3 fill-black text-black" />
                    <span>Recomendada · Más Barata</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white font-black text-[10px] uppercase tracking-wider border border-white/10">
                    <Compass className="h-3 w-3 text-primary" />
                    <span>Más Cercana a la Salida</span>
                  </div>
                )}

                <span className="text-[11px] font-bold text-white/50 bg-black/40 px-2 py-0.5 rounded-lg border border-white/5 shrink-0">
                  {station.distanceKm < 1
                    ? `${Math.round(station.distanceKm * 1000)} m`
                    : `${station.distanceKm.toFixed(1)} km`}
                </span>
              </div>

              {/* Station info */}
              <div>
                <h4 className="font-extrabold text-white text-base leading-tight line-clamp-1">
                  {station.rotulo}
                </h4>
                <p className="text-xs text-white/50 flex items-center gap-1 mt-0.5 line-clamp-1">
                  <MapPin className="h-3 w-3 text-primary/70 shrink-0" />
                  <span>
                    {station.municipio}
                    {station.direccion ? ` · ${station.direccion}` : ''}
                  </span>
                </p>
              </div>

              {/* Prices breakdown */}
              <div className="flex items-baseline justify-between pt-2 border-t border-white/5">
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase font-black tracking-wider text-white/40">
                    Gasolina 95
                  </p>
                  <p className={`text-2xl font-black ${isRecommended ? 'text-primary' : 'text-white'}`}>
                    {station.precio95 ? station.precio95.toFixed(3) : '—'}
                    <span className="text-[10px] font-bold text-white/40 ml-1">€/L</span>
                  </p>
                </div>

                {station.precioDiesel && (
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-black tracking-wider text-white/40">
                      Diésel
                    </p>
                    <p className="text-sm font-bold text-white/70">
                      {station.precioDiesel.toFixed(3)}
                      <span className="text-[10px] font-normal text-white/40 ml-0.5">€/L</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all mt-1 ${
                  isRecommended
                    ? 'bg-primary hover:bg-primary/90 text-black shadow-md shadow-primary/20'
                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                }`}
              >
                <Navigation className="h-3.5 w-3.5" />
                Cómo llegar (Google Maps)
                <ExternalLink className="h-3 w-3 opacity-60 ml-0.5" />
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}
