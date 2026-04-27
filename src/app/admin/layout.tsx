import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/AdminSidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || session.user?.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="md:ml-64 pt-14 md:pt-0 p-4 md:p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}