'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Map, PlusCircle, User, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function BottomNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Explorar', href: '/explore', icon: Map },
    ...(isLoggedIn 
      ? [
          { name: 'Crear', href: '/meetups/create', icon: PlusCircle, highlight: true },
          { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { name: 'Perfil', href: '/profile', icon: User },
        ] 
      : [
          { name: 'Entrar', href: '/auth/login', icon: User }
        ]
    )
  ]

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background/95 backdrop-blur border-t border-border/40 md:hidden">
      <div className="grid h-full w-full mx-auto" style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className="inline-flex flex-col items-center justify-center px-2 hover:bg-muted/50 group"
            >
              <Icon 
                className={cn(
                  "w-6 h-6 mb-1 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                  item.highlight && "text-primary stroke-[2.5]"
                )} 
              />
              <span 
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
