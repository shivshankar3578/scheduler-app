import { defaultEndpointsFactory } from 'express-zod-api';
import { z } from 'zod/v4';

import { UserService } from '../services/user.service';
import { JwtService } from '../services/jwt.service';

export const signup = defaultEndpointsFactory.build({
  method: 'post',
  input: z.object({
    email: z.string().min(3, 'Email must be at least 3 characters long.'),
    password: z.string().min(6, 'Password must be at least 6 characters long.'),
  }),
  output: z.object({
    message: z.string(),
    token: z.string(),
  }),
  handler: async ({ input: { email, password }, logger }) => {
    logger.debug(`Attempting to sign up user: ${email}`);
    const existingUser = await UserService.findUserByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists.');
    }

    const newUser = await UserService.createUser({ email, password });
    const token = JwtService.generateToken(newUser);

    return { message: `User ${email} signed up successfully!`, token };
  },
});

export const login = defaultEndpointsFactory.build({
  method: 'post',
  input: z.object({
    email: z.string(),
    password: z.string(),
  }),
  output: z.object({
    message: z.string(),
    token: z.string(),
  }),
  handler: async ({ input: { email, password }, logger }) => {
    logger.debug(`Attempting to log in user: ${email}`);
    const user = await UserService.findUserByEmail(email);

    if (!user || !(await UserService.validatePassword(password, user.passwordHash))) {
      throw new Error('Invalid email or password.');
    }

    const token = JwtService.generateToken(user);
    return { message: `User ${email} logged in successfully!`, token };
  },
});
