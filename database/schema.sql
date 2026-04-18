-- schema.sql
-- Disable RLS temporarily to install tables
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar TEXT,
  city TEXT,
  bio TEXT,
  moto_brand TEXT,
  moto_model TEXT,
  style TEXT,
  level TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MEETUPS TABLE
CREATE TABLE IF NOT EXISTS public.meetups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  max_attendees INTEGER,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  address TEXT,
  visibility TEXT DEFAULT 'public',
  level_required TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ATTENDEES TABLE
CREATE TABLE IF NOT EXISTS public.attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meetup_id UUID REFERENCES public.meetups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'attending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(meetup_id, user_id)
);

-- MESSAGES TABLE (Realtime Chat)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meetup_id UUID REFERENCES public.meetups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reported_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Setup
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Update these for production readiness based on specific app logic)
CREATE POLICY "Public profiles are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public meetups are viewable by everyone" ON public.meetups FOR SELECT USING (visibility = 'public');
CREATE POLICY "Authenticated users can create meetups" ON public.meetups FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update their meetups" ON public.meetups FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Anyone can view attendees" ON public.attendees FOR SELECT USING (true);
CREATE POLICY "Authenticated users can join" ON public.attendees FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave" ON public.attendees FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read messages in public meetups" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can post messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable Supabase Realtime for Messages
alter publication supabase_realtime add table public.messages;
