'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

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
  visibility: z.enum(['public', 'private']),
  level_required: z.enum(['Principiante', 'Intermedio', 'Avanzado']),
})

type CreateFormValues = z.infer<typeof createSchema>

export function CreateMeetupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CreateFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      visibility: 'public',
      level_required: 'Principiante',
      type: 'route',
    }
  })

  async function onSubmit(data: CreateFormValues) {
    setIsLoading(true)
    try {
      const { data: userResponse } = await supabase.auth.getUser()
      if (!userResponse.user) {
        toast.error("Debes iniciar sesión para crear eventos")
        return
      }

      const payload = {
        ...data,
        max_attendees: parseInt(data.max_attendees, 10),
        creator_id: userResponse.user.id,
        // Optional default lat/lng handling since we aren't using a complex place picker right now
        lat: 28.12, 
        lng: -15.43
      }

      const { data: newMeetup, error } = await supabase
        .from('meetups')
        .insert(payload)
        .select('id')
        .single()
        
      if (error) throw error

      // Auto-join the creator to the meetup
      if (newMeetup) {
        await supabase.from('attendees').insert({
          meetup_id: newMeetup.id,
          user_id: userResponse.user.id,
          status: 'attending'
        })
      }

      toast.success('Ruta creada con éxito')
      router.push(`/meetups/${newMeetup.id}`)
      router.refresh()
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

          <div className="space-y-2">
            <Label htmlFor="address">Punto de Encuentro (Dirección)</Label>
            <Input id="address" placeholder="Gasolinera X, Calle Y..." {...register('address')} />
            {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
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
