'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu"
import { SlidersHorizontal, X } from "lucide-react"

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
      
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button 
              variant={hasFilters ? "default" : "outline"} 
              size="icon" 
              className={`rounded-xl h-10 w-10 transition-all ${
                hasFilters ? 'bg-primary text-white' : 'border-white/10 bg-white/5'
              }`}
            />
          }
        >
          <SlidersHorizontal className={`w-4 h-4 ${hasFilters ? 'text-white' : 'text-white/40'}`} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-[#0f0f0f] border-white/10 text-white rounded-2xl" align="end">
          <DropdownMenuLabel className="font-black uppercase tracking-widest text-[10px] text-white/40">Nivel Requerido</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={currentLevel} onValueChange={(v) => updateFilters('level', v)}>
            <DropdownMenuRadioItem value="all" className="rounded-lg">Todos los niveles</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Principiante" className="rounded-lg">Principiante</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Intermedio" className="rounded-lg">Intermedio</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Avanzado" className="rounded-lg">Avanzado</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          
          <DropdownMenuSeparator className="bg-white/5" />
          
          <DropdownMenuLabel className="font-black uppercase tracking-widest text-[10px] text-white/40">Tipo de Quedada</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={currentType} onValueChange={(v) => updateFilters('type', v)}>
            <DropdownMenuRadioItem value="all" className="rounded-lg">Cualquier tipo</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="route" className="rounded-lg">Ruta</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="coffee" className="rounded-lg">Café en ruta</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="breakfast" className="rounded-lg">Desayuno</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="night" className="rounded-lg">Nocturna</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="offroad" className="rounded-lg">Off-Road</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator className="bg-white/5" />
          
          <DropdownMenuLabel className="font-black uppercase tracking-widest text-[10px] text-white/40">Fecha</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={currentDate} onValueChange={(v) => updateFilters('date', v)}>
            <DropdownMenuRadioItem value="all" className="rounded-lg">Próximas rutas</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="today" className="rounded-lg">Hoy</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="tomorrow" className="rounded-lg">Mañana</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
