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
          // Load already shown IDs from localStorage
          const storageKey = 'quedamoto_shown_notifications'
          const shownIdsRaw = localStorage.getItem(storageKey)
          const shownIds = shownIdsRaw ? JSON.parse(shownIdsRaw) : []
          const shownSet = new Set(shownIds)
          let updated = false

          data.unread.forEach((notif: any) => {
            if (!prevIds.current.has(notif.id) && !shownSet.has(notif.id)) {
              prevIds.current.add(notif.id)
              shownSet.add(notif.id)
              updated = true
              
              toast.custom((t) => (
                <NotificationToast notif={notif} toastId={t} />
              ), {
                duration: 6000,
                position: 'bottom-right'
              })
            }
          })

          if (updated) {
            localStorage.setItem(storageKey, JSON.stringify(Array.from(shownSet).slice(-100)))
          }
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
