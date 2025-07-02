import { Environment } from '../app';

export const currentEnvironment = Environment.parse(process.env.NODE_ENV);
export const isDevEnviroment: boolean = currentEnvironment === 'development';

import { createConfig } from 'express-zod-api';
import { envConfig } from './env.config';

export const appConfig = createConfig({
  http: {
    listen: envConfig.PORT,
  },
  startupLogo: false,
  cors: envConfig.CORS_ENABLED,
  logger: {
    level: envConfig.LOG_LEVEL,
    color: envConfig.LOG_COLORED,
  },
});
