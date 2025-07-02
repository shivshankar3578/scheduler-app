import { z } from 'zod/v4';
import { EndpointsFactory, ResultHandler, ensureHttpError, getMessageFromError } from 'express-zod-api';
import { authMiddleware } from '../middlewares';

const resultHandler = new ResultHandler({
  positive: (data) => ({
    schema: z.object({ data }),
    mimeType: 'application/json', // optinal or array
  }),
  negative: z.object({ error: z.string() }),
  handler: ({ error, input, output, request, response, logger }) => {
    logger.debug('in response handler');
    if (error) {
      const { statusCode } = ensureHttpError(error);
      const message = getMessageFromError(error);
      return void response.status(statusCode).json({ error: message });
    }
    response.status(200).json({ data: output });
  },
});

export const authorizedEndpoint = new EndpointsFactory(resultHandler).addMiddleware(authMiddleware);
