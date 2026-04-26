'use client'
import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

export function SuspensionOverlay({ suspendedUntil }: { suspendedUntil: string }) {
  const [timeLeft, setTimeLeft] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!suspendedUntil) return

    const end = new Date(suspendedUntil).getTime()
    const updateTimer = () => {
      const now = new Date().getTime()
      const diff = end - now
      
      if (diff <= 0) {
        setTimeLeft('00:00:00')
        setIsVisible(false)
        return
      }

      setIsVisible(true)
      const h = Math.floor(diff / (1000 * 60 * 60))
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [suspendedUntil])

  if (!isVisible) return null

  return (
    <div className="fixed top-0 left-0 w-full z-[10000] bg-orange-600 text-white py-2.5 px-4 shadow-2xl flex items-center justify-center gap-4 animate-in slide-in-from-top duration-500">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-1.5 rounded-lg animate-pulse">
          <Clock className="h-4 w-4" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
          <p className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-90">
            Tu cuenta está suspendida temporalmente
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase font-bold opacity-60">Tiempo restante:</span>
            <span className="text-sm font-mono font-black bg-black/20 px-2.5 py-0.5 rounded-md border border-white/10">
              {timeLeft}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
