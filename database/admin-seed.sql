-- Admin seed script for QuedaMoto
-- Run this in your Supabase SQL editor to create an admin user

-- First, create an admin user (replace with your desired credentials)
INSERT INTO users (id, email, username, password, role, created_at)
VALUES (
  'admin-uuid-here', -- Replace with a generated UUID
  'admin@quedamoto.com',
  'Admin',
  '$2b$10$your-hashed-password-here', -- Use bcrypt hash for 'admin123'
  'admin',
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Alternative: Update existing user to admin
-- UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';

-- Check admin users
SELECT id, username, email, role FROM users WHERE role = 'admin';