import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MessageSquare, AlertTriangle } from "lucide-react"
import { format } from 'date-fns'
import { getRecentMessages } from "@/app/admin/actions"

export default async function AdminMessagesPage() {
  const { messages, flaggedMessages } = await getRecentMessages()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-white">Gestión de Mensajes</h1>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-white/60">
            {messages.length} mensajes recientes
          </Badge>
          {flaggedMessages.length > 0 && (
            <Badge variant="destructive">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {flaggedMessages.length} marcados
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Mensajes Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{message.user?.username || 'Usuario'}</span>
                      <Badge variant="outline" className="text-xs">
                        {message.meetup?.title?.substring(0, 20)}...
                      </Badge>
                    </div>
                    <span className="text-xs text-white/40">
                      {format(new Date(message.createdAt), 'HH:mm dd/MM', { locale: es })}
                    </span>
                  </div>
                  <p className="text-sm text-white/80">{message.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Flagged Messages */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Mensajes Marcados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {flaggedMessages.length > 0 ? (
                flaggedMessages.map((message) => (
                  <div key={message.id} className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{message.user?.username || 'Usuario'}</span>
                        <Badge variant="destructive" className="text-xs">
                          Reportado
                        </Badge>
                      </div>
                      <span className="text-xs text-white/40">
                      {format(new Date(message.createdAt), 'HH:mm dd/MM')}
                      </span>
                    </div>
                    <p className="text-sm text-white/80">{message.content}</p>
                    <div className="mt-2 flex gap-2">
                      <Badge variant="outline" className="text-xs text-warning">
                        Moderar
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-white/40">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay mensajes marcados</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}