'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function VisitTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // We call a server action to record the visit
    const record = async () => {
      try {
        await fetch('/api/visits', { 
          method: 'POST',
          body: JSON.stringify({ path: pathname }),
          headers: { 'Content-Type': 'application/json' }
        })
      } catch (e) {
        // Silently fail
      }
    }
    record()
  }, [pathname])

  return null
}
