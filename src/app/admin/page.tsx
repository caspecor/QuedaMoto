import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, MessageSquare, AlertTriangle } from "lucide-react"
import { getAdminStats } from "@/app/admin/actions"

export const metadata = {
  title: "Panel de Administración - QuedaMoto",
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-white">Panel de Administración</h1>
      </div>

      <div className="bg-card border-border/50 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">🏍️ Bienvenido al Panel de Administración</h2>
        <p className="text-white/60 text-lg">
          Desde aquí puedes gestionar toda la plataforma QuedaMoto.
          Todas las funcionalidades están preparadas para su implementación.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Gestión de Usuarios</h3>
          <p className="text-white/60 text-sm mb-4">
            Administra usuarios, roles y permisos de la plataforma.
          </p>
          <a
            href="/admin/users"
            className="inline-flex items-center px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm font-medium transition-colors"
          >
            Gestionar Usuarios →
          </a>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Quedadas</h3>
          <p className="text-white/60 text-sm mb-4">
            Supervisa y modera todas las quedadas de la comunidad.
          </p>
          <a
            href="/admin/meetups"
            className="inline-flex items-center px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm font-medium transition-colors"
          >
            Gestionar Quedadas →
          </a>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Mensajes</h3>
          <p className="text-white/60 text-sm mb-4">
            Modera conversaciones y contenido de la plataforma.
          </p>
          <a
            href="/admin/messages"
            className="inline-flex items-center px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-sm font-medium transition-colors"
          >
            Moderar Mensajes →
          </a>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Estadísticas</h3>
          <p className="text-white/60 text-sm mb-4">
            Métricas y análisis del rendimiento de la plataforma.
          </p>
          <button
            disabled
            className="inline-flex items-center px-4 py-2 bg-orange-500/20 text-orange-400/50 rounded-lg text-sm font-medium cursor-not-allowed"
          >
            Próximamente
          </button>
        </div>
      </div>

      <div className="bg-card border-border/50 rounded-lg p-8">
        <h2 className="text-xl font-bold text-white mb-4">🚀 Estado de las Funcionalidades</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-3">✅ Implementado</h3>
            <ul className="text-white/60 space-y-2">
              <li>• Autenticación completa (NextAuth v4)</li>
              <li>• Base de datos con Neon/Vercel Postgres</li>
              <li>• Sistema de roles de usuario</li>
              <li>• Protección de rutas admin</li>
              <li>• Estructura del panel de administración</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">🚧 Próximamente</h3>
            <ul className="text-white/60 space-y-2">
              <li>• Gestión avanzada de usuarios</li>
              <li>• Moderación de contenido</li>
              <li>• Dashboard con estadísticas</li>
              <li>• Logs de actividad</li>
              <li>• Sistema de reportes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}