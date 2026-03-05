import { config } from "dotenv";
import postgres from "postgres";
import { readFileSync } from "fs";
import { join } from "path";

config({ path: ".env.local" });

const sql = postgres(process.env.DATABASE_URL!);

async function main() {
  const migrationPath = join(
    process.cwd(),
    "src/db/migrations/0001_add_search_index.sql",
  );
  const migration = readFileSync(migrationPath, "utf-8");

  console.log("🔍 Running search index migration...\n");

  // Run the entire migration as a single transaction
  await sql.unsafe(migration);

  console.log("✅ Migration applied successfully");

  // Verify the search_vector column exists and is populated
  const result = await sql`
    SELECT slug, length(search_vector::text) as sv_len
    FROM skills
    ORDER BY slug
  `;

  console.log("\n📋 Search vectors populated:");
  for (const row of result) {
    console.log(`   ${row.slug}: ${row.sv_len} chars`);
  }

  await sql.end();
  console.log("\n🎉 Search index ready!");
}

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
