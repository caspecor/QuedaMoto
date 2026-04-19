'use client'

import { Bell, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import { markNotificationAsRead } from "@/app/(main)/meetups/actions"

export function NotificationCard({ notif }: { notif: any }) {
  const handleClick = async () => {
    if (!notif.isRead) {
      await markNotificationAsRead(notif.id)
    }
  }

  return (
    <div 
      className={`relative p-4 rounded-2xl border transition-all ${notif.isRead ? 'bg-white/[0.02] border-white/5 text-white/40' : 'bg-primary/5 border-primary/20 text-white'}`}
    >
      <div className="flex gap-3">
        <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'chat' ? 'bg-blue-500/10 text-blue-400' : 'bg-primary/10 text-primary'}`}>
          {notif.type === 'chat' ? <MessageSquare className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
        </div>
        <div className="space-y-1 pr-4">
          <h4 className="text-xs font-bold leading-tight">{notif.title}</h4>
          <p className="text-xs opacity-70 leading-relaxed">{notif.message}</p>
          <p className="text-[10px] opacity-40 font-bold uppercase tracking-wider pt-1">
            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: es })}
          </p>
        </div>
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
