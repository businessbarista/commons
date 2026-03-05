import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

const connectionString = process.env.DATABASE_URL!;

// Connection pool with sensible defaults for serverless
const client = postgres(connectionString, {
  max: 10, // Max connections in pool
  idle_timeout: 20, // Close idle connections after 20s
  connect_timeout: 10, // Fail connection after 10s
  prepare: false, // Disable prepared statements for Supabase transaction pooler compatibility
});

export const db = drizzle(client, { schema });
