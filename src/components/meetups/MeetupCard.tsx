'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Users, ChevronRight, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export interface MeetupCardProps {
  meetup: {
    id: string
    title: string
    date: string
    time: string
    type: string
    level_required: string
    max_attendees: number
    attendees_count?: number
    image?: string
  }
}

export function MeetupCard({ meetup }: MeetupCardProps) {
  // Use a default premium motorcycle image if none provided
  const imageUrl = meetup.image || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000"

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Link href={`/meetups/${meetup.id}`}>
        <div className="relative group overflow-hidden rounded-3xl glass-card h-[380px] flex flex-col">
          {/* Image Header */}
          <div className="relative h-48 w-full overflow-hidden">
            <Image 
              src={imageUrl} 
              alt={meetup.title} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full bg-primary text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20">
                {meetup.type}
              </span>
              <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/90">
                {meetup.level_required}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="line-clamp-2 text-lg font-black text-white leading-tight group-hover:text-primary transition-colors">
                {meetup.title}
              </h3>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-white/40">
                  <Calendar className="h-3.5 w-3.5 text-primary/60" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">{meetup.date} @ {meetup.time}</span>
                </div>
                <div className="flex items-center gap-2 text-white/40">
                  <MapPin className="h-3.5 w-3.5 text-primary/60" />
                  <span className="text-[11px] font-bold tracking-tight truncate max-w-[200px]">Punto de encuentro marcado</span>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Users className="h-4 w-4 text-white/30" />
                </div>
                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">
                  {meetup.attendees_count || 0} / {meetup.max_attendees} Riders
                </span>
              </div>
              
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </div>
          
          {/* Subtle Glow on Hover */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </div>
      </Link>
    </motion.div>
  )
}
