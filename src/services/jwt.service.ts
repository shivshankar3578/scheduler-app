import { db } from '../db';
import { defaultEndpointsFactory } from 'express-zod-api';
import z from 'zod/v4';
import jwt from 'jsonwebtoken';
import { User } from '../models/users';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

interface JwtPayload {
  userId: number;
  email: string;
}
const authenticatedUsersCache = new Map<string, JwtPayload>();

export const JwtService = {
  generateToken(user: User): string {
    const payload: JwtPayload = { userId: user.id, email: user.email };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
  },

  verifyToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  },
};

// export const authCacheMiddleware = defaultEndpointsFactory.addMiddleware({
//   input: z.any(),
//   middleware: async ({ request, options, logger }) => {
//     const authHeader = request.headers.authorization;
//     if (!authHeader) {
//       return {};
//     }

//     const token = authHeader.split(' ')[1];
//     if (!token) {
//       return {};
//     }

//     if (authenticatedUsersCache.has(token)) {
//       logger.debug('Auth token found in cache.');
//       const payload = authenticatedUsersCache.get(token)!;
//       return { options: { ...options, user: payload } };
//     }

//     return { options: { ...options, tokenToCache: token } }; // Pass token to next middleware to cache if valid
//   },
// });
