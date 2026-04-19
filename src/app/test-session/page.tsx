import { auth } from "@/auth"

export default async function TestSessionPage() {
  const session = await auth()
  
  return (
    <div className="p-10 bg-background text-foreground h-screen">
      <h1 className="text-2xl font-bold mb-4">Debug de Sesión</h1>
      <pre className="bg-muted p-4 rounded-lg overflow-auto">
        {JSON.stringify(session, null, 2)}
      </pre>
      {!session && <p className="mt-4 text-destructive font-bold">Sin sesión activa</p>}
      {session && <p className="mt-4 text-primary font-bold">Sesión iniciada como: {session.user?.email}</p>}
      <div className="mt-10">
        <a href="/auth/login" className="text-blue-500 underline">Volver al login</a>
      </div>
    </div>
  )
}
