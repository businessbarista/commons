import { config } from "dotenv";
import postgres from "postgres";

config({ path: ".env.local" });

const sql = postgres(process.env.DATABASE_URL!);

async function main() {
  try {
    // Check tables
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;
    console.log("📋 Tables found:");
    for (const t of tables) {
      console.log(`   ✅ ${t.table_name}`);
    }

    // Check enums
    const enums = await sql`
      SELECT t.typname as enum_name,
             string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) as values
      FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public'
      GROUP BY t.typname
      ORDER BY t.typname
    `;
    console.log("\n🏷️  Enums found:");
    for (const e of enums) {
      console.log(`   ✅ ${e.enum_name}: [${e.values}]`);
    }

    // Check indexes
    const indexes = await sql`
      SELECT indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND indexname NOT LIKE '%pkey'
      ORDER BY indexname
    `;
    console.log("\n📇 Custom indexes:");
    for (const i of indexes) {
      console.log(`   ✅ ${i.indexname}`);
    }

    await sql.end();
    console.log("\n🎉 All database objects verified!");
  } catch (error) {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  }
}

main();
