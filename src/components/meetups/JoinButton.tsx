'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { joinMeetupAction, leaveMeetupAction } from '@/app/(main)/meetups/actions'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface JoinButtonProps {
  meetupId: string
  isAttending: boolean
}

export function JoinButton({ meetupId, isAttending }: JoinButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleAction() {
    setIsLoading(true)
    try {
      if (isAttending) {
        const res = await leaveMeetupAction(meetupId)
        if (res.error) toast.error(res.error)
        else toast.success('Has abandonado la quedada')
      } else {
        const res = await joinMeetupAction(meetupId)
        if (res.error) toast.error(res.error)
        else toast.success('¡Te has unido a la quedada!')
      }
    } catch (error) {
      toast.error('Ocurrió un error inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      className={`w-full text-lg h-14 rounded-full font-bold shadow-2xl transition-all ${
        isAttending 
          ? 'border-2 border-destructive/50 text-destructive bg-destructive/5 hover:bg-destructive hover:text-white' 
          : 'bg-primary text-primary-foreground shadow-primary/25 hover:scale-[1.02]'
      }`}
      onClick={handleAction}
      disabled={isLoading}
    >
      {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
      {isAttending ? 'Abandonar Quedada' : '¡Apunta mi nombre!'}
    </Button>
  )
}
