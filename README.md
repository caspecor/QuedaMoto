# QuedaMoto

Biker social platform MVP for discovering and organizing spontaneous motorcycle meetups across Spain. Built with Next.js (App Router), Tailwind CSS, Shadcn UI, Supabase, and Mapbox.

## Features Delivered
- **Authentication**: Email/Password powered by Supabase with Zod validation. Protected server routes using Middleware.
- **Premium Biker UI**: Dark theme customized using Shadcn and Tailwind v4. Glassmorphism layered cards, high contrast orange highlights, and responsive Mobile-First views.
- **Core Views**: 
  - Visual Landing Page with bold calls to action.
  - Interactive Explore map utilizing Mapbox GL JS Native.
  - Comprehensive user dashboard displaying scheduled rides.
  - Dynamic meetup forms and detailed views for organizing rides.

## Screenshots

### Landing Page
![Landing Page](docs/screenshots/landing-page.png)
*Hero section with call-to-action to discover nearby meetups.*

### Explore Map
![Explore Map](docs/screenshots/explore-map.png)
*Interactive map showing motorcycle meetups as pins across Spain.*

### User Profile
![User Profile](docs/screenshots/user-profile.png)
*Profile page with avatar, motorcycle details, and editing capabilities.*

### Meetup Creation
![Meetup Creation](docs/screenshots/create-meetup.png)
*Form to create a new motorcycle meetup with location, date, and details.*

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)
*User dashboard showing upcoming rides and recent notifications.*

## Setup Instructions

### 1. Supabase Database
   - Open your Supabase project dashboard.
   - Run the commands specified in `database/schema.sql` in the Supabase SQL editor to create the Tables and Row Level Security Rules.
   - Run `database/seed.sql` to populate sample bikers and Canary Island meetup locations.

### 2. Environment Variables
   - Rename `.env.local.example` to `.env.local`.
   - Update `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase API settings.
   - Insert your `NEXT_PUBLIC_MAPBOX_TOKEN` from Mapbox.

### 3. Install & Run
   ```bash
   npm install
   npm run dev
   ```

Go to `http://localhost:3000` to start exploring QuedaMoto!

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4, Shadcn UI
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Database**: Supabase (PostgreSQL)
- **Maps**: Mapbox GL JS / Leaflet (via react-leaflet)
- **Authentication**: NextAuth.js with Credentials provider
- **Notifications**: Sonner (toast) + real-time Supabase channels
- **Icons**: Lucide React

## Development
This project follows Next.js 16 conventions with the App Router. Server actions are used for data mutations, and real-time features are implemented with Supabase channels.

## License
MIT