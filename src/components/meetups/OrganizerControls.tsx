'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteMeetupAction, updateMeetupAction } from '@/app/(main)/meetups/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pencil, Trash2, Loader2, AlertTriangle, Check, X } from 'lucide-react'
import { toast } from 'sonner'

interface OrganizerControlsProps {
  meetup: {
    id: string
    title: string
    description: string
    date: string
    time: string
    max_attendees: number
    address: string
    address_notes: string | null
    type: string
    level_required: string
    visibility: string
  }
}

export function OrganizerControls({ meetup }: OrganizerControlsProps) {
  const router = useRouter()
  const [mode, setMode] = useState<'idle' | 'edit' | 'confirmDelete'>('idle')
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    title: meetup.title,
    description: meetup.description,
    date: meetup.date,
    time: meetup.time,
    max_attendees: String(meetup.max_attendees),
    address: meetup.address,
    address_notes: meetup.address_notes || '',
    type: meetup.type,
    level_required: meetup.level_required,
    visibility: meetup.visibility,
  })

  async function handleDelete() {
    setIsLoading(true)
    try {
      const res = await deleteMeetupAction(meetup.id)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Quedada eliminada')
        window.location.href = '/explore'
      }
    } catch {
      toast.error('Error al eliminar')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await updateMeetupAction(meetup.id, form)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Quedada actualizada')
        setMode('idle')
        router.refresh()
      }
    } catch {
      toast.error('Error al actualizar')
    } finally {
      setIsLoading(false)
    }
  }

  // --- CONFIRM DELETE ---
  if (mode === 'confirmDelete') {
    return (
      <div className="mt-2 p-4 rounded-2xl border-2 border-destructive/50 bg-destructive/5 space-y-3">
        <div className="flex items-center gap-2 text-destructive font-bold">
          <AlertTriangle className="h-5 w-5" /> ¿Eliminar esta quedada?
        </div>
        <p className="text-xs text-muted-foreground">Esta acción es permanente. Todos los asistentes serán eliminados de la ruta.</p>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            className="flex-1 rounded-xl"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
            Sí, eliminar
          </Button>
          <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setMode('idle')}>
            Cancelar
          </Button>
        </div>
      </div>
    )
  }

  // --- EDIT FORM ---
  if (mode === 'edit') {
    return (
      <form onSubmit={handleUpdate} className="mt-2 space-y-4 p-4 rounded-2xl border border-primary/30 bg-primary/5">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-primary">Editar Quedada</h4>
          <button type="button" onClick={() => setMode('idle')} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <Label className="text-xs">Título</Label>
            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1 h-9" />
          </div>
          <div>
            <Label className="text-xs">Descripción</Label>
            <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="mt-1 h-9" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Fecha</Label>
              <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="mt-1 h-9" />
            </div>
            <div>
              <Label className="text-xs">Hora</Label>
              <Input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="mt-1 h-9" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Plazas máx.</Label>
              <Input type="number" value={form.max_attendees} onChange={e => setForm({ ...form, max_attendees: e.target.value })} className="mt-1 h-9" />
            </div>
            <div>
              <Label className="text-xs">Nivel</Label>
              <Select value={form.level_required} onValueChange={v => setForm({ ...form, level_required: v || '' })}>
                <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Principiante">Principiante</SelectItem>
                  <SelectItem value="Intermedio">Intermedio</SelectItem>
                  <SelectItem value="Avanzado">Avanzado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Dirección</Label>
            <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="mt-1 h-9" />
          </div>
          <div>
            <Label className="text-xs">Anotaciones del punto de encuentro</Label>
            <Input value={form.address_notes} onChange={e => setForm({ ...form, address_notes: e.target.value })} className="mt-1 h-9" placeholder="Opcional..." />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" className="flex-1 rounded-xl h-10" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
            Guardar cambios
          </Button>
          <Button type="button" variant="outline" className="rounded-xl h-10" onClick={() => setMode('idle')}>
            Cancelar
          </Button>
        </div>
      </form>
    )
  }

  // --- DEFAULT (idle) ---
  return (
    <div className="mt-2 flex gap-2">
      <Button
        variant="outline"
        className="flex-1 h-11 rounded-full gap-2 font-semibold border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        onClick={() => setMode('edit')}
      >
        <Pencil className="h-4 w-4" /> Editar ruta
      </Button>
      {new Date().toISOString().split('T')[0] <= meetup.date && (
        <Button
          variant="outline"
          className="h-11 w-11 rounded-full border-destructive/40 text-destructive hover:bg-destructive hover:text-white transition-colors"
          onClick={() => setMode('confirmDelete')}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
