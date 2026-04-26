'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { buttonVariants } from '@/components/ui/button'
import { Zap, Menu, X, User, Bell, Search, Plus, Shield } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { getUserAvatar } from '@/app/(main)/meetups/actions'

export function Navbar({ user: initialUser }: { user?: any }) {
  const { data: session } = useSession()
  const [dbAvatar, setDbAvatar] = useState<string | null>(null)
  const user = session?.user || initialUser
  const displayAvatar = dbAvatar || user?.image
  
  useEffect(() => {
    async function fetchAvatar() {
      const avatar = await getUserAvatar()
      if (avatar) setDbAvatar(avatar)
    }
    fetchAvatar()
  }, [user?.id])

  useEffect(() => {
    console.log("[NAVBAR] User State:", user?.name, "HasDisplayAvatar:", !!displayAvatar)
  }, [user, displayAvatar])

  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Explorar', href: '/explore', icon: Search },
    { name: 'Mis Quedadas', href: '/dashboard', icon: Bell },
  ]

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[5000] transition-all duration-300 px-4 py-4 ${
        isScrolled ? 'bg-background/80 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <Zap className="h-6 w-6 text-white fill-white" />
            </div>
            <span className="text-2xl font-black italic tracking-tighter text-white">QUEDAMOTO</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-[0.2em] transition-colors rounded-full ${
                    pathname === link.href ? 'text-primary bg-primary/10' : 'text-white/40 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="h-4 w-px bg-white/10" />

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 h-10 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 font-bold transition-all"
                    >
                      <Shield className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  )}
                  <Link
                    href="/meetups/create"
                    className="flex items-center gap-2 px-6 h-10 rounded-full bg-white text-black hover:bg-white/90 font-bold transition-all shadow-lg shadow-white/10"
                  >
                    <Plus className="h-4 w-4 text-black" />
                    <span className="text-black">Crear</span>
                  </Link>
                  <Link href="/profile" className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/10 transition-all overflow-hidden shrink-0">
                    {displayAvatar ? (
                      <img src={displayAvatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                    Login
                  </Link>
                  <Link href="/auth/register" className={buttonVariants({ className: "rounded-full bg-primary font-bold h-10 px-6" })}>
                    Únete
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden h-10 w-10 glass rounded-xl flex items-center justify-center text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-4 right-4 mt-4 glass rounded-3xl p-6 md:hidden z-[5001] flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 text-lg font-bold text-white/80"
              >
                <link.icon className="h-5 w-5 text-primary" />
                {link.name}
              </Link>
            ))}
            <hr className="border-white/5" />
            <div className="flex flex-col gap-3">
              {user ? (
                <Link href="/meetups/create" onClick={() => setIsMobileMenuOpen(false)} className={buttonVariants({ className: "w-full rounded-2xl h-14 font-bold" })}>
                  Crear Ruta
                </Link>
              ) : (
                <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)} className={buttonVariants({ className: "w-full rounded-2xl h-14 font-bold" })}>
                  Registrarse
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
