# QuedaMoto

> **Descubre y organiza quedadas moteras espontáneas en España**  
> Plataforma social para motociclistas que permite encontrar, crear y unirse a rutas y encuentros en tiempo real.

QuedaMoto es un MVP (Producto Mínimo Viable) construido con el stack moderno de Next.js 16 (App Router), Tailwind CSS v4, Shadcn UI, Supabase y Mapbox. Su objetivo es facilitar la comunidad motera ofreciendo una experiencia fluida tanto en desktop como en móvil.

---

## 🚀 Características principales

- **Autenticación segura**: Email/password con Supabase y validación Zod. Rutas protegidas mediante Middleware.
- **UI Premium para bikers**: Tema oscuro personalizado con Shadcn y Tailwind, glassmorphism, acentos naranja altos contraste y diseño mobile-first.
- **Mapa interactivo de quedadas**: Visualiza eventos cercanos en un mapa powered by Mapbox GL JS (con fallback a Leaflet).
- **Panel de usuario**: Vista de perfil con edición de datos, información de moto y bio.
- **Gestión de eventos**: Crear, editar, eliminar meetups; unirse o salir de eventos; chat en tiempo real dentro de cada quedada.
- **Notificaciones en tiempo real**: Alertas de nuevos mensajes, invitaciones y actualizaciones de eventos mediante canales Supabase.
- **Panel de Administración**: Sistema completo para gestionar usuarios, quedadas y mensajes. Incluye bloqueo de usuarios, eliminación de contenido y estadísticas del sitio.
- **Diseño responsive**: Optimizado para todo tipo de dispositivos, desde smartphones hasta pantallas grandes.

---

## 📸 Capturas de pantalla

| Pantalla | Descripción |
|----------|-------------|
| ![Landing Page](docs/screenshots/landing-page.png) | **Landing Page** – Encabezado destacado con llamada a la acción para explorar quedadas cercanas. |
| ![Explore Map](docs/screenshots/explore-map.png) | **Mapa de Exploración** – Pinpoints de meetups en tiempo real, filtrado por visibilidad y ubicación. |
| ![User Profile](docs/screenshots/user-profile.png) | **Perfil de Usuario** – Avatar, detalles de la moto, nivel, estilo y bio; edición inline. |
| ![Create Meetup](docs/screenshots/create-meetup.png) | **Crear Quedada** – Formulario completo para definir ruta, fecha, hora, ubicación, nivel requerido y más. |
| ![Dashboard](docs/screenshots/dashboard.png) | **Panel de Control** – Próximas rides, notificaciones recientes y acceso rápido a tu perfil y creaciones. |

> *Nota: Reemplaza los placeholders en `docs/screenshots/` con capturas reales de tu despliegue local o de producción.*

---

## 👑 Panel de Administración

QuedaMoto incluye un panel completo de administración accesible únicamente para usuarios con rol `admin`. Para crear tu primer administrador, ejecuta el script `database/admin-seed.sql` en tu base de datos Supabase.

### Características del Panel Admin:

- **📊 Dashboard Principal**: Estadísticas en tiempo real del sitio (usuarios activos, quedadas, mensajes, usuarios bloqueados).
- **👥 Gestión de Usuarios**: Ver, bloquear/desbloquear, cambiar roles y eliminar usuarios problemáticos.
- **📅 Gestión de Quedadas**: Supervisar todas las quedadas, editar detalles y eliminar contenido inapropiado.
- **💬 Moderación de Mensajes**: Revisar mensajes recientes y marcados para moderación.
- **🚫 Sistema de Bloqueo**: Bloquear usuarios temporal o permanentemente con razones específicas.

### Acceso al Panel:
Los usuarios con rol `admin` verán un botón rojo "Admin" en la barra de navegación. El acceso está protegido por middleware que verifica el rol del usuario.

### Configuración Inicial:
1. Ejecuta `database/admin-seed.sql` para crear tu usuario administrador.
2. O actualiza un usuario existente: `UPDATE users SET role = 'admin' WHERE email = 'tu-email@example.com';`

---

## 🛠️ Stack tecnológico

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Estilizado** | Tailwind CSS v4 + Shadcn UI |
| **Estado global** | Zustand |
| **Formularios** | React Hook Form + Zod |
| **Base de datos** | Supabase (PostgreSQL) |
| **Autenticación** | NextAuth.js v4 (proveedor de credenciales) |
| **Mapas** | Mapbox GL JS / Leaflet (vía react-leaflet) |
| **Notificaciones en tiempo real** | Supabase Realtime + Sonner (toast) |
| **Iconos** | Lucide React |
| **Tipografía** | Sistema (inter, sans-serif) |
| **Despliegue** | Vercel (optimizado para Next.js) |

---

## 📋 Instrucciones de setup

### 1. Base de datos Neon/Vercel Postgres
1. Crea una base de datos en [Neon](https://neon.tech) o usa Vercel Postgres.
2. Vincula la base de datos a tu proyecto Vercel (Storage → Database).
3. **Inicialización rápida**: Ejecuta `database/init.sql` en el SQL editor - esto crea todas las tablas, índices y un usuario admin por defecto.
4. **O inicialización manual**:
   - Ejecuta `database/schema.sql` para crear tablas y políticas RLS
   - Ejecuta `database/migration-admin.sql` para agregar campos de administración
   - Opcionalmente, pobla datos de ejemplo con `database/seed.sql`

**Usuario admin por defecto:**
- Email: `admin@quedamoto.com`
- Password: `password`
- Cambia la contraseña después del primer login.

### 2. Variables de entorno
En Vercel, configura estas variables de entorno en tu proyecto:

**Requeridas:**
- `NEXTAUTH_URL` – URL de tu aplicación Vercel (ej: `https://tu-app.vercel.app`)
- `NEXTAUTH_SECRET` – Secreto para NextAuth (genera uno con `openssl rand -base64 32`)
- `NEXT_PUBLIC_MAPBOX_TOKEN` – Token de Mapbox (obténlo en [Mapbox Studio](https://studio.mapbox.com/))

**Base de datos (Neon/Vercel Postgres):**
- Estas se configuran automáticamente cuando vinculas tu base de datos Neon en Vercel
- Variables como `POSTGRES_URL`, `POSTGRES_USER`, etc. serán auto-configuradas

**Opcional (para uploads de imágenes):**
- `NEXT_PUBLIC_SUPABASE_URL` – Si usas Supabase para storage de imágenes
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Clave anónima de Supabase

### 3. Instalación y ejecución
```bash
npm install          # instala dependencias
npm run dev          # inicia el servidor de desarrollo en http://localhost:3000
```

Para construir para producción:
```bash
npm run build
npm start
```

---

## 👑 Panel de Administración

QuedaMoto incluye un panel completo de administración accesible únicamente para usuarios con rol `admin`.

### Características del Panel Admin:

- **📊 Dashboard Principal**: Estadísticas en tiempo real del sitio
- **👥 Gestión de Usuarios**: Ver, bloquear/desbloquear, cambiar roles y eliminar usuarios
- **📅 Gestión de Quedadas**: Supervisar todas las quedadas y eliminar contenido
- **💬 Moderación de Mensajes**: Revisar mensajes recientes y marcados

### Creación del primer administrador:
```sql
-- En el SQL editor de Neon/Vercel, ejecuta:
UPDATE users SET role = 'admin' WHERE email = 'tu-email@example.com';
```

### Acceso al Panel:
Los usuarios con rol `admin` verán un botón "Admin" en la barra de navegación.

---

## � contribuir

Queremos que QuedaMoto crezca con la comunidad. Si deseas contribuir:

1. Haz un **fork** del repositorio.
2. Crea una rama para tu feature o fix:  
   `git checkout -b feature/nueva-funcionalidad`
3. Realiza tus cambios y asegúrate de que el linter y los tests pasen (si existen).
4. Haz commit con mensajes claros y descriptivos.
5. Abre un **Pull Request** hacia la rama `main` (o `linen-brie` si estás trabajando en una feature específica).

Por favor, sigue el estilo de código existente y agrega tests cuando corresponda.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT – ver el archivo [LICENSE](LICENSE) para más detalles.

---

**¡Gracias por usar y mejorar QuedaMoto!** 🏍️💨