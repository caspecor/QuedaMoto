'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { createMeetupAction } from '@/app/(main)/meetups/actions'
import { toast } from 'sonner'
import { Loader2, MapPin, Navigation, Search } from 'lucide-react'
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

export function CreateMeetupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGeolocating, setIsGeolocating] = useState(false)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [mapPosition, setMapPosition] = useState<[number, number] | null>(null)
  const geocodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateFormValues>({
    resolver: zodResolver(createSchema) as any,
    defaultValues: {
      visibility: 'public',
      level_required: 'Principiante',
      type: 'route',
    }
  })

  // Geocode address using free Nominatim API (no key required)
  async function geocodeAddress(address: string) {
    if (address.length < 5) return
    setIsGeocoding(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'es' } }
      )
      const data = await res.json()
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat)
        const lng = parseFloat(data[0].lon)
        setMapPosition([lat, lng])
        setValue('lat', lat)
        setValue('lng', lng)
      }
    } catch (e) {
      console.error('Geocoding error:', e)
    } finally {
      setIsGeocoding(false)
    }
  }

  // Debounced handler for address input
  function handleAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current)
    geocodeTimer.current = setTimeout(() => geocodeAddress(value), 800)
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
        toast.success('Ubicación actual marcada en el mapa')
        setIsGeolocating(false)
      },
      (err) => {
        toast.error('No se pudo obtener tu ubicación. Comprueba los permisos del navegador.')
        setIsGeolocating(false)
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
      
      // Delay to ensure the toast is seen and server actions have fully settled
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

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Punto de Encuentro (Dirección)</Label>
              <div className="relative">
                <Input
                  id="address"
                  placeholder="Ej: Alcampo Telde, Gasolinera X..."
                  {...register('address', {
                    onChange: handleAddressChange,
                  })}
                  className="pr-10"
                />
                {isGeocoding && (
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-pulse" />
                )}
              </div>
              {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
              <p className="text-xs text-muted-foreground">
                Escribe una dirección y el mapa se actualizará automáticamente.
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
    </Card>
  )
}
