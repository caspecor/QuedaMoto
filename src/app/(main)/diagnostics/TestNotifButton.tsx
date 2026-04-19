'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { createTestNotification } from '../meetups/actions'

export function TestNotifButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    setLoading(true)
    try {
      const res = await createTestNotification(userId)
      if (res.success) {
        toast.success("Notificación de prueba enviada. Debería aparecer en unos segundos.")
      } else {
        toast.error("Error: " + res.error)
      }
    } catch (err) {
      toast.error("Error al enviar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleTest} 
      disabled={loading}
      className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
    >
      {loading ? "Enviando..." : "Enviar Notificación de Prueba (Tú Mismo)"}
    </Button>
  )
}
