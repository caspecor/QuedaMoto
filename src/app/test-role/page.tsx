import { auth } from "@/auth"

export default async function TestRolePage() {
  const session = await auth()
  
  return (
    <div className="p-20 text-white space-y-4">
      <h1 className="text-2xl font-bold">Debug Session</h1>
      <pre className="p-4 bg-white/5 rounded-xl border border-white/10 overflow-auto">
        {JSON.stringify(session, null, 2)}
      </pre>
      <div className="mt-8">
        <p>User ID: {session?.user?.id}</p>
        <p>User Role: {session?.user?.role || "NO ROLE FOUND"}</p>
      </div>
    </div>
  )
}
