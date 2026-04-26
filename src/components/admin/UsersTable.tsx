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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Shield, ShieldAlert, Trash2, UserCog, Ban, CheckCircle } from "lucide-react"
import { toggleUserBlock, deleteUser, changeUserRole } from "@/app/admin/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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
              </TableCell>
              <TableCell className="pr-8 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-white/20 hover:text-white hover:bg-white/5">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-card border-white/10 rounded-2xl shadow-2xl">
                    <DropdownMenuLabel className="text-[10px] uppercase font-black tracking-widest text-white/30 p-4">Gestionar Rider</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/5" />
                    
                    <DropdownMenuItem onClick={() => handleToggleBlock(user.id)} className="p-3 cursor-pointer">
                      {user.isBlocked ? (
                        <div className="flex items-center gap-3 text-green-500">
                          <CheckCircle className="w-4 h-4" /> <span>Desbloquear</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-red-500">
                          <Ban className="w-4 h-4" /> <span>Bloquear</span>
                        </div>
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-white/5" />
                    
                    <DropdownMenuLabel className="text-[10px] uppercase font-black tracking-widest text-white/30 p-4 pt-2">Cambiar Rol</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleChangeRole(user.id, 'user')} className="p-3 cursor-pointer">
                      Usuario Estándar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleChangeRole(user.id, 'moderator')} className="p-3 cursor-pointer">
                      Moderador
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleChangeRole(user.id, 'admin')} className="p-3 cursor-pointer text-primary">
                      Administrador
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-white/5" />
                    
                    <DropdownMenuItem 
                      onClick={() => handleDelete(user.id)}
                      className="p-3 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                      disabled={user.role === 'admin'}
                    >
                      <div className="flex items-center gap-3">
                        <Trash2 className="w-4 h-4" /> <span>Eliminar Permanentemente</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
