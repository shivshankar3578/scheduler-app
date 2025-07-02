import { routing } from '../routes';
import { Integration } from 'express-zod-api';

const client = new Integration({
  routing,
  variant: 'client',
});

client.printFormatted();
