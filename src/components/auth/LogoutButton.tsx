'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })} 
      className="p-2 rounded-full text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-colors"
      title="Cerrar sesión"
    >
      <LogOut className="w-5 h-5" />
    </button>
  )
}
