'use client'

import { Bell, MessageSquare, Trash2, ExternalLink } from "lucide-react"
import { markNotificationAsRead, deleteNotification } from "@/app/(main)/meetups/actions"
import { toast } from "sonner"

export function NotificationToast({ notif, toastId }: { notif: any, toastId: string | number }) {
  const handleVer = async () => {
    await markNotificationAsRead(notif.id)
    toast.dismiss(toastId)
    window.location.href = notif.link
  }

  const handleEliminar = async () => {
    await deleteNotification(notif.id)
    toast.dismiss(toastId)
    toast.success("Notificación eliminada")
  }

  return (
    <div className="flex flex-col w-full gap-3 p-1">
      <div className="flex gap-3 items-start">
        <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'chat' ? 'bg-blue-500/10 text-blue-400' : 'bg-primary/10 text-primary'}`}>
          {notif.type === 'chat' ? <MessageSquare className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-white">{notif.title}</p>
          <p className="text-xs text-white/60 line-clamp-2">{notif.message}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-1">
        <button 
          onClick={handleVer}
          className="flex-1 bg-white text-black text-[10px] font-bold uppercase h-8 rounded-lg flex items-center justify-center gap-1.5 hover:bg-white/90 transition-colors"
        >
          <ExternalLink className="h-3 w-3" /> Ver
        </button>
        <button 
          onClick={handleEliminar}
          className="px-3 bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all h-8 rounded-lg flex items-center justify-center"
          title="Eliminar"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
