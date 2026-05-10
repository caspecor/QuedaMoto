import React from 'react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 py-12 bg-black/50 mt-auto">
      <div className="container px-4 mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="QuedaMoto Logo" className="h-10 w-10 object-contain drop-shadow-md" />
          <span className="text-xl font-black tracking-tighter text-white italic">QUEDAMOTO</span>
        </div>
        
        <div className="flex flex-wrap gap-4 md:gap-6 items-center justify-center md:justify-end text-sm font-medium">
          <Link href="/historia" className="text-white/40 hover:text-primary transition-colors">Nuestra Historia</Link>
          <Link href="/faq" className="text-white/40 hover:text-primary transition-colors">FAQ</Link>
          <Link href="/contacto" className="text-white/40 hover:text-primary transition-colors">Contacto</Link>
          <div className="hidden md:block h-4 w-px bg-white/20" />
          <Link href="/legal/aviso-legal" className="text-white/30 hover:text-white transition-colors text-xs">Aviso Legal</Link>
          <Link href="/legal/privacidad" className="text-white/30 hover:text-white transition-colors text-xs">Privacidad</Link>
          <Link href="/legal/cookies" className="text-white/30 hover:text-white transition-colors text-xs">Cookies</Link>
        </div>

        <div className="flex flex-col items-center md:items-end gap-1 mt-6 md:mt-0">
          <div className="text-white/20 text-xs font-medium uppercase tracking-[0.25em] text-center md:text-right">
            © {new Date().getFullYear()} QuedaMoto.
          </div>
          <div className="text-white/20 text-[10px] uppercase tracking-widest text-center md:text-right">
            Desarrollado por <a href="https://woofcanarias.es" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-primary">WoofCanarias.es</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
