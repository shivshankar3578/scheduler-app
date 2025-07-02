import { z } from 'zod/v4';
import createHttpError from 'http-errors';
import { Middleware } from 'express-zod-api';
import { JwtService } from '../services/jwt.service';

export const authMiddleware = new Middleware({
  security: {
    and: [{ type: 'header', name: 'token' }],
  },
  input: z.any(),
  handler: async ({ input: { key }, request, logger }) => {
    logger.debug('Checking the key and token');

    try {
      const user = JwtService.verifyToken(request.headers.token as string);
      if (!user) throw createHttpError(401, 'Invalid token');
      return { user };
    } catch (error: any) {
      logger.error('JWT verification failed:', error.message);
      return createHttpError(401, 'Error parsing token');
    }
  },
});
