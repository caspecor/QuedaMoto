'use client'

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, ExternalLink, Calendar, Users, Clock, CheckCircle2, XCircle, AlertCircle, Timer } from "lucide-react"
import { deleteMeetup } from "@/app/admin/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

/** Parse "DD/MM/YYYY" + "HH:MM" into a JS Date, returns null if invalid */
function parseMeetupDate(date: string, time: string): Date | null {
  if (!date) return null
  // date can be "DD/MM/YYYY" or "YYYY-MM-DD"
  let day: string, month: string, year: string
  if (date.includes('/')) {
    ;[day, month, year] = date.split('/')
  } else {
    ;[year, month, day] = date.split('-')
  }
  const [hours = '00', minutes = '00'] = (time || '00:00').split(':')
  const d = new Date(`${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}T${hours.padStart(2,'0')}:${minutes.padStart(2,'0')}:00`)
  return isNaN(d.getTime()) ? null : d
}

type MeetupStatus = 'active' | 'expired' | 'today' | 'upcoming' | 'unknown'

function getMeetupStatus(date: string, time: string): MeetupStatus {
  const meetupDate = parseMeetupDate(date, time)
  if (!meetupDate) return 'unknown'

  const now = new Date()
  const diffMs = meetupDate.getTime() - now.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)

  if (diffMs < 0) return 'expired'
  if (diffHours <= 24) return 'today'      // Within next 24h
  if (diffHours <= 72) return 'active'     // Within next 3 days
  return 'upcoming'
}

function getTimeLabel(date: string, time: string): string {
  const meetupDate = parseMeetupDate(date, time)
  if (!meetupDate) return '—'

  const now = new Date()
  const diffMs = meetupDate.getTime() - now.getTime()
  const absDiff = Math.abs(diffMs)
  const isPast = diffMs < 0

  const mins = Math.floor(absDiff / (1000 * 60))
  const hours = Math.floor(absDiff / (1000 * 60 * 60))
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24))

  let label: string
  if (mins < 60) label = `${mins}m`
  else if (hours < 24) label = `${hours}h ${mins % 60}m`
  else if (days === 1) label = `1 día`
  else label = `${days} días`

  return isPast ? `Hace ${label}` : `En ${label}`
}

const STATUS_CONFIG: Record<MeetupStatus, {
  label: string
  icon: React.ElementType
  className: string
  dotColor: string
}> = {
  active: {
    label: 'Activa',
    icon: CheckCircle2,
    className: 'bg-green-500/10 text-green-400 border-green-500/20',
    dotColor: 'bg-green-400',
  },
  today: {
    label: 'Hoy',
    icon: AlertCircle,
    className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    dotColor: 'bg-yellow-400 animate-pulse',
  },
  expired: {
    label: 'Caducada',
    icon: XCircle,
    className: 'bg-white/5 text-white/25 border-white/10',
    dotColor: 'bg-white/20',
  },
  upcoming: {
    label: 'Próxima',
    icon: Timer,
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dotColor: 'bg-blue-400',
  },
  unknown: {
    label: 'Sin fecha',
    icon: Clock,
    className: 'bg-white/5 text-white/20 border-white/5',
    dotColor: 'bg-white/20',
  },
}

function formatCreatedAt(createdAt: Date | string | null): string {
  if (!createdAt) return '—'
  const d = typeof createdAt === 'string' ? new Date(createdAt) : createdAt
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function MeetupsTable({ meetups, totalPages, currentPage }: {
  meetups: any[]
  totalPages: number
  currentPage: number
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleDelete = async (meetupId: string) => {
    if (!confirm("¿Estás seguro de eliminar esta quedada? Se borrarán todos los mensajes y asistentes vinculados.")) return
    setLoading(meetupId)
    const res = await deleteMeetup(meetupId)
    if (res.success) {
      toast.success("Quedada eliminada con éxito")
      router.refresh()
    } else {
      toast.error(res.error || "Error al eliminar")
    }
    setLoading(null)
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader className="bg-white/[0.02]">
          <TableRow className="hover:bg-transparent border-white/5 h-14">
            <TableHead className="w-[260px] font-black text-[10px] uppercase tracking-widest text-white/40 pl-8">Ruta / Organizador</TableHead>
            <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40">Estado</TableHead>
            <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40">Fecha y Hora</TableHead>
            <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40">Plazas</TableHead>
            <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40">Visibilidad</TableHead>
            <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 pr-8 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meetups.map((meetup) => {
            const status = getMeetupStatus(meetup.date, meetup.time)
            const timeLabel = getTimeLabel(meetup.date, meetup.time)
            const cfg = STATUS_CONFIG[status]
            const StatusIcon = cfg.icon
            const fillPct = meetup.max_attendees > 0
              ? Math.min(100, Math.round((meetup.attendeesCount / meetup.max_attendees) * 100))
              : 0
            const isFull = meetup.attendeesCount >= meetup.max_attendees

            return (
              <TableRow
                key={meetup.id}
                className={`border-white/5 hover:bg-white/[0.015] transition-colors ${
                  status === 'expired' ? 'opacity-50' : ''
                }`}
              >
                {/* Title + creator + created date */}
                <TableCell className="pl-8 py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-white text-sm truncate max-w-[230px]">{meetup.title}</span>
                    <div className="flex items-center gap-1.5 text-xs text-white/30">
                      <span className="font-medium">Por:</span>
                      <Link href={`/riders/${meetup.creator?.id}`} className="text-primary hover:underline font-bold">
                        {meetup.creator?.username || "Rider Desconocido"}
                      </Link>
                    </div>
                    {meetup.createdAt && (
                      <span className="text-[10px] text-white/20 mt-0.5">
                        Creada: {formatCreatedAt(meetup.createdAt)}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Status badge + time remaining */}
                <TableCell className="py-4">
                  <div className="flex flex-col gap-1.5">
                    <Badge
                      variant="outline"
                      className={`rounded-full px-2.5 py-0.5 border font-bold uppercase text-[9px] tracking-wider flex items-center gap-1.5 w-fit ${cfg.className}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotColor}`} />
                      <StatusIcon className="h-3 w-3" />
                      {cfg.label}
                    </Badge>
                    <span className={`text-[11px] font-semibold ${
                      status === 'expired' ? 'text-white/20' :
                      status === 'today'   ? 'text-yellow-400' :
                      status === 'active'  ? 'text-green-400/80' :
                                             'text-blue-400/80'
                    }`}>
                      {timeLabel}
                    </span>
                  </div>
                </TableCell>

                {/* Date + time */}
                <TableCell className="py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-white/60">
                      <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="text-sm font-medium">{meetup.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/30 text-xs">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span className="font-bold">{meetup.time || '—'}</span>
                    </div>
                  </div>
                </TableCell>

                {/* Attendees + fill bar */}
                <TableCell className="py-4">
                  <div className="flex flex-col gap-1.5 min-w-[90px]">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-white/20 shrink-0" />
                      <span className={`text-sm font-bold ${isFull ? 'text-primary' : 'text-white'}`}>
                        {meetup.attendeesCount} / {meetup.max_attendees}
                      </span>
                      {isFull && (
                        <span className="text-[9px] font-black bg-primary/20 text-primary px-1.5 rounded-full border border-primary/30">
                          LLENO
                        </span>
                      )}
                    </div>
                    {/* Fill bar */}
                    <div className="h-1 rounded-full bg-white/5 w-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          fillPct >= 100 ? 'bg-primary' :
                          fillPct >= 75  ? 'bg-yellow-500' :
                                           'bg-green-500'
                        }`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-white/20 font-semibold">{fillPct}% ocupado</span>
                  </div>
                </TableCell>

                {/* Visibility */}
                <TableCell className="py-4">
                  <Badge variant="outline" className={`rounded-full px-3 py-0.5 border font-bold uppercase text-[9px] tracking-wider ${
                    meetup.visibility === 'public'
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-white/5 text-white/40 border-white/10'
                  }`}>
                    {meetup.visibility === 'public' ? '🌐 Pública' : '🔒 Privada'}
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell className="pr-8 text-right py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/meetups/${meetup.id}`}
                      target="_blank"
                      className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-all"
                      title="Ver en vivo"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={loading === meetup.id}
                      onClick={() => handleDelete(meetup.id)}
                      title="Eliminar Quedada"
                      className="h-9 w-9 rounded-xl text-white/20 hover:text-destructive hover:bg-destructive/10 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 p-8 border-t border-white/5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/meetups?page=${currentPage - 1}`)}
            disabled={currentPage === 1}
            className="rounded-xl border-white/10 text-white/40 h-10 px-4"
          >
            Anterior
          </Button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "ghost"}
                size="sm"
                onClick={() => router.push(`/admin/meetups?page=${i + 1}`)}
                className={`w-10 h-10 rounded-xl font-bold ${currentPage === i + 1 ? 'bg-primary text-black' : 'text-white/40'}`}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/meetups?page=${currentPage + 1}`)}
            disabled={currentPage === totalPages}
            className="rounded-xl border-white/10 text-white/40 h-10 px-4"
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
}
