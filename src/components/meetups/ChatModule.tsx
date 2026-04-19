'use client'

import React, { useState, useEffect, useRef } from 'react'
import { getChatMessages, sendChatMessage } from '@/app/(main)/meetups/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Loader2, MessagesSquare, X, Zap, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

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

export function ChatModule({ meetupId, userId, inline = false }: { meetupId: string; userId: string; inline?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isOpen, setIsOpen] = useState(false) // Always start closed
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    loadMessages()
    const interval = setInterval(loadMessages, 5000)
    return () => clearInterval(interval)
  }, [meetupId, isOpen])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  async function loadMessages() {
    try {
      const res = await getChatMessages(meetupId)
      if (res.messages) setMessages(res.messages)
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
      if (res.error) toast.error(res.error)
      else {
        setNewMessage('')
        await loadMessages()
      }
    } catch {
      toast.error('Error al enviar mensaje')
    } finally {
      setIsSending(false)
    }
  }

  const ChatContent = (
    <div className={`flex flex-col bg-black/20 border border-white/5 rounded-[32px] overflow-hidden ${inline ? 'h-[500px] w-full shadow-2xl' : 'h-full'}`}>
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
             <MessagesSquare className="h-5 w-5" />
          </div>
          <h3 className="font-black text-white uppercase tracking-widest text-xs">
            Canal de Ruta
          </h3>
        </div>
        {!inline && (
          <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar" ref={scrollRef}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-white/20 mt-20 italic px-10 text-xs font-medium">
            No hay actividad aún. <br />Sé el primero en calentar motores. 🏍️
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.user.id === userId ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-9 w-9 border border-white/5 flex-shrink-0 shadow-lg">
                <AvatarFallback className="text-[10px] bg-white/5 text-white/40 uppercase font-black">
                  {msg.user.username?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className={`flex flex-col max-w-[75%] ${msg.user.id === userId ? 'items-end' : ''}`}>
                <span className="text-[9px] font-black text-white/20 mb-1 uppercase tracking-[0.2em]">
                  {msg.user.username}
                </span>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.user.id === userId
                    ? 'bg-primary text-white font-bold rounded-tr-none shadow-xl shadow-primary/10'
                    : 'bg-white/5 text-white/80 rounded-tl-none border border-white/5'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-white/5 bg-white/[0.02]">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <Input
            placeholder="Enviar mensaje al grupo..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="bg-white/5 border-white/5 h-12 rounded-2xl text-white placeholder:text-white/20 focus-visible:ring-primary/50"
          />
          <Button type="submit" size="icon" disabled={isSending} className="h-12 w-12 rounded-2xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 shrink-0">
            {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </div>
    </div>
  )

  if (inline && !isOpen) {
    return (
      <div
        onClick={() => setIsOpen(true)}
        className="w-full p-8 border border-white/5 bg-white/[0.02] rounded-[32px] flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all group shadow-sm"
      >
        <div className="flex items-center gap-5">
          <div className="p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform">
            <MessagesSquare className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h4 className="font-black text-white uppercase tracking-widest text-sm">Canal de Chat</h4>
            <p className="text-xs text-white/30 font-medium mt-1">Conecta con los riders de esta ruta</p>
          </div>
        </div>
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 text-white/20 group-hover:text-white transition-colors">
           <Plus className="h-6 w-6" />
        </div>
      </div>
    )
  }

  if (inline) return ChatContent

  return (
    <>
      {/* Trigger button */}
      <div
        onClick={() => setIsOpen(true)}
        className="mt-4 p-5 border border-white/5 bg-white/[0.02] rounded-3xl flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-all group shadow-sm"
      >
        <div className="p-3 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform">
          <MessagesSquare className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h4 className="font-black text-white uppercase tracking-widest text-xs">Chat del grupo</h4>
          <p className="text-[10px] text-white/30 font-medium mt-0.5">Habla con los moteros apuntados</p>
        </div>
      </div>

      {/* Slide-over panel */}
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-md animate-in slide-in-from-right duration-500 h-full">
            {ChatContent}
          </div>
        </div>
      )}
    </>
  )
}
