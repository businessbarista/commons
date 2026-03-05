import { config } from "dotenv";
import postgres from "postgres";

config({ path: ".env.local" });

const sql = postgres(process.env.DATABASE_URL!);

async function main() {
  const rows = await sql`
    SELECT name, slug, category, status, is_expert, array_length(llm_tags, 1) as tag_count
    FROM skills
    ORDER BY category
  `;
  console.log("📋 Skills in database:\n");
  for (const row of rows) {
    const expert = row.is_expert ? " ⭐ Expert" : "";
    console.log(`  ${row.category}/${row.slug}`);
    console.log(`    Name: ${row.name}`);
    console.log(`    Status: ${row.status} | Tags: ${row.tag_count}${expert}\n`);
  }
  console.log(`Total: ${rows.length} skills`);
  await sql.end();
}

main();
