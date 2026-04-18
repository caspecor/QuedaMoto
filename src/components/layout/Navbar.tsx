import { auth } from '@/auth'
import Link from 'next/link'
import { Zap, User, Plus } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default async function Navbar() {
  const session = await auth()
  const user = session?.user

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <Zap className="h-6 w-6" />
          <span className="font-bold text-xl tracking-tight text-foreground">QuedaMoto</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/explore" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Explorar Rutas</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Mis Quedadas</Link>
              <Link href="/meetups/create" className={buttonVariants({ className: "rounded-full" })}>
                  <Plus className="mr-2 h-4 w-4" /> Crear Quedada
              </Link>
              <Link href="/profile">
                <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <div className="flex gap-4">
              <Link href="/auth/login" className={buttonVariants({ variant: "ghost" })}>Entrar</Link>
              <Link href="/auth/register" className={buttonVariants({ className: "rounded-full" })}>Unirse Gratis</Link>
            </div>
          )}
        </div>
        {/* Mobile View: we just show Logo and maybe a Login button if not logged in. Navigation is handled by BottomNav */}
      </div>
    </nav>
  )
}
