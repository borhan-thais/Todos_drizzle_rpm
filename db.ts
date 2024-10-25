import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({
  url: Deno.env.get('DATABASE_URL')!,
  authToken: Deno.env.get('DATABASE_AUTH_TOKEN')!,
});
export const db = drizzle(client);
