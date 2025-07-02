// routes/index.ts
import { DependsOnMethod, Routing } from 'express-zod-api';
import { addEvent, deleteEvent, getEvent, listEvents, updateEvent } from '../controllers/events';
import { login, signup } from '../controllers/users';
import swaggerUi from 'swagger-ui-express';
import { openApiSpec } from '../scripts/docsGenerator';

export const routing: Routing = {
  api: {
    login,
    signup,
    events: {
      '/': new DependsOnMethod({
        get: listEvents,
        post: addEvent,
      }),
      ':id': new DependsOnMethod({
        get: getEvent,
        patch: updateEvent,
        delete: deleteEvent,
      }),
    },
  },
};
