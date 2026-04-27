'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Calendar, MessageSquare, Settings, Shield, BarChart3, Flag, Menu, X, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const adminNavItems = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { title: 'Stats', href: '/admin/stats', icon: BarChart3 },
  { title: 'Usuarios', href: '/admin/users', icon: Users },
  { title: 'Reportes', href: '/admin/reports', icon: Flag },
  { title: 'Quedadas', href: '/admin/meetups', icon: Calendar },
  { title: 'Mensajes', href: '/admin/messages', icon: MessageSquare },
  { title: 'Configuración', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const NavContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-white/5 px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <Shield className="h-7 w-7 text-primary" />
          <span className="text-xl font-black text-white tracking-tighter italic">ADMIN</span>
        </Link>
        {/* Close button (mobile only) */}
        <button
          className="md:hidden h-8 w-8 flex items-center justify-center text-white/40 hover:text-white"
          onClick={() => setMobileOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {adminNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200',
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className={cn('h-5 w-5 flex-shrink-0', item.title === 'Reportes' && !isActive && 'text-red-500 animate-pulse')} />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/5 p-3">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-white/40 hover:bg-white/5 hover:text-white transition-all"
        >
          <LogOut className="h-4 w-4" />
          Volver al sitio
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* ── Desktop sidebar (always visible md+) ── */}
      <div className="hidden md:fixed md:left-0 md:top-0 md:flex md:h-full md:w-64 md:flex-col bg-card border-r border-white/5 z-40">
        {NavContent}
      </div>

      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-card/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-black text-white italic tracking-tighter">ADMIN</span>
        </Link>
        <button
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-white"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* ── Mobile drawer overlay ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="relative w-72 max-w-[85vw] h-full bg-card border-r border-white/5 flex flex-col animate-in slide-in-from-left duration-300">
            {NavContent}
          </div>
        </div>
      )}
    </>
  )
}