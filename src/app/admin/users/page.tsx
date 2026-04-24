import { getAllUsers, toggleUserBlock, deleteUser, changeUserRole } from "@/app/admin/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Shield, User, Crown, Ban, CheckCircle, Trash2 } from "lucide-react"
import { format } from 'date-fns'

export default async function AdminUsersPage() {
  const { users } = await getAllUsers()

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4 text-yellow-500" />
      case 'moderator': return <Shield className="h-4 w-4 text-blue-500" />
      default: return <User className="h-4 w-4 text-gray-500" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default'
      case 'moderator': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-white">Gestión de Usuarios</h1>
        <Badge variant="outline" className="text-white/60">
          {users.length} usuarios totales
        </Badge>
      </div>

      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-white">Todos los Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white/60">Usuario</TableHead>
                <TableHead className="text-white/60">Rol</TableHead>
                <TableHead className="text-white/60">Estado</TableHead>
                <TableHead className="text-white/60">Registro</TableHead>
                <TableHead className="text-white/60">Moto</TableHead>
                <TableHead className="text-white/60">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || undefined} />
                        <AvatarFallback className="text-xs">
                          {user.username?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-white">{user.username}</div>
                        <div className="text-sm text-white/60">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role || 'user')} className="flex items-center gap-1 w-fit">
                      {getRoleIcon(user.role || 'user')}
                      {user.role || 'user'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.isBlocked ? (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <Ban className="h-3 w-3" />
                        Bloqueado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-green-500 border-green-500 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Activo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-white/60">
                    {user.createdAt ? format(new Date(user.createdAt), 'dd/MM/yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell className="text-white/60">
                    {user.moto_brand && user.moto_model ? `${user.moto_brand} ${user.moto_model}` : 'Sin moto'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border/50">
                        <DropdownMenuItem className="text-white/60 hover:text-white">
                          Ver perfil
                        </DropdownMenuItem>
                        {user.role !== 'admin' && (
                          <>
                            <DropdownMenuItem className="text-white/60 hover:text-white">
                              Cambiar rol
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={user.isBlocked ? "text-green-500" : "text-red-500"}
                            >
                              {user.isBlocked ? 'Desbloquear' : 'Bloquear'}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}