'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { buttonVariants } from '@/components/ui/button'
import { Zap, Menu, X, User, Users, Bell, Search, Plus, Shield, LogOut } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { getUserAvatar } from '@/app/(main)/meetups/actions'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar({ 
  user: initialUser, 
  isSuspended: externalSuspended,
  branding = { logo: '', title: 'QuedaMoto' }
}: { 
  user?: any, 
  isSuspended?: boolean,
  branding?: { logo: string, title: string }
}) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [dbAvatar, setDbAvatar] = useState<string | null>(null)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
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
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

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
    { name: 'Historia', href: '/historia', icon: Users },
    { name: 'FAQ', href: '/faq', icon: Shield },
    { name: 'Contacto', href: '/contacto', icon: Zap },
  ]

  const isSuspended = externalSuspended ?? (user?.suspendedUntil && new Date(user.suspendedUntil) > new Date())

  return (
    <nav 
      className={`fixed left-0 right-0 z-[5000] transition-all duration-300 px-4 py-4 ${
        isSuspended ? 'top-11' : 'top-0'
      } ${
        isScrolled ? 'bg-background/80 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform overflow-hidden flex-shrink-0">
              {branding.logo ? (
                <img src={branding.logo} alt={branding.title} className="w-full h-full object-cover" />
              ) : (
                <Zap className="h-6 w-6 text-white fill-white" />
              )}
            </div>
            <span className="text-xl md:text-2xl font-black italic tracking-tighter text-white truncate max-w-[150px] md:max-w-[250px]">
              {branding.title}
            </span>
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
                  {(user.role === 'admin' || user.email === 'admin@quedamoto.com') && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 h-10 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 font-bold transition-all animate-pulse"
                    >
                      <Shield className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  )}
                  {!(user.suspendedUntil && new Date(user.suspendedUntil) > new Date()) && (
                    <Link
                      href="/meetups/create"
                      className="flex items-center gap-2 px-6 h-10 rounded-full bg-white text-black hover:bg-white/90 font-bold transition-all shadow-lg shadow-white/10"
                    >
                      <Plus className="h-4 w-4 text-black" />
                      <span className="text-black">Crear</span>
                    </Link>
                  )}
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="focus:outline-none h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/10 transition-all overflow-hidden shrink-0"
                    >
                      {displayAvatar ? (
                        <img src={displayAvatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {isProfileMenuOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 top-full mt-2 w-56 bg-[#0f0f0f] border border-white/10 text-white rounded-2xl shadow-xl p-2 z-50 flex flex-col gap-1"
                        >
                          <div className="font-bold text-xs uppercase tracking-widest text-white/50 px-3 pt-2 pb-1">
                            Mi Cuenta
                          </div>
                          <div className="h-px w-full bg-white/10 my-1" />
                          <Link 
                            href="/profile" 
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 w-full font-medium hover:bg-white/5 rounded-xl transition-colors"
                          >
                            <User className="w-4 h-4" />
                            <span>Mi Perfil</span>
                          </Link>
                          <Link 
                            href="/dashboard" 
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 w-full font-medium hover:bg-white/5 rounded-xl transition-colors"
                          >
                            <Bell className="w-4 h-4" />
                            <span>Mis Quedadas</span>
                          </Link>
                          <div className="h-px w-full bg-white/10 my-1" />
                          <button 
                            onClick={() => {
                              setIsProfileMenuOpen(false)
                              signOut({ callbackUrl: '/' })
                            }}
                            className="flex items-center gap-2 px-3 py-2 w-full font-bold text-red-400 hover:bg-red-500/20 rounded-xl transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Cerrar Sesión</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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
