import { auth } from "@/auth"
import { db } from "@/db"
import { notifications, users, attendees, meetups } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import { TestNotifButton } from "./TestNotifButton"

export default async function DiagnosticsPage() {
  const session = await auth()
  const user = session?.user

  const allNotifications = await db.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(50)
  const allUsers = await db.select().from(users).limit(10)
  const allAttendees = await db.select().from(attendees).limit(20)

  return (
    <div className="container px-4 pt-32 pb-20 max-w-4xl mx-auto space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black text-white">Diagnóstico de Sistema</h1>
        {user && <TestNotifButton userId={user.id!} />}
      </div>

      <section className="p-8 glass rounded-3xl space-y-4 border border-white/10">
        <h2 className="text-xl font-bold text-primary italic underline">Sesión Actual</h2>
        <pre className="text-xs bg-black/40 p-4 rounded-xl overflow-auto text-green-400">
          {JSON.stringify({ 
             user_id: user?.id,
             name: user?.name,
             email: user?.email
          }, null, 2)}
        </pre>
      </section>

      <section className="p-8 glass rounded-3xl space-y-6 border border-white/10">
        <h2 className="text-xl font-bold text-primary italic underline">Últimas 50 Notificaciones (Global)</h2>
        <div className="space-y-4">
          {allNotifications.map((n: any) => (
            <div key={n.id} className="p-4 bg-white/[0.03] rounded-xl border border-white/5 text-xs">
              <div className="flex justify-between font-bold text-white/60 mb-2">
                <span>ID: {n.id}</span>
                <span className={n.user_id === user?.id ? "text-primary bg-primary/20 px-2 rounded" : "text-white/20"}>
                  Para Usuario: {n.user_id} {n.user_id === user?.id ? "(TÚ)" : ""}
                </span>
              </div>
              <p className="text-white">Tit: {n.title}</p>
              <p className="text-white/40">Msg: {n.message}</p>
              <p className="text-[10px] text-white/20 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
          ))}
          {allNotifications.length === 0 && <p className="text-white/20">No hay notificaciones en la BD.</p>}
        </div>
      </section>

      <section className="p-8 glass rounded-3xl space-y-4 border border-white/10">
        <h2 className="text-xl font-bold text-primary italic underline">Usuarios de Prueba (Primeros 10)</h2>
        <div className="grid grid-cols-2 gap-4">
           {allUsers.map((u: any) => (
             <div key={u.id} className="p-3 bg-white/5 rounded-lg text-[10px]">
               <p className="font-bold text-white">{u.username}</p>
               <p className="text-white/40">{u.id}</p>
             </div>
           ))}
        </div>
      </section>

       <section className="p-8 glass rounded-3xl space-y-4 border border-white/10">
        <h2 className="text-xl font-bold text-primary italic underline">Asistentes en BD (Muestra)</h2>
        <div className="space-y-2">
           {allAttendees.map((a: any) => (
             <div key={a.id} className="p-2 bg-white/5 rounded text-[10px] flex justify-between">
               <span>Ruta: {a.meetup_id.substring(0,8)}...</span>
               <span className="text-primary font-bold">User: {a.user_id}</span>
             </div>
           ))}
        </div>
      </section>
    </div>
  )
}
