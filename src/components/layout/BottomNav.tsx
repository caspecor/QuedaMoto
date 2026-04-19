'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Map, PlusCircle, User, LayoutDashboard, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'

export function BottomNav({ user: initialUser }: { user?: any }) {
  const { data: session } = useSession()
  const user = session?.user || initialUser
  const pathname = usePathname()
  const isLoggedIn = !!user

  const navItems = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Explorar', href: '/explore', icon: Map },
    ...(isLoggedIn 
      ? [
          { name: 'Crear', href: '/meetups/create', icon: PlusCircle, highlight: true },
          { name: 'Garaje', href: '/dashboard', icon: LayoutDashboard },
          { name: 'Perfil', href: '/profile', icon: User },
        ] 
      : [
          { name: 'Entrar', href: '/auth/login', icon: User }
        ]
    )
  ]

  return (
    <div className="fixed bottom-0 left-0 z-[100] w-full h-18 bg-background/60 backdrop-blur-xl border-t border-white/5 md:hidden pb-safe-area-inset-bottom overflow-hidden">
      <div className="grid h-full w-full mx-auto" style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          const isProfile = item.name === 'Perfil'
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className="inline-flex flex-col items-center justify-center px-2 group py-2"
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300 overflow-hidden",
                isActive ? "bg-primary/10 text-primary scale-110" : "text-white/30 group-hover:text-white/60",
                item.highlight && "bg-primary/20 text-primary",
                isProfile && user?.image && "p-0 h-9 w-9 border border-white/10"
              )}>
                {isProfile && user?.image ? (
                  <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Icon 
                    className={cn(
                      "w-5 h-5",
                      item.highlight && "stroke-[2.5]"
                    )} 
                  />
                )}
              </div>
              <span 
                className={cn(
                  "text-[9px] font-black uppercase tracking-widest mt-1 transition-colors duration-300",
                  isActive ? "text-primary opacity-100" : "text-white/20 opacity-80"
                )}
              >
                {item.name}
              </span>
              {isActive && (
                <div className="absolute top-0 h-0.5 w-4 bg-primary rounded-full animate-in fade-in zoom-in duration-500" />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
