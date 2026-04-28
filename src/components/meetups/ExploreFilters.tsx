'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"
import { SlidersHorizontal, X, Check } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function ExploreFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentLevel = searchParams.get('level') || 'all'
  const currentType = searchParams.get('type') || 'all'
  const currentDate = searchParams.get('date') || 'all'

  function updateFilters(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.replace(`/explore?${params.toString()}`, { scroll: false })
  }

  function clearFilters() {
    router.replace('/explore', { scroll: false })
  }

  const hasFilters = currentLevel !== 'all' || currentType !== 'all' || currentDate !== 'all'

  const levels = [
    { id: 'all', label: 'Todos los niveles' },
    { id: 'Principiante', label: 'Principiante' },
    { id: 'Intermedio', label: 'Intermedio' },
    { id: 'Avanzado', label: 'Avanzado' }
  ]

  const types = [
    { id: 'all', label: 'Cualquier tipo' },
    { id: 'route', label: 'Ruta' },
    { id: 'coffee', label: 'Café en ruta' },
    { id: 'breakfast', label: 'Desayuno' },
    { id: 'night', label: 'Nocturna' },
    { id: 'offroad', label: 'Off-Road' }
  ]

  const dates = [
    { id: 'all', label: 'Próximas rutas' },
    { id: 'today', label: 'Hoy' },
    { id: 'tomorrow', label: 'Mañana' }
  ]

  return (
    <div className="flex items-center gap-2">
      {hasFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearFilters}
          className="h-10 px-3 rounded-xl text-white/40 hover:text-white"
        >
          <X className="w-4 h-4 mr-2" />
          Limpiar
        </Button>
      )}
      
      <Sheet>
        <SheetTrigger
          render={
            <Button 
              variant={hasFilters ? "default" : "outline"} 
              size="icon" 
              className={`rounded-xl h-10 w-10 transition-all ${
                hasFilters ? 'bg-primary text-white' : 'border-white/10 bg-white/5'
              }`}
            >
              <SlidersHorizontal className={`w-4 h-4 ${hasFilters ? 'text-white' : 'text-white/40'}`} />
            </Button>
          }
        />
        <SheetContent className="w-80 bg-[#0f0f0f] border-l border-white/5 p-6 pt-28 text-white overflow-y-auto">
          <SheetHeader className="p-0 mb-8">
            <SheetTitle className="text-2xl font-black italic uppercase tracking-tighter">Filtros</SheetTitle>
            <p className="text-sm text-white/40">Personaliza tu búsqueda de rutas.</p>
          </SheetHeader>

          <div className="space-y-8">
            <div className="space-y-4">
              <p className="font-black uppercase tracking-widest text-[10px] text-primary">Nivel Requerido</p>
              <div className="flex flex-col gap-2">
                {levels.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => updateFilters('level', l.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm font-bold ${
                      currentLevel === l.id 
                        ? 'bg-primary/10 border-primary text-primary' 
                        : 'bg-white/5 border-transparent text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {l.label}
                    {currentLevel === l.id && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            <Separator className="bg-white/5" />

            <div className="space-y-4">
              <p className="font-black uppercase tracking-widest text-[10px] text-primary">Tipo de Quedada</p>
              <div className="flex flex-col gap-2">
                {types.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => updateFilters('type', t.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm font-bold ${
                      currentType === t.id 
                        ? 'bg-primary/10 border-primary text-primary' 
                        : 'bg-white/5 border-transparent text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {t.label}
                    {currentType === t.id && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            <Separator className="bg-white/5" />

            <div className="space-y-4">
              <p className="font-black uppercase tracking-widest text-[10px] text-primary">Fecha</p>
              <div className="flex flex-col gap-2">
                {dates.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => updateFilters('date', d.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm font-bold ${
                      currentDate === d.id 
                        ? 'bg-primary/10 border-primary text-primary' 
                        : 'bg-white/5 border-transparent text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {d.label}
                    {currentDate === d.id && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <SheetFooter className="mt-8 pt-8 border-t border-white/5">
            <SheetClose render={<Button className="w-full h-12 rounded-xl font-bold">Ver resultados</Button>} />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
