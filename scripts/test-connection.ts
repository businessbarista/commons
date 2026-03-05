import { config } from "dotenv";
import postgres from "postgres";

config({ path: ".env.local" });

const sql = postgres(process.env.DATABASE_URL!);

async function main() {
  try {
    const result = await sql`SELECT NOW() as current_time`;
    console.log("✅ Database connected successfully!");
    console.log("   Current time:", result[0].current_time);
    await sql.end();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

main();
