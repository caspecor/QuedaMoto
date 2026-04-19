'use client'

import React, { useState, useEffect, useRef } from 'react'
import { getChatMessages, sendChatMessage } from '@/app/(main)/meetups/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface Message {
  id: string
  content: string
  createdAt: any
  user: {
    id: string
    username: string
    avatar: string | null
  }
}

export function ChatModule({ meetupId, userId }: { meetupId: string; userId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
    const interval = setInterval(loadMessages, 5000) // Poll every 5s for simple "realtime"
    return () => clearInterval(interval)
  }, [meetupId])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  async function loadMessages() {
    try {
      const res = await getChatMessages(meetupId)
      if (res.messages) {
        setMessages(res.messages)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    try {
      const res = await sendChatMessage(meetupId, newMessage)
      if (res.error) {
        toast.error(res.error)
      } else {
        setNewMessage('')
        await loadMessages()
      }
    } catch (error) {
      toast.error('Error al enviar mensaje')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="mt-4 p-4 border border-primary/20 bg-primary/5 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-primary/10 transition-colors shadow-sm">
          <div className="p-3 bg-background rounded-full shadow-sm">
            <Send className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-foreground font-sans">Chat del grupo</h4>
            <p className="text-xs text-muted-foreground mt-0.5 tracking-tight">Habla con los moteros apuntados</p>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col glass border-l border-white/10 shadow-2xl">
        <SheetHeader className="p-6 border-b border-white/5 bg-primary/5">
          <SheetTitle className="flex items-center gap-2 text-primary font-bold">
            <Send className="h-5 w-5" /> Chat de la Ruta
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-muted-foreground mt-20 italic px-10">
              Todavía no hay mensajes. ¡Sé el primero en saludar! 🏍️
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.user.id === userId ? 'flex-row-reverse' : ''}`}>
                <Avatar className="h-8 w-8 border border-white/10">
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary uppercase font-bold">
                    {msg.user.username?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className={`flex flex-col max-w-[80%] ${msg.user.id === userId ? 'items-end' : ''}`}>
                  <span className="text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">
                    {msg.user.username}
                  </span>
                  <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                    msg.user.id === userId 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-muted/50 text-foreground rounded-tl-none border border-white/5'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-white/5 bg-background/50 backdrop-blur-md">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input 
              placeholder="Escribe algo..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="bg-muted/50 border-white/10 focus-visible:ring-primary h-11 rounded-xl"
            />
            <Button type="submit" size="icon" disabled={isSending} className="h-11 w-11 rounded-xl shadow-lg">
              {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
