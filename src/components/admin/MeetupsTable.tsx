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
import { Trash2, ExternalLink, Calendar, Users } from "lucide-react"
import { deleteMeetup } from "@/app/admin/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function MeetupsTable({ meetups, totalPages, currentPage }: { 
  meetups: any[], 
  totalPages: number, 
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
          <TableRow className="hover:bg-transparent border-white/5 h-16">
            <TableHead className="w-[300px] font-black text-[10px] uppercase tracking-widest text-white/40 pl-8">Ruta / Organizador</TableHead>
            <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40">Fecha y Hora</TableHead>
            <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40">Plazas</TableHead>
            <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40">Visibilidad</TableHead>
            <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 pr-8 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meetups.map((meetup) => (
            <TableRow key={meetup.id} className="border-white/5 hover:bg-white/[0.01] h-24 transition-colors">
              <TableCell className="pl-8">
                <div className="flex flex-col">
                  <span className="font-bold text-white text-base truncate max-w-[250px]">{meetup.title}</span>
                  <div className="flex items-center gap-1.5 text-xs text-white/30">
                    <span className="font-medium">Por:</span>
                    <Link href={`/riders/${meetup.creator?.id}`} className="text-primary hover:underline font-bold">
                      {meetup.creator?.username || "Rider Desconocido"}
                    </Link>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-white/60">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-medium">{meetup.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/30 text-xs">
                    <span className="font-bold">{meetup.time}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-white/20" />
                  <span className="text-sm font-bold text-white">
                    {meetup.attendeesCount} / {meetup.max_attendees}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`rounded-full px-3 py-0.5 border-white/10 font-bold uppercase text-[9px] tracking-wider ${
                  meetup.visibility === 'public' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                  'bg-white/5 text-white/40'
                }`}>
                  {meetup.visibility}
                </Badge>
              </TableCell>
              <TableCell className="pr-8 text-right">
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
          ))}
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
