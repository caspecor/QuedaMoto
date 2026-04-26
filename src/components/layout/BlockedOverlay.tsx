'use client'

import { ShieldAlert, LogOut, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export function BlockedOverlay() {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-8 animate-in zoom-in-95 duration-500">
        <div className="relative mx-auto w-24 h-24 bg-red-500/20 rounded-[2.5rem] flex items-center justify-center text-red-500 shadow-2xl shadow-red-500/20">
          <ShieldAlert className="h-12 w-12" />
          <div className="absolute -top-1 -right-1 h-6 w-6 bg-red-500 rounded-full border-4 border-black animate-pulse" />
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-black italic text-white tracking-tighter uppercase">CUENTA BLOQUEADA</h1>
          <p className="text-white/40 font-medium leading-relaxed">
            Tu acceso a <span className="text-white font-bold">QuedaMoto</span> ha sido revocado permanentemente debido a infracciones graves de nuestras normas de comunidad.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
          <p className="text-xs font-black uppercase tracking-widest text-white/20">¿Crees que es un error?</p>
          <a 
            href="mailto:admin@quedamoto.com" 
            className="flex items-center justify-center gap-3 w-full h-14 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/5"
          >
            <Mail className="h-5 w-5 text-primary" /> Contactar Soporte
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => signOut({ callbackUrl: '/' })}
            variant="ghost" 
            className="h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest text-white/40 hover:text-white"
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  )
}
