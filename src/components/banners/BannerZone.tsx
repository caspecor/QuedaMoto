'use client'

import { useState, useEffect } from "react"
import { getActiveBanners, getBannerModuleStatus } from "@/app/admin/banners/actions"
import Link from "next/link"

export function BannerZone({ position }: { position: string }) {
  const [banners, setBanners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const isEnabled = await getBannerModuleStatus(position)
        setEnabled(isEnabled)
        if (isEnabled) {
          const data = await getActiveBanners(position)
          setBanners(data)
        }
      } catch (err) {
        console.error("Error loading banners:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [position])

  if (loading || !enabled) return null

  const totalSlots = position === 'home_middle' ? 8 : 4
  const slots = Array.from({ length: totalSlots }).map((_, i) => {
    const slotIndex = i + 1
    const activeBanner = banners.find(b => b.slotIndex === slotIndex)
    return {
      slotIndex,
      banner: activeBanner || null
    }
  })

  const gridClass = position === 'home_middle' 
    ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-4' 
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'

  return (
    <div className={`w-full grid gap-4 md:gap-6 ${gridClass} animate-in fade-in slide-in-from-bottom-4 duration-700 container mx-auto px-4 py-12`}>
      {slots.map(({ slotIndex, banner }) => {
        const title = banner ? banner.title : "Sponsor Disponible"
        const imageUrl = banner ? banner.imageUrl : "/images/sponsor_default.png"
        const linkUrl = banner ? banner.linkUrl : null

        const Content = (
          <div className="relative group overflow-hidden rounded-3xl border border-white/10 hover:border-primary/50 transition-all shadow-xl bg-black/50 aspect-[16/9]">
            <img 
              src={imageUrl} 
              alt={title} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 group-hover:opacity-20 transition-opacity" />
            <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/50">
                {banner ? 'Sponsor' : 'Disponible'}
              </span>
            </div>
          </div>
        )

        if (banner && linkUrl) {
           return (
             <a key={slotIndex} href={`/api/banners/redirect?id=${banner.id}&url=${encodeURIComponent(linkUrl)}`} target="_blank" rel="noopener noreferrer" className="block w-full">
               {Content}
             </a>
           )
        }
        
        if (!banner) {
           return (
             <Link key={slotIndex} href="/contacto-empresas" className="block w-full">
               {Content}
             </Link>
           )
        }

        return (
          <div key={slotIndex} className="block w-full">
            {Content}
          </div>
        )
      })}
    </div>
  )
}
