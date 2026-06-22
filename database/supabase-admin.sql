-- ===========================================
-- QuedaMoto - Admin user para Supabase
-- Ejecutar en: Supabase > SQL Editor
-- ===========================================

-- Eliminar admin anterior si existe
DELETE FROM users WHERE email = 'administrador@quedamoto.com';

-- Insertar admin con hash correcto
INSERT INTO users (id, email, username, password, role, created_at)
VALUES (
  gen_random_uuid()::text,
  'administrador@quedamoto.com',
  'Administrador',
  '$2b$10$6mulAee4cv.xPtUcVpDHRug/OLOVrhBVs23MbQhxLJ51HrAr2Erdi',
  'admin',
  NOW()
);

-- Verificar que se ha creado correctamente
SELECT id, email, username, role, created_at FROM users WHERE role = 'admin';
