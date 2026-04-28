'use client'

import { useState, useEffect } from "react"
import { getActiveBanners } from "@/app/admin/banners/actions"
import Link from "next/link"

export function BannerZone({ position }: { position: string }) {
  const [banners, setBanners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getActiveBanners(position)
        setBanners(data)
      } catch (err) {
        console.error("Error loading banners:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [position])

  if (loading || !banners || banners.length === 0) return null

  // Auto-adapt grid based on number of active banners (max 4 columns)
  const cols = Math.min(banners.length, 4)
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[cols] || 'grid-cols-1'

  return (
    <div className={`w-full grid gap-6 ${gridClass} animate-in fade-in slide-in-from-bottom-4 duration-700 container mx-auto px-4 py-12`}>
      {banners.map((banner) => {
        const Content = (
          <div className="relative group overflow-hidden rounded-3xl border border-white/10 hover:border-primary/50 transition-all shadow-xl bg-black/50 aspect-[21/9] md:aspect-[16/9] lg:aspect-[21/9]">
            <img 
              src={banner.imageUrl} 
              alt={banner.title} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            {/* Overlay gradient for better integration, optional */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 group-hover:opacity-20 transition-opacity" />
            <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/50">Sponsor</span>
            </div>
          </div>
        )

        return banner.linkUrl ? (
          <a key={banner.id} href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
            {Content}
          </a>
        ) : (
          <div key={banner.id} className="block w-full">
            {Content}
          </div>
        )
      })}
    </div>
  )
}
