'use client'

import { useEffect, useState, useRef } from 'react'
import { toast } from 'sonner'
import { Bell, MessageSquare } from 'lucide-react'

export function NotificationListener() {
  const [lastCheck, setLastCheck] = useState<number>(Date.now())
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
              
              // Only notify if it's "new" relative to when we mounted
              // but for testing we show all unread ones once
              toast(notif.title, {
                description: notif.message,
                icon: notif.type === 'chat' ? <MessageSquare className="h-4 w-4 text-primary" /> : <Bell className="h-4 w-4 text-primary" />,
                action: notif.link ? {
                  label: 'Ver',
                  onClick: () => window.location.href = notif.link
                } : undefined,
                duration: 5000,
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
