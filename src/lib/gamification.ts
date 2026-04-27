// ── Riding Styles ──
export const RIDING_STYLES = [
  { value: 'touring', label: '🛣️ Touring / Gran Turismo' },
  { value: 'sport', label: '🏎️ Deportiva / Sport' },
  { value: 'adventure', label: '🏔️ Trail / Adventure' },
  { value: 'cruiser', label: '🦅 Custom / Cruiser' },
  { value: 'naked', label: '💥 Naked / Streetfighter' },
  { value: 'offroad', label: '🌲 Enduro / Off-Road' },
  { value: 'urban', label: '🏙️ Urbana / Scooter' },
  { value: 'cafe_racer', label: '☕ Café Racer / Clásica' },
  { value: 'mixed', label: '🔀 Mixto / De todo un poco' },
]

// ── Level System ──
export const LEVELS = [
  { name: 'Novato',         minXp: 0,    emoji: '🏍️' },
  { name: 'Explorador',     minXp: 100,  emoji: '🏍️' },
  { name: 'Rodador',        minXp: 300,  emoji: '🏍️' },
  { name: 'Rutero',         minXp: 600,  emoji: '🏍️' },
  { name: 'Veterano',       minXp: 1000, emoji: '🏍️' },
  { name: 'Leyenda',        minXp: 1800, emoji: '🏍️' },
  { name: 'Mito del Asfalto', minXp: 3000, emoji: '🏍️' },
]

export function getLevelInfo(xp: number) {
  let current = LEVELS[0]
  let nextLevel = LEVELS[1]

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      current = LEVELS[i]
      nextLevel = LEVELS[i + 1] || null
      break
    }
  }

  const levelIndex = LEVELS.indexOf(current)
  const xpInLevel = xp - current.minXp
  const xpNeeded = nextLevel ? nextLevel.minXp - current.minXp : 0
  const progress = nextLevel ? Math.min((xpInLevel / xpNeeded) * 100, 100) : 100

  return {
    level: current,
    levelIndex: levelIndex + 1,
    totalLevels: LEVELS.length,
    nextLevel,
    xp,
    xpInLevel,
    xpNeeded,
    progress,
    isMaxLevel: !nextLevel,
  }
}

// ── XP Rewards ──
export const XP_REWARDS = {
  CREATE_MEETUP: 50,      // Crear una quedada
  JOIN_MEETUP: 25,        // Unirse a una quedada
  SEND_MESSAGE: 5,        // Enviar un mensaje en el chat
  COMPLETE_PROFILE: 30,   // Completar el perfil (avatar, ciudad, estilo...)
  FIRST_MEETUP: 100,      // Primera quedada creada (bonus)
  SHARE_INVITE: 15,       // Compartir enlace de invitación
  DAILY_LOGIN: 10,        // Bonus por entrar cada día
}
