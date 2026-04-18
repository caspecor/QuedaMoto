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

## Setup Instructions

1. **Supabase Database**:
   - Open your Supabase project dashboard.
   - Run the commands specified in `database/schema.sql` in the Supabase SQL editor to create the Tables and Row Level Security Rules.
   - Run `database/seed.sql` to populate sample bikers and Canary Island meetup locations.

2. **Environment Variables**:
   - Rename `.env.local.example` to `.env.local`.
   - Update `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase API settings.
   - Insert your `NEXT_PUBLIC_MAPBOX_TOKEN` from Mapbox.

3. **Install & Run**:
   ```bash
   npm install
   npm run dev
   ```

Go to `http://localhost:3000` to start exploring QuedaMoto!
