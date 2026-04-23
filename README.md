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

## 🛠️ Stack tecnológico

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Estilizado** | Tailwind CSS v4 + Shadcn UI |
| **Estado global** | Zustand |
| **Formularios** | React Hook Form + Zod |
| **Base de datos** | Supabase (PostgreSQL) |
| **Autenticación** | NextAuth.js (proveedor de credenciales) |
| **Mapas** | Mapbox GL JS / Leaflet (vía react-leaflet) |
| **Notificaciones en tiempo real** | Supabase Realtime + Sonner (toast) |
| **Iconos** | Lucide React |
| **Tipografía** | Sistema (inter, sans-serif) |
| **Despliegue** | Vercel (optimizado para Next.js) |

---

## 📋 Instrucciones de setup

### 1. Base de datos Supabase
1. Crea un proyecto en [Supabase](https://supabase.com).
2. En el panel de SQL, ejecuta el script `database/schema.sql` para crear tablas y políticas RLS.
3. Pobla datos de ejemplo con `database/seed.sql` (bikers de prueba y quedadas en Islas Canarias).

### 2. Variables de entorno
Duplica el archivo de ejemplo:
```bash
cp .env.local.example .env.local
```
Luego completa:
- `NEXT_PUBLIC_SUPABASE_URL` – URL de tu proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – clave anon pública
- `NEXT_PUBLIC_MAPBOX_TOKEN` – token de acceso a Mapbox (obténlo en [Mapbox Studio](https://studio.mapbox.com/))

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