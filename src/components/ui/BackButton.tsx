'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  const router = useRouter()

  return (
    <button 
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
    >
      <ArrowLeft className="w-4 h-4" /> Volver
    </button>
  )
}
