import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const events = sqliteTable('events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  timezone: text('timezone').notNull(),
  allDay: integer('all_day', { mode: 'boolean' }).default(false),
  createdBy: text('created_by').notNull(),
});

export const recurrences = sqliteTable('recurrences', {
  eventId: integer('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  frequency: text('frequency'),
  interval: integer('interval').default(1),
  endDate: text('end_date'),
});

export const participants = sqliteTable(
  'participants',
  {
    eventId: integer('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    status: text('status').default('pending'),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.eventId, t.email] }),
  }),
);

export const eventInsertSchema = createInsertSchema(events);
export const eventSelectSchema = createSelectSchema(events);

export const recurrenceInsertSchema = createInsertSchema(recurrences, {});

export const participantInsertSchema = createInsertSchema(participants, {});

export type Event = InferSelectModel<typeof events>;
export type NewEvent = InferInsertModel<typeof events>;
export type Recurrence = InferInsertModel<typeof recurrences>;
export type Participant = InferInsertModel<typeof participants>;
