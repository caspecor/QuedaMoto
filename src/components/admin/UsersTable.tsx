'use client'

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, ShieldAlert, Trash2, Ban, CheckCircle, UserCog, Clock, XCircle } from "lucide-react"
import { toggleUserBlock, deleteUser, changeUserRole, suspendUser } from "@/app/admin/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { getLevelInfo } from "@/lib/gamification"

export function UsersTable({ users, totalPages, currentPage }: { 
  users: any[], 
  totalPages: number, 
  currentPage: number 
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleToggleBlock = async (userId: string) => {
    setLoading(userId)
    const res = await toggleUserBlock(userId)
    if (res.success) {
      toast.success("Estado de usuario actualizado")
      router.refresh()
    } else {
      toast.error(res.error || "Error al actualizar")
    }
    setLoading(null)
  }

  const handleDelete = async (userId: string) => {
    if (!confirm("¿Estás seguro de eliminar este usuario? Esta acción es irreversible.")) return
    setLoading(userId)
    const res = await deleteUser(userId)
    if (res.success) {
      toast.success("Usuario eliminado")
      router.refresh()
    } else {
      toast.error(res.error || "Error al eliminar")
    }
    setLoading(null)
  }

  const handleSuspend = async (userId: string, hours: number) => {
    setLoading(userId)
    const res = await suspendUser(userId, hours)
    if (res.success) {
      toast.success(hours === 0 ? "Suspensión levantada" : `Usuario suspendido por ${hours}h`)
      router.refresh()
    } else {
      toast.error(res.error || "Error")
    }
    setLoading(userId + "_suspend") // special key to close selector
    setLoading(null)
  }

  const [suspendingUser, setSuspendingUser] = useState<string | null>(null)

  const handleChangeRole = async (userId: string, role: string) => {
    setLoading(userId)
    const res = await changeUserRole(userId, role)
    if (res.success) {
      toast.success(`Rol cambiado a ${role}`)
      router.refresh()
    } else {
      toast.error(res.error || "Error al cambiar rol")
    }
    setLoading(null)
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader className="bg-white/[0.02]">
          <TableRow className="hover:bg-transparent border-white/5 h-16">
            <TableHead className="w-[250px] font-black text-[10px] uppercase tracking-widest text-white/40 pl-8">Usuario</TableHead>
            <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40">Rol</TableHead>
            <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40">Ubicación</TableHead>
            <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40">Nivel / XP</TableHead>
            <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40">Estado</TableHead>
            <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 pr-8 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-white/5 hover:bg-white/[0.01] h-20 transition-colors">
              <TableCell className="pl-8">
                <div className="flex flex-col">
                  <span className="font-bold text-white text-base">{user.username}</span>
                  <span className="text-xs text-white/30">{user.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`rounded-full px-3 py-0.5 border-white/10 font-bold uppercase text-[9px] tracking-wider ${
                  user.role === 'admin' ? 'bg-primary/10 text-primary border-primary/20' : 
                  user.role === 'moderator' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                  'bg-white/5 text-white/40'
                }`}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium text-white/60">{user.city || "—"}</span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-primary uppercase tracking-tighter italic">Nivel {getLevelInfo(user.xp || 0).levelIndex}</span>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{getLevelInfo(user.xp || 0).level.name}</span>
                  <span className="text-[9px] text-white/20">{user.xp || 0} XP</span>
                </div>
              </TableCell>
              <TableCell>
                {user.isBlocked ? (
                  <div className="flex items-center gap-2 text-red-500">
                    <ShieldAlert className="h-4 w-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Bloqueado</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Activo</span>
                  </div>
                )}
                {user.suspendedUntil && new Date(user.suspendedUntil) > new Date() && (
                  <div className="flex items-center gap-2 text-orange-500 mt-1">
                    <Clock className="h-3 w-3" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Suspendido</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="pr-8 text-right">
                <div className="flex justify-end gap-2 relative">
                   {/* Botón de Suspensión */}
                   {suspendingUser === user.id ? (
                     <div className="absolute right-0 bottom-full mb-2 bg-card border border-white/10 rounded-2xl p-2 shadow-2xl flex gap-1 z-50 animate-in slide-in-from-bottom-2">
                       {[1, 24, 72, 168].map(h => (
                         <Button 
                          key={h} 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 text-[10px] font-bold hover:bg-primary hover:text-black rounded-lg"
                          onClick={() => {
                            handleSuspend(user.id, h)
                            setSuspendingUser(null)
                          }}
                         >
                           {h < 24 ? `${h}h` : `${Math.floor(h/24)}d`}
                         </Button>
                       ))}
                       <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-[10px] font-bold text-red-500 hover:bg-red-500/10 rounded-lg"
                        onClick={() => {
                          handleSuspend(user.id, 0)
                          setSuspendingUser(null)
                        }}
                       >
                         Quitar
                       </Button>
                       <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-white/20 hover:text-white rounded-lg"
                        onClick={() => setSuspendingUser(null)}
                       >
                         <XCircle className="h-4 w-4" />
                       </Button>
                     </div>
                   ) : (
                     <Button 
                      variant="ghost" 
                      size="icon"
                      disabled={loading === user.id}
                      onClick={() => setSuspendingUser(user.id)}
                      title="Suspender temporalmente"
                      className={`h-9 w-9 rounded-xl transition-all ${
                        user.suspendedUntil && new Date(user.suspendedUntil) > new Date() ? 'text-orange-500 bg-orange-500/10' : 'text-white/20 hover:text-orange-500 hover:bg-orange-500/10'
                      }`}
                     >
                       <Clock className="h-4 w-4" />
                     </Button>
                   )}

                   {/* Botón de Rol */}
                   <Button 
                    variant="ghost" 
                    size="icon"
                    disabled={loading === user.id}
                    onClick={() => handleChangeRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                    title={user.role === 'admin' ? "Degradar a Usuario" : "Hacer Admin"}
                    className="h-9 w-9 rounded-xl text-white/20 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                   >
                     <UserCog className="h-4 w-4" />
                   </Button>

                   {/* Botón de Bloqueo */}
                   <Button 
                    variant="ghost" 
                    size="icon"
                    disabled={loading === user.id}
                    onClick={() => handleToggleBlock(user.id)}
                    title={user.isBlocked ? "Desbloquear" : "Bloquear"}
                    className={`h-9 w-9 rounded-xl transition-all ${
                      user.isBlocked ? 'text-red-500 bg-red-500/10' : 'text-white/20 hover:text-red-500 hover:bg-red-500/10'
                    }`}
                   >
                     <Ban className="h-4 w-4" />
                   </Button>

                   {/* Botón de Borrado */}
                   <Button 
                    variant="ghost" 
                    size="icon"
                    disabled={loading === user.id || user.role === 'admin'}
                    onClick={() => handleDelete(user.id)}
                    title="Eliminar permanentemente"
                    className="h-9 w-9 rounded-xl text-white/20 hover:text-destructive hover:bg-destructive/10 transition-all"
                   >
                     <Trash2 className="h-4 w-4" />
                   </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 p-8 border-t border-white/5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/users?page=${currentPage - 1}`)}
            disabled={currentPage === 1}
            className="rounded-xl border-white/10 text-white/40 h-10 px-4"
          >
            Anterior
          </Button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "ghost"}
                size="sm"
                onClick={() => router.push(`/admin/users?page=${i + 1}`)}
                className={`w-10 h-10 rounded-xl font-bold ${currentPage === i + 1 ? 'bg-primary text-black' : 'text-white/40'}`}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/users?page=${currentPage + 1}`)}
            disabled={currentPage === totalPages}
            className="rounded-xl border-white/10 text-white/40 h-10 px-4"
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
}
