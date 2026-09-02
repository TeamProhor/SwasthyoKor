import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5433/swasthyokor";

// Cache connection globally to prevent exhausting pool on hot reload and parallel build workers
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn =
  globalForDb.conn ??
  postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 15,
    prepare: false, // Required for PgBouncer transaction pooling mode
  });

globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
