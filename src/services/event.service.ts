import { db } from '../db';
import { events, recurrences, participants, NewEvent, Recurrence, Participant, Event } from '../models/events';
import { eq, and, or, gte, lte, lt, gt } from 'drizzle-orm';

export const EventsService = {
  async createEvent(event: NewEvent): Promise<Event> {
    const [e] = await db.insert(events).values(event).returning();
    return e;
  },

  async getEventsInRange(start: string, end: string): Promise<Event[]> {
    return await db
      .select()
      .from(events)
      .where(and(gte(events.startTime, start), lte(events.endTime, end)));
  },

  async getEvent(id: number): Promise<Event> {
    const results = await db.query.events.findFirst({
      with: {
        recurrences: true,
        participants: true,
      },
      where: (users, { eq }) => eq(users.id, id),
    });
    return results;
  },

  async updateEvent(id: number, data: Partial<NewEvent>): Promise<void> {
    await db.update(events).set(data).where(eq(events.id, id));
  },

  async deleteEvent(id: number): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  },

  async findConflicts(startUTC: string, endUTC: string): Promise<Event[]> {
    return await db
      .select()
      .from(events)
      .where(
        or(
          eq(events.startTime, startUTC),
          eq(events.endTime, endUTC),
          and(lt(events.startTime, endUTC), gt(events.endTime, startUTC)), // overlapping window
        ),
      );
  },

  async addRecurrence(data: Recurrence): Promise<void> {
    await db.insert(recurrences).values(data);
  },

  async addParticipants(data: Participant[]): Promise<void> {
    await db.insert(participants).values(data);
  },

  async getParticipants(eventId: number): Promise<Participant[]> {
    return await db.select().from(participants).where(eq(participants.eventId, eventId));
  },
};
