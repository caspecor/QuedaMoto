'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { createMeetupAction } from '@/app/(main)/meetups/actions'
import { toast } from 'sonner'
import { Loader2, MapPin, Navigation, Search, Check, Lock, RefreshCw, X, AlertCircle } from 'lucide-react'
import { MapPicker } from '@/components/map/MapPicker'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const createSchema = z.object({
  title: z.string().min(5, 'Mínimo 5 caracteres'),
  description: z.string().min(10, 'Mínimo 10 caracteres'),
  type: z.enum(['route', 'coffee', 'breakfast', 'trip', 'night', 'offroad']),
  date: z.string().min(1, 'La fecha es obligatoria'),
  time: z.string().min(1, 'La hora es obligatoria'),
  max_attendees: z.string().min(1, 'Requerido'),
  address: z.string().min(5, 'Requerido'),
  address_notes: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  visibility: z.enum(['public', 'private']),
  level_required: z.enum(['Principiante', 'Intermedio', 'Avanzado']),
})

type CreateFormValues = z.infer<typeof createSchema>

interface Suggestion {
  display_name: string;
  lat: number;
  lon: number;
}

export function CreateMeetupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGeolocating, setIsGeolocating] = useState(false)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [showLocationHelp, setShowLocationHelp] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [mapPosition, setMapPosition] = useState<[number, number] | null>(null)
  const geocodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateFormValues>({
    resolver: zodResolver(createSchema) as any,
    defaultValues: {
      visibility: 'public',
      level_required: 'Principiante',
      type: 'route',
    }
  })

  const addressValue = watch('address')
  const visibilityValue = watch('visibility') || 'public'

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Geocode search via backend API route
  async function searchLocation(query: string, isManualSearch = false) {
    if (!query || query.trim().length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      if (isManualSearch) {
        toast.error('Escribe una dirección válida antes de buscar')
      }
      return
    }
    setIsGeocoding(true)
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        const formattedSuggestions: Suggestion[] = data.map((item: any) => ({
          display_name: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
        }))
        setSuggestions(formattedSuggestions)
        setShowSuggestions(true)

        // Automatically position map on first result
        const top = formattedSuggestions[0]
        setMapPosition([top.lat, top.lon])
        setValue('lat', top.lat)
        setValue('lng', top.lon)

        if (isManualSearch) {
          toast.success('Ubicación localizada en el mapa')
        }
      } else {
        setSuggestions([])
        if (isManualSearch) {
          toast.error('No se encontró esa ubicación. Intenta hacer clic directamente en el mapa.')
        }
      }
    } catch (e) {
      console.error('Geocoding error:', e)
      if (isManualSearch) {
        toast.error('Error al consultar la dirección.')
      }
    } finally {
      setIsGeocoding(false)
    }
  }

  // Reverse geocode via backend API route when map pin is clicked or dragged
  async function reverseGeocode(lat: number, lng: number) {
    try {
      const res = await fetch(`/api/reverse-geocode?lat=${lat}&lon=${lng}`)
      const data = await res.json()
      if (data && data.display_name) {
        setValue('address', data.display_name, { shouldValidate: true })
      }
    } catch (e) {
      console.error('Reverse geocoding error:', e)
    }
  }

  // Debounced input handler
  function handleAddressInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setValue('address', value, { shouldValidate: true })
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current)
    geocodeTimer.current = setTimeout(() => searchLocation(value), 600)
  }

  // Prevent form submit on Enter key inside address input
  function handleAddressKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      searchLocation(addressValue || '', true)
    }
  }

  function handleSelectSuggestion(s: Suggestion) {
    setValue('address', s.display_name, { shouldValidate: true })
    setMapPosition([s.lat, s.lon])
    setValue('lat', s.lat)
    setValue('lng', s.lon)
    setShowSuggestions(false)
    toast.success('Punto marcado en el mapa')
  }

  // Use browser GPS
  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      toast.error('Tu navegador no soporta la geolocalización')
      return
    }
    setIsGeolocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setMapPosition([lat, lng])
        setValue('lat', lat)
        setValue('lng', lng)
        reverseGeocode(lat, lng)
        toast.success('Ubicación actual marcada en el mapa')
        setIsGeolocating(false)
        setShowLocationHelp(false)
      },
      (err) => {
        setIsGeolocating(false)
        if (err.code === 1) {
          // PERMISSION_DENIED
          setShowLocationHelp(true)
        } else if (err.code === 2) {
          // POSITION_UNAVAILABLE
          toast.error('Ubicación no disponible en este dispositivo. Comprueba si el GPS o la ubicación de tu sistema están activados.')
        } else if (err.code === 3) {
          // TIMEOUT
          toast.error('Tiempo de espera agotado buscando tu señal GPS. Inténtalo de nuevo.')
        } else {
          toast.error('No se pudo obtener tu ubicación. Comprueba los permisos del navegador.')
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    )
  }

  async function onSubmit(data: CreateFormValues) {
    setIsLoading(true)
    try {
      const response = await createMeetupAction(data)
      
      if (response.error) {
        toast.error(response.error)
        return
      }

      toast.success('Ruta creada con éxito')
      
      setTimeout(() => {
        window.location.href = `/meetups/${response.meetupId}`
      }, 500)
    } catch (error: any) {
      toast.error(error.message || 'Error al crear la quedada')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border/50 bg-card shadow-sm p-4">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" placeholder="Ej: Ruta por la cumbre..." {...register('title')} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input id="description" placeholder="Detalles, ritmo, paradas..." {...register('description')} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" type="date" {...register('date')} />
              {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <Input id="time" type="time" {...register('time')} />
              {errors.time && <p className="text-xs text-destructive">{errors.time.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Quedada</Label>
              <Select onValueChange={(val) => setValue('type', val as any)} defaultValue="route">
                <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="route">Ruta</SelectItem>
                  <SelectItem value="coffee">Café en ruta</SelectItem>
                  <SelectItem value="breakfast">Desayuno</SelectItem>
                  <SelectItem value="night">Ruta Nocturna</SelectItem>
                  <SelectItem value="offroad">Off-Road / Trail</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nivel Requerido</Label>
              <Select onValueChange={(val) => setValue('level_required', val as any)} defaultValue="Principiante">
                <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Principiante">Principiante</SelectItem>
                  <SelectItem value="Intermedio">Intermedio</SelectItem>
                  <SelectItem value="Avanzado">Avanzado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_attendees">Límite Mínimo/Máximo Plazas</Label>
            <Input id="max_attendees" type="number" placeholder="10" {...register('max_attendees')} />
            {errors.max_attendees && <p className="text-xs text-destructive">{errors.max_attendees.message}</p>}
          </div>

          {/* Visibilidad de la Quedada */}
          <div className="space-y-3">
            <Label className="text-sm font-bold flex items-center gap-1.5">
              <span>Visibilidad de la Quedada</span>
              <span className="text-xs font-normal text-muted-foreground">(Elige quién puede unirse)</span>
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Opción Pública */}
              <button
                type="button"
                onClick={() => setValue('visibility', 'public', { shouldValidate: true })}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2.5 relative cursor-pointer ${
                  visibilityValue === 'public'
                    ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10 ring-1 ring-primary'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌐</span>
                    <span className="font-extrabold text-sm text-white">Quedada Pública</span>
                  </div>
                  {visibilityValue === 'public' && (
                    <span className="h-5 w-5 rounded-full bg-primary text-black flex items-center justify-center text-xs font-black">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  Visible en la web. <strong>Cualquier usuario</strong> puede ver la ruta y unirse libremente.
                </p>
              </button>

              {/* Opción Privada */}
              <button
                type="button"
                onClick={() => setValue('visibility', 'private', { shouldValidate: true })}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2.5 relative cursor-pointer ${
                  visibilityValue === 'private'
                    ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔒</span>
                    <span className="font-extrabold text-sm text-white">Quedada Privada</span>
                  </div>
                  {visibilityValue === 'private' && (
                    <span className="h-5 w-5 rounded-full bg-amber-500 text-black flex items-center justify-center text-xs font-black">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  Visible en la web, pero <strong>solo con enlace de WhatsApp</strong> podrán apuntarse y acceder al chat.
                </p>
              </button>
            </div>
            {visibilityValue === 'private' && (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-start gap-2.5 animate-reveal">
                <span className="text-base leading-none">💡</span>
                <span>
                  Al publicar, se generará tu <strong>enlace de invitación único</strong> para que lo compartas directamente por WhatsApp con tu grupo.
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2 relative" ref={dropdownRef}>
              <Label htmlFor="address">Punto de Encuentro (Dirección)</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="address"
                    placeholder="Ej: Alcampo Telde, Gasolinera X..."
                    value={addressValue || ''}
                    onChange={handleAddressInputChange}
                    onKeyDown={handleAddressKeyDown}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => searchLocation(addressValue || '', true)}
                  disabled={isGeocoding}
                  className="shrink-0 flex items-center gap-1.5"
                >
                  {isGeocoding ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <Search className="h-4 w-4 text-primary" />
                  )}
                  Buscar en mapa
                </Button>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-popover border border-border rounded-xl shadow-xl z-[2000] overflow-hidden max-h-60 overflow-y-auto divide-y divide-border/50">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSuggestion(s)}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-accent hover:text-accent-foreground transition-colors flex items-start gap-2"
                    >
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span className="line-clamp-2 leading-relaxed">{s.display_name}</span>
                    </button>
                  ))}
                </div>
              )}

              {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
              <p className="text-xs text-muted-foreground">
                Escribe una dirección y pulsa <strong>Buscar en mapa</strong> o presiona <strong>Enter</strong>.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Ubicación en mapa</Label>
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  disabled={isGeolocating}
                  className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-semibold transition-colors disabled:opacity-50"
                >
                  {isGeolocating
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <Navigation className="h-3.5 w-3.5" />
                  }
                  {isGeolocating ? 'Obteniendo ubicación...' : 'Usar mi ubicación actual'}
                </button>
              </div>

              <MapPicker
                externalPosition={mapPosition}
                onLocationSelect={(lat, lng) => {
                  setMapPosition([lat, lng])
                  setValue('lat', lat)
                  setValue('lng', lng)
                  reverseGeocode(lat, lng)
                }}
              />
              {mapPosition && (
                <p className="text-xs text-primary font-medium">
                  📍 Marcado: {mapPosition[0].toFixed(5)}, {mapPosition[1].toFixed(5)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_notes">Anotaciones del punto de encuentro</Label>
              <Input id="address_notes" placeholder="Ej: Quedamos al lado del surtidor 4..." {...register('address_notes')} />
            </div>
          </div>

          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Publicar Quedada
          </Button>
        </form>
      </CardContent>

      {/* Modal de Ayuda para Activar Ubicación */}
      {showLocationHelp && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-reveal">
          <div className="bg-[#121212] border border-white/10 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative text-left">
            <button
              type="button"
              onClick={() => setShowLocationHelp(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white p-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                  Permiso de Ubicación Bloqueado
                </h3>
                <p className="text-xs text-white/50">
                  Tu navegador tiene bloqueado el acceso al GPS para esta web
                </p>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed bg-white/[0.02] p-3.5 rounded-2xl border border-white/5">
              Por seguridad, <strong>ninguna web puede forzar el diálogo de permisos</strong> si se rechazó anteriormente. Debes cambiarlo en la barra superior con estos pasos:
            </p>

            <div className="space-y-3">
              {/* Opción PC / Chrome / Edge */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <span>💻</span>
                  <span>En PC (Chrome, Edge, Firefox, Brave):</span>
                </div>
                <ol className="text-xs text-white/60 space-y-1 list-decimal list-inside pl-1 leading-relaxed">
                  <li>Haz clic en el <strong>icono del Candado 🔒 o Ajustes ⚙️</strong> a la izquierda de la dirección web (arriba donde pone <code className="text-primary text-[11px]">quedamoto.com</code>).</li>
                  <li>En el apartado <strong>"Ubicación"</strong>, cambia la opción a <strong>"Permitir"</strong>.</li>
                  <li>Pulsa abajo en <em>"Reintentar ahora"</em>.</li>
                </ol>
              </div>

              {/* Opción Móvil / Safari / Android */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <span>📱</span>
                  <span>En Móvil (iPhone Safari o Android Chrome):</span>
                </div>
                <ul className="text-xs text-white/60 space-y-1 list-disc list-inside pl-1 leading-relaxed">
                  <li><strong>iPhone (Safari):</strong> Toca las letras <strong>aA</strong> o el candado en la barra de URL ➡️ <em>Ajustes del sitio web</em> ➡️ <em>Ubicación: Permitir</em>.</li>
                  <li><strong>Android (Chrome):</strong> Pulsa en el candado junto a la URL ➡️ <em>Permisos</em> ➡️ activa <em>Ubicación</em>.</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                type="button"
                className="flex-1 bg-primary text-black font-extrabold text-xs h-11 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
                onClick={() => {
                  handleUseMyLocation()
                }}
              >
                <RefreshCw className="h-4 w-4" /> Ya lo he permitido, reintentar
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-white/10 text-white/70 hover:text-white text-xs h-11 rounded-xl cursor-pointer"
                onClick={() => setShowLocationHelp(false)}
              >
                Cerrar y marcar a mano
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
