# 🏍️ QuedaMoto

> **La plataforma social para moteros.** Organiza rutas, conecta con riders de tu zona y vive la moto en comunidad.

[![Deploy with Vercel](https://vercel.com/button)](https://quedamoto.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?logo=drizzle)](https://orm.drizzle.team)

---

## 📋 Índice

- [Descripción](#descripción)
- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Variables de Entorno](#variables-de-entorno)
- [Panel de Administración](#panel-de-administración)
- [Guía de Uso](#guía-de-uso)
- [Despliegue](#despliegue)

---

## 📖 Descripción

**QuedaMoto** es una plataforma social full-stack diseñada exclusivamente para la comunidad motera. Permite a los usuarios crear, descubrir y unirse a rutas y quedadas de motos, chatear con otros riders en tiempo real y gestionar toda la comunidad desde un potente panel de administración.

---

## ✨ Características

### 🗺️ Rutas y Quedadas
- **Creación de rutas**: Los usuarios pueden publicar nuevas quedadas con fecha, hora, nivel requerido, punto de encuentro geolocalizando en mapa interactivo y plazas máximas.
- **Explorador de rutas**: Mapa interactivo con Mapbox que muestra todas las rutas disponibles en tiempo real con filtros por ubicación.
- **Compartir por WhatsApp**: Botón directo para invitar a amigos a cualquier ruta vía WhatsApp.
- **Unirse / Abandonar**: Sistema de apuntarse a rutas con control de aforo.
- **Editar / Eliminar**: El organizador de cada ruta puede modificarla o eliminarla.

### 💬 Chat en Tiempo Real
- **Canal de ruta**: Cada quedada tiene su propio canal de chat exclusivo para los asistentes.
- **Mensajes instantáneos**: Sistema de polling en tiempo real para recibir mensajes sin recargar.
- **Slide-over panel**: El chat se abre en un panel lateral deslizante sobre el mapa.
- **Perfil inline**: Avatar y nombre de cada participante junto a sus mensajes.

### 👤 Perfiles de Usuario
- **Mi Garaje** (Dashboard): Vista personalizada con las próximas rutas del usuario y sus notificaciones.
- **Perfil público**: Cada rider tiene una página pública con su avatar, nombre y rutas organizadas.
- **Avatar personalizable**: Subida de foto de perfil con previsualización en tiempo real.
- **Sincronización instantánea**: El avatar se actualiza en la navbar sin necesidad de reiniciar sesión.

### 🔔 Notificaciones
- **Notificaciones en tiempo real**: Sistema de polling que alerta sobre nuevas rutas, mensajes y actividad.
- **Badge de no leídas**: Indicador visual en la barra de navegación con el contador de notificaciones pendientes.
- **Centro de notificaciones**: Lista organizada de todas las alertas con opción de marcar como leída.

### 🔐 Autenticación y Seguridad
- **NextAuth.js**: Sistema de autenticación seguro con sesiones JWT.
- **Registro/Login**: Formularios de registro e inicio de sesión con validación.
- **Protección de rutas**: Middleware que protege todas las rutas de la aplicación.
- **Control de roles**: Sistema de roles `user` / `admin` con permisos diferenciados.

### 🛡️ Moderación y Seguridad Comunitaria
- **Reportar usuarios**: Desde cualquier quedada o chat, los usuarios pueden reportar a otros por:
  - Conducta inapropiada
  - Insultos o amenazas
  - Spam o estafa
  - Contenido ofensivo
- **Panel de incidencias**: El admin recibe todos los reportes organizados con:
  - Información del denunciante y denunciado
  - Motivo y descripción detallada
  - Quedada donde ocurrió el incidente
  - Acciones directas: Resolver, Descartar o Bloquear permanentemente
- **Bloqueo de cuentas**: Los usuarios bloqueados ven un overlay de "Cuenta Bloqueada" con botón de contacto al soporte.
- **Suspensiones temporales**: Posibilidad de suspender cuentas por horas con cuenta atrás visible.
- **Enforcement instantáneo**: Las suspensiones y bloqueos se aplican en tiempo real sin necesidad de que el usuario cierre sesión.

### 📊 Analytics y Estadísticas
- **Tracking de visitas**: Se registra automáticamente cada visita con:
  - Dirección IP
  - Ruta visitada
  - User Agent (dispositivo/navegador)
  - Ciudad, país y coordenadas (geolocalización via Vercel)
- **Panel de Stats**: Dashboard en el admin con:
  - Total de visitas
  - IPs únicas
  - Top ciudades
  - Tabla de datos completa con fechas
- **Exportar a Excel**: Descarga todos los datos de visitas en formato `.xlsx` con un solo clic.

### ⚙️ Panel de Administración
Accesible en `/admin` (solo para usuarios con rol `admin`):

#### 👥 Gestión de Usuarios
- Lista completa de todos los usuarios registrados
- Ver email, fecha de registro y estado de cuenta
- Cambiar rol (user ↔ admin)
- Suspender temporalmente (1h, 24h, 7 días, indefinido)
- Bloquear permanentemente
- Ver historial de incidencias por usuario

#### 🗓️ Gestión de Quedadas
- Vista completa de todas las rutas creadas
- Capacidad de eliminar cualquier ruta inapropiada

#### 💬 Gestión de Mensajes
- Monitoreo de todos los mensajes del chat
- Eliminación de mensajes inapropiados

#### 🚩 Reportes e Incidencias
- Panel centralizado de todas las denuncias
- Filtrado por estado (Pendiente / Resuelto / Descartado)
- Acciones rápidas sin salir del panel

#### 📈 Estadísticas (Stats)
- Métricas de visitas en tiempo real
- Geolocalización de visitantes
- Exportación a Excel

#### ⚙️ Configuración del Sitio
- **Google Search Console**: Insertar código de verificación SEO
- **Título de la Pestaña (SEO)**: Personalizar el title que ve Google y la pestaña del navegador
- **Nombre de la Marca**: El texto que aparece junto al logo en la navbar
- **Logo personalizado**: URL o subida directa de imagen (PNG/SVG/JPG)
- **Favicon personalizado**: URL o subida directa del icono de la pestaña

---

## 🛠️ Stack Tecnológico

| Categoría | Tecnología |
|-----------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Lenguaje** | TypeScript 5 |
| **Estilos** | Tailwind CSS v4 |
| **Componentes UI** | Base UI + shadcn/ui + Framer Motion |
| **Base de Datos** | PostgreSQL (Vercel Postgres / Neon) |
| **ORM** | Drizzle ORM |
| **Autenticación** | NextAuth.js v5 |
| **Mapas** | Mapbox GL JS |
| **Animaciones** | Framer Motion |
| **Exportación** | SheetJS (xlsx) |
| **Notificaciones** | Sonner |
| **Fuentes** | Geist (Next.js Font) |
| **Despliegue** | Vercel |

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── (main)/               # Rutas protegidas (requieren sesión)
│   │   ├── layout.tsx        # Layout con Navbar, BottomNav, checks de suspensión/bloqueo
│   │   ├── dashboard/        # Mi Garaje
│   │   ├── explore/          # Explorador de rutas con mapa
│   │   ├── meetups/
│   │   │   ├── [id]/         # Detalle de quedada + Chat
│   │   │   └── create/       # Crear nueva quedada
│   │   ├── profile/          # Perfil propio
│   │   └── riders/[id]/      # Perfil público de rider
│   ├── admin/                # Panel de administración (solo admin)
│   │   ├── page.tsx          # Dashboard admin
│   │   ├── users/            # Gestión de usuarios
│   │   ├── meetups/          # Gestión de quedadas
│   │   ├── messages/         # Gestión de mensajes
│   │   ├── reports/          # Panel de incidencias 🆕
│   │   ├── stats/            # Analytics 🆕
│   │   ├── settings/         # Configuración del sitio 🆕
│   │   └── actions.ts        # Server actions del admin
│   ├── actions/
│   │   └── moderation.ts     # Acción de reporte de usuario 🆕
│   ├── api/
│   │   ├── auth/             # NextAuth handler
│   │   ├── notifications/    # API de notificaciones
│   │   └── visits/           # API de tracking de visitas 🆕
│   ├── auth/                 # Páginas de login/registro
│   └── layout.tsx            # Root layout (metadata dinámica, GSC)
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx
│   │   ├── UsersTable.tsx
│   │   ├── StatsPanel.tsx    # 🆕
│   │   ├── ReportsTable.tsx  # 🆕
│   │   └── SettingsPanel.tsx # 🆕
│   ├── layout/
│   │   ├── Navbar.tsx        # Navbar con branding dinámico
│   │   ├── BottomNav.tsx     # Nav móvil
│   │   ├── SuspensionOverlay.tsx
│   │   ├── BlockedOverlay.tsx # 🆕
│   │   ├── NotificationListener.tsx
│   │   └── VisitTracker.tsx  # 🆕
│   ├── meetups/
│   │   ├── ChatModule.tsx    # Chat en tiempo real
│   │   ├── JoinButton.tsx
│   │   └── OrganizerControls.tsx
│   ├── moderation/
│   │   └── ReportUserModal.tsx # 🆕
│   ├── map/
│   │   └── MapboxView.tsx
│   └── ui/                   # Componentes base
├── db/
│   ├── index.ts              # Conexión a la base de datos
│   └── schema.ts             # Esquema completo (users, meetups, messages, attendees, notifications, settings, visits, reports)
└── auth.ts                   # Configuración NextAuth
```

---

## 🚀 Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/caspecor/QuedaMoto.git
cd QuedaMoto

# 2. Instalar dependencias
npm install

# 3. Copiar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales

# 4. Sincronizar base de datos
npx drizzle-kit push

# 5. Iniciar en desarrollo
npm run dev
```

---

## 🔑 Variables de Entorno

```env
# Base de datos (Vercel Postgres / Neon)
POSTGRES_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."

# NextAuth
AUTH_SECRET="tu-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN="pk.eyJ1..."

# App
NEXT_PUBLIC_APP_URL="https://quedamoto.vercel.app"
```

---

## 🗄️ Esquema de Base de Datos

```
users          → Usuarios (id, name, email, role, avatar, isBlocked, suspendedUntil)
meetups        → Quedadas (id, title, description, date, lat/lng, creator_id...)
attendees      → Asistentes a quedadas (meetup_id, user_id)
messages       → Mensajes del chat (id, content, meetup_id, user_id)
notifications  → Notificaciones (id, userId, message, read)
settings       → Configuración del sitio (key, value) ← 🆕
visits         → Tracking de visitas (ip, path, city, country, lat, lng) ← 🆕
reports        → Reportes de usuarios (reporterId, reportedId, reason, status) ← 🆕
```

---

## 👑 Panel de Administración

Para acceder al panel de admin, el usuario debe tener `role = 'admin'` en la base de datos.

El icono de escudo rojo 🔴 en la navbar del admin parpadea continuamente como indicador visual de zona de gestión.

### Acceso Rápido
| Sección | URL |
|---------|-----|
| Dashboard | `/admin` |
| Usuarios | `/admin/users` |
| Quedadas | `/admin/meetups` |
| Mensajes | `/admin/messages` |
| **Reportes** | `/admin/reports` |
| **Estadísticas** | `/admin/stats` |
| **Configuración** | `/admin/settings` |

---

## 📱 Diseño y UX

- **Dark Mode nativo**: Diseño oscuro premium con paleta naranja eléctrico (`#ff4d00`)
- **Mobile First**: Barra de navegación inferior para móvil, navbar completa en escritorio
- **Glassmorphism**: Efectos de cristal con `backdrop-blur` en paneles y modales
- **Micro-animaciones**: Framer Motion para transiciones fluidas entre estados
- **Tipografía**: Fuente Geist (Vercel) para una apariencia moderna y tecnológica
- **Responsive**: Totalmente adaptado a todos los tamaños de pantalla

---

## 🚢 Despliegue

El proyecto está optimizado para **Vercel**:

1. Conecta tu repositorio de GitHub a Vercel
2. Añade las variables de entorno en el panel de Vercel
3. Vercel detectará automáticamente Next.js y desplegará

La base de datos **Vercel Postgres** se conecta de forma nativa sin configuración adicional.

---

## 📧 Contacto y Soporte

- **Email de soporte**: admin@quedamoto.com
- **Repositorio**: [github.com/caspecor/QuedaMoto](https://github.com/caspecor/QuedaMoto)
- **Producción**: [quedamoto.vercel.app](https://quedamoto.vercel.app)

---

<div align="center">
  <strong>🏍️ QuedaMoto — Sal de ruta sin conocer gente 💨</strong>
</div>