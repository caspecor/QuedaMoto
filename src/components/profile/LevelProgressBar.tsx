'use client'

import { getLevelInfo } from "@/lib/gamification"
import { Zap } from "lucide-react"

interface LevelProgressBarProps {
  xp: number
}

// Minimal implementation of Progress if it's not exactly what I want, 
// but I'll assume standard shadcn-like Progress exists.
// Wait, I should check if progress.tsx exists.
import { cn } from "@/lib/utils"

export function LevelProgressBar({ xp }: LevelProgressBarProps) {
  const info = getLevelInfo(xp)
  
  return (
    <div className="space-y-4 bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-sm">Nivel de Rider</h4>
            <p className="text-xs text-white/40">Gana XP creando y uniéndote a rutas</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-white italic tracking-tighter">
            {info.levelIndex}
          </span>
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{info.level.name}</p>
        </div>
      </div>

      <div className="relative pt-6">
        {/* Progress Bar Container */}
        <div className="h-4 bg-white/5 rounded-full border border-white/5 p-0.5 relative">
          {/* Progress fill */}
          <div 
            className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full transition-all duration-1000 overflow-hidden"
            style={{ width: `${info.progress}%` }}
          />

          {/* The Moto Emoji - Superposed and facing right */}
          <div 
            className="absolute top-1/2 -translate-y-[85%] text-2xl drop-shadow-[0_0_8px_rgba(255,77,0,0.5)] z-20 pointer-events-none transition-all duration-1000 ease-out"
            style={{ 
              left: `${info.progress}%`,
              transform: `translate(-50%, -85%) scaleX(-1)` 
            }}
          >
            🏍️
          </div>
        </div>
        
        <div className="flex justify-between mt-3 px-1">
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{xp} XP</span>
          {!info.isMaxLevel ? (
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
              Faltan {info.nextLevel!.minXp - xp} para el nivel {info.levelIndex + 1}
            </span>
          ) : (
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Nivel Máximo</span>
          )}
        </div>
      </div>
    </div>
  )
}
