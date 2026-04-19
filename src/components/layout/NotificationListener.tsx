'use client'

import { useEffect, useState, useRef } from 'react'
import { toast } from 'sonner'
import { Bell, MessageSquare } from 'lucide-react'

import { NotificationToast } from './NotificationToast'

export function NotificationListener() {
  const prevIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const res = await fetch('/api/notifications/unread')
        const data = await res.json()
        
        if (data.unread && data.unread.length > 0) {
          data.unread.forEach((notif: any) => {
            if (!prevIds.current.has(notif.id)) {
              prevIds.current.add(notif.id)
              
              toast.custom((t) => (
                <NotificationToast notif={notif} toastId={t} />
              ), {
                duration: 6000,
                position: 'top-right'
              })
            }
          })
        }
      } catch (err) {
        console.error('Failed to poll notifications:', err)
      }
    }

    // Initial check
    checkNotifications()
    
    // Poll every 15 seconds
    const interval = setInterval(checkNotifications, 15000)
    return () => clearInterval(interval)
  }, [])

  return null // This is a headless component
}
