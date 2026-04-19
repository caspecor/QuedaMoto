'use client'

import { Bell, MessageSquare, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import { markNotificationAsRead, deleteNotification } from "@/app/(main)/meetups/actions"
import { toast } from "sonner"

export function NotificationCard({ notif }: { notif: any }) {
  const handleClick = async () => {
    if (!notif.isRead) {
      await markNotificationAsRead(notif.id)
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const res = await deleteNotification(notif.id)
    if (res.success) {
      toast.success("Notificación eliminada")
    }
  }

  return (
    <div 
      className={`group relative p-4 rounded-2xl border transition-all ${notif.isRead ? 'bg-white/[0.02] border-white/5 text-white/40' : 'bg-primary/5 border-primary/20 text-white'}`}
    >
      <div className="flex gap-3">
        <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'chat' ? 'bg-blue-500/10 text-blue-400' : 'bg-primary/10 text-primary'}`}>
          {notif.type === 'chat' ? <MessageSquare className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
        </div>
        <div className="space-y-1 pr-8 flex-1">
          <h4 className="text-xs font-bold leading-tight">{notif.title}</h4>
          <p className="text-xs opacity-70 leading-relaxed">{notif.message}</p>
          <div className="flex items-center justify-between pt-1">
            <p className="text-[10px] opacity-40 font-bold uppercase tracking-wider">
              {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: es })}
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleDelete}
          className="absolute top-4 right-4 h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center text-white/20 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400 transition-all z-10"
          title="Eliminar"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {notif.link && (
        <Link 
          href={notif.link} 
          onClick={handleClick}
          className="absolute inset-0 z-0"
          aria-label="Ir al evento"
        />
      )}
    </div>
  )
}
