import { pgTable, text, timestamp, integer, doublePrecision, varchar, uuid, boolean, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 50 }).notNull(),
  password: text('password').notNull(),
  avatar: text('avatar'),
  moto_brand: varchar('moto_brand', { length: 100 }),
  moto_model: varchar('moto_model', { length: 100 }),
  city: varchar('city', { length: 100 }),
  level: varchar('level', { length: 50 }),
  style: varchar('style', { length: 100 }),
  bio: text('bio'),
  vehicles: jsonb('vehicles').$type<{ brand: string; model: string }[]>().default([]),
  role: varchar('role', { length: 20 }).default('user'),
  isBlocked: boolean('is_blocked').default(false),
  blockedAt: timestamp('blocked_at'),
  blockedBy: text('blocked_by'),
  blockReason: text('block_reason'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const meetups = pgTable('meetups', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  date: varchar('date', { length: 50 }).notNull(),
  time: varchar('time', { length: 50 }).notNull(),
  max_attendees: integer('max_attendees').notNull(),
  address: text('address').notNull(),
  address_notes: text('address_notes'),
  lat: doublePrecision('lat'),
  lng: doublePrecision('lng'),
  visibility: varchar('visibility', { length: 50 }).default('public'),
  level_required: varchar('level_required', { length: 50 }).default('Principiante'),
  creator_id: text('creator_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const attendees = pgTable('attendees', {
  id: uuid('id').defaultRandom().primaryKey(),
  meetup_id: uuid('meetup_id').references(() => meetups.id, { onDelete: 'cascade' }).notNull(),
  user_id: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  status: varchar('status', { length: 50 }).default('attending'),
  joinedAt: timestamp('joined_at').defaultNow(),
});

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  meetup_id: uuid('meetup_id').references(() => meetups.id, { onDelete: 'cascade' }).notNull(),
  user_id: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: text('type').notNull(), // 'chat', 'join', 'update'
  title: text('title').notNull(),
  message: text('message').notNull(),
  link: text('link'),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
