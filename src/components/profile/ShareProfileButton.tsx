'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { MessageCircle, Copy, Check } from "lucide-react"

interface ShareProfileButtonProps {
  userId: string
  username: string
  vehicles?: { brand: string; model: string }[] | null
  city?: string | null
  className?: string
  variant?: 'primary' | 'whatsapp' | 'outline' | 'compact'
  /** true when the viewer is the profile owner, false/undefined for visitors */
  isOwner?: boolean
}

export function ShareProfileButton({
  userId,
  username,
  vehicles,
  city,
  className = '',
  variant = 'whatsapp',
  isOwner = false,
}: ShareProfileButtonProps) {
  const [copied, setCopied] = useState(false)

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://quedamoto.com'
  const profileUrl = `${origin}/riders/${userId}`

  // Build WhatsApp message — first-person when owner, third-person for visitors
  const validVehicles = (vehicles || []).filter(v => v && (v.brand || v.model))
  const vehiclesText = validVehicles.length > 0
    ? validVehicles.map(v => `${v.brand} ${v.model}`.trim()).join(', ')
    : null

  const whatsappMessage = isOwner
    ? `¡Hola! Échale un vistazo a mi perfil y garaje motero en QuedaMoto 🏍️💨:\n\n👤 *${username}*${city ? ` · 📍 ${city}` : ''}\n${vehiclesText ? `🏍️ Garaje: *${vehiclesText}*\n` : ''}\nMira mis motos y rutas aquí:\n${profileUrl}`
    : `¡Hola! Mira el perfil y garaje de *${username}* en QuedaMoto 🏍️💨:${city ? `\n📍 ${city}` : ''}\n${vehiclesText ? `🏍️ Motos: *${vehiclesText}*\n` : ''}\n${profileUrl}`

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`

  // Button label differs between owner and visitor
  const mainLabel = isOwner
    ? 'Compartir mi Garaje en WhatsApp'
    : `Compartir el perfil de ${username}`

  function handleCopy(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      toast.success('¡Enlace copiado al portapapeles!')
      setTimeout(() => setCopied(false), 2500)
    }
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="h-9 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-xs inline-flex items-center gap-1.5 shadow-md shadow-[#25D366]/20 transition-all cursor-pointer"
          title={mainLabel}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          <span>WhatsApp</span>
        </a>
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={handleCopy}
          className="h-9 w-9 rounded-xl border-white/10 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
          title="Copiar enlace del perfil"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
    )
  }

  return (
    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 ${className}`}>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 h-11 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-xs inline-flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 hover:scale-[1.01] transition-all cursor-pointer"
      >
        <MessageCircle className="h-4 w-4" />
        <span>{mainLabel}</span>
      </a>

      <Button
        type="button"
        variant="outline"
        onClick={handleCopy}
        className="h-11 px-3.5 rounded-xl border-white/10 hover:bg-white/10 text-white/80 hover:text-white font-bold text-xs inline-flex items-center justify-center gap-2 cursor-pointer shrink-0"
        title="Copiar enlace al portapapeles"
      >
        {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
        <span>{copied ? '¡Copiado!' : 'Copiar link'}</span>
      </Button>
    </div>
  )
}
