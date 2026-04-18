-- seed.sql
-- Disable triggers temporarily if necessary, but here we just insert directly.

-- Insert Users
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at) 
VALUES 
  ('a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890', '00000000-0000-0000-0000-000000000000', 'ancor@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('98765432-10fe-dcba-9876-543210fedcba', '00000000-0000-0000-0000-000000000000', 'luis@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, email, username, avatar, city, bio, moto_brand, moto_model, style, level) VALUES
('a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890', 'ancor@example.com', 'AncorRider', '', 'Las Palmas de Gran Canaria', 'Amante de las rutas costeras y asfalto.', 'Yamaha', 'MT-07', 'Naked', 'Avanzado'),
('98765432-10fe-dcba-9876-543210fedcba', 'luis@example.com', 'LuisOffroad', '', 'Santa Cruz de Tenerife', 'Solo me gustan los caminos de tierra.', 'Honda', 'Africa Twin', 'Trail', 'Intermedio')
ON CONFLICT (id) DO NOTHING;

-- Insert Meetups
INSERT INTO public.meetups (id, creator_id, title, description, type, date, time, max_attendees, lat, lng, address, visibility, level_required) VALUES
('11111111-2222-3333-4444-555555555555', 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890', 'Ruta al Teide (Subida por el sur)', 'Saldremos temprano desde Los Cristianos para subir al Teide sin tráfico.', 'route', CURRENT_DATE + INTERVAL '2 days', '08:00:00', 15, 28.272336, -16.642513, 'Parque Nacional del Teide', 'public', 'Intermedio'),
('22222222-3333-4444-5555-666666666666', '98765432-10fe-dcba-9876-543210fedcba', 'Curvas por Tejeda', 'Vuelta clásica por el centro de Gran Canaria, parando para el café en la Cruz de Tejeda.', 'route', CURRENT_DATE + INTERVAL '1 day', '09:30:00', 10, 28.006940, -15.599600, 'Cruz de Tejeda', 'public', 'Principiante')
ON CONFLICT (id) DO NOTHING;

-- Attendees
INSERT INTO public.attendees (meetup_id, user_id, status) VALUES
('11111111-2222-3333-4444-555555555555', 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890', 'attending'),
('11111111-2222-3333-4444-555555555555', '98765432-10fe-dcba-9876-543210fedcba', 'attending'),
('22222222-3333-4444-5555-666666666666', '98765432-10fe-dcba-9876-543210fedcba', 'attending')
ON CONFLICT (meetup_id, user_id) DO NOTHING;

-- Messages 
INSERT INTO public.messages (meetup_id, user_id, content) VALUES
('11111111-2222-3333-4444-555555555555', 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890', '¡No olviden llevar ropa de abrigo, arriba refresca!'),
('22222222-3333-4444-5555-666666666666', '98765432-10fe-dcba-9876-543210fedcba', 'He revisado presión de ruedas, todo listo para mañana.')
ON CONFLICT DO NOTHING;
