import { getAllUsers, getAdminStats } from "@/app/admin/actions"
import { UsersTable } from "@/components/admin/UsersTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserMinus, ShieldAlert } from "lucide-react"

export const metadata = {
  title: "Gestión de Usuarios - Admin",
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const currentPage = parseInt(page || "1")
  
  const { users, total, pages } = await getAllUsers(currentPage)
  const stats = await getAdminStats()

  return (
    <div className="space-y-8 animate-reveal">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tight">GESTIÓN DE USUARIOS</h1>
          <p className="text-white/40 font-medium">Control total sobre la comunidad QuedaMoto</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/[0.02] border-white/5 rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users className="h-16 w-16 text-primary" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-white/40">Total Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-white italic">{stats.totalUsers}</p>
            <p className="text-xs text-green-400 font-bold mt-2">+{stats.newUsersThisWeek} esta semana</p>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.02] border-white/5 rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <UserCheck className="h-16 w-16 text-green-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-white/40">Usuarios Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-white italic">{stats.totalUsers - stats.blockedUsers}</p>
            <p className="text-xs text-white/20 font-bold mt-2">Sin restricciones</p>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.02] border-white/5 rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldAlert className="h-16 w-16 text-red-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-white/40">Bloqueados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-red-500 italic">{stats.blockedUsers}</p>
            <p className="text-xs text-white/20 font-bold mt-2">Requieren revisión</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
          <CardTitle className="text-xl font-black flex items-center gap-3 italic">
            <Users className="w-6 h-6 text-primary" /> LISTADO DE RIDERS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <UsersTable 
            users={users} 
            totalPages={pages} 
            currentPage={currentPage} 
          />
        </CardContent>
      </Card>
    </div>
  )
}