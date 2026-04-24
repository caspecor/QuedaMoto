-- QuedaMoto Database Initialization Script
-- Run this in your Neon/Vercel Postgres SQL editor after deploying

-- 1. First, create the tables (if not already created)
\i database/schema.sql

-- 2. Add admin fields to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS blocked_by TEXT,
ADD COLUMN IF NOT EXISTS block_reason TEXT;

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_blocked ON users(is_blocked);

-- 4. Create default admin user
-- IMPORTANT: Change the password hash to a real bcrypt hash for your desired password
-- You can generate it with: node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"
DO $$
BEGIN
    -- Only insert if admin doesn't exist
    IF NOT EXISTS (SELECT 1 FROM users WHERE role = 'admin' LIMIT 1) THEN
        INSERT INTO users (id, email, username, password, role, created_at)
        VALUES (
            gen_random_uuid()::text,
            'admin@quedamoto.com',
            'Admin',
            '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- 'password' hashed
            'admin',
            NOW()
        );
    END IF;
END $$;

-- 5. Optional: Seed some sample data
-- Uncomment the following lines if you want sample data
/*
-- Sample users
INSERT INTO users (id, email, username, password, created_at) VALUES
(gen_random_uuid()::text, 'rider1@example.com', 'Rider1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW()),
(gen_random_uuid()::text, 'rider2@example.com', 'Rider2', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW());

-- Sample meetup
INSERT INTO meetups (title, description, type, date, time, max_attendees, address, lat, lng, creator_id) VALUES
('Quedada Tenerife Norte', 'Quedada para motos de carretera en el norte de Tenerife', 'Carretera', '2024-12-25', '10:00', 20, 'Plaza España, Santa Cruz', 28.4636, -16.2518, (SELECT id FROM users WHERE email = 'rider1@example.com' LIMIT 1));
*/

-- Verify setup
SELECT 'Setup complete!' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as admin_users FROM users WHERE role = 'admin';
SELECT COUNT(*) as total_meetups FROM meetups;