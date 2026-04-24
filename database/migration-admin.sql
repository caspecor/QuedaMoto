-- Migration to add admin fields to users table
-- Run this in your Neon/Vercel Postgres SQL editor

-- Add admin fields to existing users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS blocked_by TEXT,
ADD COLUMN IF NOT EXISTS block_reason TEXT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_blocked ON users(is_blocked);

-- Example: Create an admin user (replace with your actual credentials)
-- Make sure to hash the password using bcrypt
-- INSERT INTO users (id, email, username, password, role, created_at)
-- VALUES (
--   'admin-uuid',
--   'admin@quedamoto.com',
--   'Admin',
--   '$2b$10$your-hashed-password', -- Use bcrypt hash for password
--   'admin',
--   NOW()
-- )
-- ON CONFLICT (email) DO NOTHING;