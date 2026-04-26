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
import { Trash2, MessageCircle, User, MapPin } from "lucide-react"
import { deleteMessage } from "@/app/admin/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export function MessagesTable({ messages }: { messages: any[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleDelete = async (messageId: string) => {
    if (!confirm("¿Eliminar este mensaje?")) return
    setLoading(messageId)
    const res = await deleteMessage(messageId)
    if (res.success) {
      toast.success("Mensaje eliminado")
      router.refresh()
    } else {
      toast.error(res.error || "Error")
    }
    setLoading(null)
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader className="bg-white/[0.02]">
          <TableRow className="hover:bg-transparent border-white/5 h-16">
            <TableHead className="w-[200px] font-black text-[10px] uppercase tracking-widest text-white/40 pl-8">Rider / Ruta</TableHead>
            <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40">Mensaje</TableHead>
            <TableHead className="w-[150px] font-black text-[10px] uppercase tracking-widest text-white/40">Fecha</TableHead>
            <TableHead className="w-[100px] font-black text-[10px] uppercase tracking-widest text-white/40 pr-8 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((msg) => (
            <TableRow key={msg.id} className="border-white/5 hover:bg-white/[0.01] transition-colors">
              <TableCell className="pl-8 py-6">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <User className="h-3 w-3 text-primary" />
                    <span>{msg.user?.username || "Anónimo"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/30 text-[10px] uppercase tracking-tighter">
                    <MapPin className="h-2.5 w-2.5" />
                    <span className="truncate max-w-[150px]">{msg.meetup?.title || "Ruta eliminada"}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm text-white/80 leading-relaxed max-w-md italic">
                  "{msg.content}"
                </p>
              </TableCell>
              <TableCell>
                <span className="text-xs text-white/30 font-medium">
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true, locale: es })}
                </span>
              </TableCell>
              <TableCell className="pr-8 text-right">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDelete(msg.id)}
                  disabled={loading === msg.id}
                  className="h-9 w-9 rounded-xl text-white/20 hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {messages.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center text-white/20 font-bold uppercase tracking-widest text-xs">
                No hay mensajes recientes
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
