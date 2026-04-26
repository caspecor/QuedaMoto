import { getRecentMessages } from "@/app/admin/actions"
import { MessagesTable } from "@/components/admin/MessagesTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, ShieldAlert } from "lucide-react"

export const metadata = {
  title: "Moderación de Mensajes - Admin",
}

export default async function AdminMessagesPage() {
  const { messages, flaggedMessages } = await getRecentMessages()

  return (
    <div className="space-y-8 animate-reveal">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tight uppercase">Moderación de Mensajes</h1>
          <p className="text-white/40 font-medium">Supervisa la actividad en los chats de las rutas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/[0.02] border-white/5 rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <MessageSquare className="h-16 w-16 text-primary" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-white/40">Mensajes Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-white italic">{messages.length}</p>
            <p className="text-xs text-white/20 font-bold mt-2">Últimos 50 mensajes</p>
          </CardContent>
        </Card>

        <Card className="bg-red-500/10 border-red-500/20 rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldAlert className="h-16 w-16 text-red-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-red-500/60">Posibles Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-red-500 italic">{flaggedMessages.length}</p>
            <p className="text-xs text-red-500/40 font-bold mt-2">Requieren supervisión</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
          <CardTitle className="text-xl font-black flex items-center gap-3 italic text-primary">
            <MessageSquare className="w-6 h-6" /> ACTIVIDAD RECIENTE EN CHATS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <MessagesTable messages={messages} />
        </CardContent>
      </Card>
    </div>
  )
}