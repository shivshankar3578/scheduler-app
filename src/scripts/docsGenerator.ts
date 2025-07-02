/* eslint-disable no-console */
import { Documentation } from 'express-zod-api';
import { routing } from '../routes';
import { appConfig as config, envConfig } from '../configs';

export const openApiSpec = new Documentation({
  routing, // the same routing and config that you use to start the server
  config,
  version: envConfig.API_VERSION,
  title: envConfig.API_TITLE,
  serverUrl: envConfig.API_SERVER_URL,
  composition: 'inline', // optional, or "components" for keeping schemas in a separate dedicated section using refs
}).getSpecAsJson();

console.log('api docs ready');
