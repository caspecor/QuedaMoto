-- QuedaMoto Database Schema
-- Run this in your Supabase SQL editor

-- Users table with admin fields
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  avatar TEXT,
  moto_brand TEXT,
  moto_model TEXT,
  city TEXT,
  level TEXT,
  style TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  is_blocked BOOLEAN DEFAULT FALSE,
  blocked_at TIMESTAMP,
  blocked_by TEXT,
  block_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Meetups table
CREATE TABLE IF NOT EXISTS meetups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  max_attendees INTEGER NOT NULL,
  address TEXT NOT NULL,
  address_notes TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  level_required TEXT DEFAULT 'Principiante',
  creator_id TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Attendees table
CREATE TABLE IF NOT EXISTS attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meetup_id UUID REFERENCES meetups(id) ON DELETE CASCADE NOT NULL,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'attending' CHECK (status IN ('attending', 'maybe', 'declined')),
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(meetup_id, user_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meetup_id UUID REFERENCES meetups(id) ON DELETE CASCADE NOT NULL,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'chat', 'join', 'update'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Row Level Security (RLS) Policies

-- Users policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data (except role and blocked fields)
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    OLD.role = NEW.role AND
    OLD.is_blocked = NEW.is_blocked
  );

-- Admins can do everything
CREATE POLICY "Admins can manage all users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Meetups policies
ALTER TABLE meetups ENABLE ROW LEVEL SECURITY;

-- Everyone can view public meetups
CREATE POLICY "Public meetups are viewable by everyone" ON meetups
  FOR SELECT USING (visibility = 'public');

-- Users can view private meetups they're invited to (through attendees table)
CREATE POLICY "Users can view their private meetups" ON meetups
  FOR SELECT USING (
    visibility = 'private' AND
    EXISTS (
      SELECT 1 FROM attendees
      WHERE meetup_id = id AND user_id = auth.uid()
    )
  );

-- Authenticated users can create meetups
CREATE POLICY "Authenticated users can create meetups" ON meetups
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Creators can update their meetups
CREATE POLICY "Creators can update their meetups" ON meetups
  FOR UPDATE USING (creator_id = auth.uid());

-- Creators can delete their meetups
CREATE POLICY "Creators can delete their meetups" ON meetups
  FOR DELETE USING (creator_id = auth.uid());

-- Attendees policies
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;

-- Users can view attendees of meetups they can see
CREATE POLICY "Users can view attendees of accessible meetups" ON attendees
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM meetups
      WHERE id = meetup_id AND (
        visibility = 'public' OR
        EXISTS (
          SELECT 1 FROM attendees a
          WHERE a.meetup_id = meetups.id AND a.user_id = auth.uid()
        )
      )
    )
  );

-- Users can join/leave meetups they can see
CREATE POLICY "Users can manage their attendance" ON attendees
  FOR ALL USING (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM meetups
      WHERE id = meetup_id AND (
        visibility = 'public' OR
        creator_id = auth.uid()
      )
    )
  );

-- Messages policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages of meetups they can access
CREATE POLICY "Users can view messages of accessible meetups" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM meetups
      WHERE id = meetup_id AND (
        visibility = 'public' OR
        EXISTS (
          SELECT 1 FROM attendees
          WHERE meetup_id = meetups.id AND user_id = auth.uid()
        )
      )
    )
  );

-- Users can send messages to meetups they can access
CREATE POLICY "Users can send messages to accessible meetups" ON messages
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM meetups
      WHERE id = meetup_id AND (
        visibility = 'public' OR
        EXISTS (
          SELECT 1 FROM attendees
          WHERE meetup_id = meetups.id AND user_id = auth.uid()
        )
      )
    )
  );

-- Notifications policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

-- System can create notifications (service role)
CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());