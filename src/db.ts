import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { users, events } from './models';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

const sqlite = new Database('db.sqlite', {
  verbose: console.log, // optional logging
});

export const db = drizzle(sqlite, { schema: { users, events } });

try {
  console.log('🚀 Running database migrations...');
  // Apply all pending migrations from the specified folder
  // Changed from './drizzle' to './migrations' as requested
  migrate(db, { migrationsFolder: './migrations' });
  console.log('✅ Migrations complete!');
} catch (error) {
  console.error('❌ Database migration failed! Stopping server...');
  console.error(error); // Log the full error for debugging
  process.exit(1); // Exit the process with a non-zero code to indicate failure
}
