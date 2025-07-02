import { defaultEndpointsFactory } from 'express-zod-api';
import { z } from 'zod/v4';

import { EventsService } from '../services/event.service';
import { eventInsertSchema, events, eventSelectSchema } from '../models/events';
import { authorizedEndpoint } from '../factories';

export const addEvent = authorizedEndpoint.build({
  input: eventInsertSchema,
  output: z.object({ id: z.number() }),
  handler: async ({ input }) => {
    const data = input as unknown as typeof events.$inferInsert;
    const event = await EventsService.createEvent({
      ...data,
      startTime: new Date(data.startTime).toISOString(),
      endTime: new Date(data.endTime).toISOString(),
    });
    return { id: event.id };
  },
});

export const listEvents = defaultEndpointsFactory.build({
  input: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }),
  output: z.object({ events: z.array(eventSelectSchema) }),
  handler: async ({ input }) => {
    const results = await EventsService.getEventsInRange(
      new Date(input.startDate).toISOString(),
      new Date(input.endDate).toISOString(),
    );
    return { events: results };
  },
});

export const getEvent = defaultEndpointsFactory.build({
  input: z.object({
    id: z.number(),
  }),
  output: eventSelectSchema,
  handler: async ({ input }) => {
    return EventsService.getEvent(input.id);
  },
});

export const updateEvent = defaultEndpointsFactory.build({
  input: eventInsertSchema.extend({ id: z.number() }),
  output: z.object({ success: z.boolean() }),
  handler: async ({ input }) => {
    await EventsService.updateEvent(input.id, input);
    return { success: true };
  },
});

export const deleteEvent = defaultEndpointsFactory.build({
  input: z.object({ id: z.number() }),
  output: z.object({ success: z.boolean() }),
  handler: async ({ input }) => {
    await EventsService.deleteEvent(input.id);
    return { success: true };
  },
});
