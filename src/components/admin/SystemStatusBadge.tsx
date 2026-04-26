'use client'

import { useState, useEffect, useRef } from 'react'
import { Activity, Wifi, WifiOff, Clock, Server, Globe, Zap, ChevronUp } from 'lucide-react'

interface SystemStats {
  ping: number | null
  apiResponseTime: number | null
  status: 'online' | 'degraded' | 'offline'
  connectionType: string
  downlink: string
  rtt: string
  uptime: string
}

function formatMs(ms: number | null) {
  if (ms === null) return '—'
  return `${ms}ms`
}

function getPingColor(ms: number | null) {
  if (ms === null) return 'text-white/30'
  if (ms < 80) return 'text-green-400'
  if (ms < 200) return 'text-yellow-400'
  return 'text-red-400'
}

export function SystemStatusBadge() {
  const [stats, setStats] = useState<SystemStats>({
    ping: null,
    apiResponseTime: null,
    status: 'online',
    connectionType: '—',
    downlink: '—',
    rtt: '—',
    uptime: '—',
  })
  const [showTooltip, setShowTooltip] = useState(false)
  const startTime = useRef(Date.now())

  async function measurePing() {
    try {
      const t0 = performance.now()
      await fetch('/api/notifications/unread', { cache: 'no-store' })
      const t1 = performance.now()
      return Math.round(t1 - t0)
    } catch {
      return null
    }
  }

  async function measureApiResponse() {
    try {
      const t0 = performance.now()
      await fetch('/api/visits', { method: 'HEAD', cache: 'no-store' }).catch(() => fetch('/api/notifications/unread', { cache: 'no-store' }))
      const t1 = performance.now()
      return Math.round(t1 - t0)
    } catch {
      return null
    }
  }

  function getNetworkInfo() {
    const nav = navigator as any
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection
    if (!conn) return { type: 'Desconocido', downlink: '—', rtt: '—' }
    return {
      type: conn.effectiveType?.toUpperCase() || conn.type || 'Desconocido',
      downlink: conn.downlink ? `${conn.downlink} Mbps` : '—',
      rtt: conn.rtt ? `${conn.rtt}ms` : '—',
    }
  }

  function getUptime() {
    const elapsed = Math.floor((Date.now() - startTime.current) / 1000)
    const h = Math.floor(elapsed / 3600).toString().padStart(2, '0')
    const m = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0')
    const s = (elapsed % 60).toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  async function refresh() {
    const [ping, api] = await Promise.all([measurePing(), measureApiResponse()])
    const net = getNetworkInfo()
    const status = ping === null ? 'offline' : ping > 500 ? 'degraded' : 'online'

    setStats({
      ping,
      apiResponseTime: api,
      status,
      connectionType: net.type,
      downlink: net.downlink,
      rtt: net.rtt,
      uptime: getUptime(),
    })
  }

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 10000) // refresca cada 10s
    const uptimeInterval = setInterval(() => {
      setStats(prev => ({ ...prev, uptime: getUptime() }))
    }, 1000)
    return () => {
      clearInterval(interval)
      clearInterval(uptimeInterval)
    }
  }, [])

  const statusColor = stats.status === 'online'
    ? 'bg-green-500'
    : stats.status === 'degraded'
    ? 'bg-yellow-500'
    : 'bg-red-500'

  const statusLabel = stats.status === 'online'
    ? 'Sistema Online'
    : stats.status === 'degraded'
    ? 'Degradado'
    : 'Sin Conexión'

  return (
    <div
      className="relative"
      onMouseEnter={() => { setShowTooltip(true); refresh() }}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Badge */}
      <div className="px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3 cursor-default select-none hover:bg-white/[0.05] transition-colors">
        <div className={`h-2 w-2 rounded-full ${statusColor} animate-pulse`} />
        <span className="text-xs font-black uppercase tracking-widest text-white/60">{statusLabel}</span>
        <Activity className="h-3.5 w-3.5 text-white/20" />
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute right-0 top-full mt-3 w-80 z-50 animate-in fade-in zoom-in-95 duration-200">
          {/* Arrow */}
          <div className="absolute -top-2 right-6 w-4 h-2 overflow-hidden">
            <div className="w-3 h-3 bg-[#111] border border-white/10 rotate-45 translate-y-1.5 translate-x-0.5" />
          </div>

          <div className="bg-[#111] border border-white/10 rounded-3xl p-6 space-y-5 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Estado del Sistema</span>
              <div className="flex items-center gap-1.5">
                <div className={`h-1.5 w-1.5 rounded-full ${statusColor} animate-pulse`} />
                <span className={`text-[10px] font-black uppercase ${stats.status === 'online' ? 'text-green-400' : stats.status === 'degraded' ? 'text-yellow-400' : 'text-red-400'}`}>
                  {statusLabel}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {/* Ping */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Latencia (Ping)</p>
                    <p className={`text-sm font-black ${getPingColor(stats.ping)}`}>
                      {formatMs(stats.ping)}
                    </p>
                  </div>
                </div>
                {stats.ping !== null && (
                  <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                    stats.ping < 80 ? 'bg-green-500/10 text-green-400' :
                    stats.ping < 200 ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {stats.ping < 80 ? 'Excelente' : stats.ping < 200 ? 'Bueno' : 'Lento'}
                  </div>
                )}
              </div>

              {/* API Response */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Server className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Respuesta API</p>
                    <p className={`text-sm font-black ${getPingColor(stats.apiResponseTime)}`}>
                      {formatMs(stats.apiResponseTime)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Network */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Wifi className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Tipo de Red</p>
                    <p className="text-sm font-black text-white">{stats.connectionType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/20 font-bold">{stats.downlink}</p>
                  <p className="text-[10px] text-white/20 font-bold">RTT: {stats.rtt}</p>
                </div>
              </div>

              {/* Uptime */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Sesión Activa</p>
                    <p className="text-sm font-black text-white font-mono">{stats.uptime}</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[9px] text-white/15 text-center font-medium">
              Actualización automática cada 10s · {new Date().toLocaleTimeString('es-ES')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
