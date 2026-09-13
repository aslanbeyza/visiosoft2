import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./pool.js";

const dirname = fileURLToPath(new URL(".", import.meta.url));

export async function migrate() {
  const schemaPath = path.join(dirname, "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");
  await pool.query(sql);
  console.log("Veritabanı şeması hazır.");
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMain) {
  migrate()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Migrate hatası:", error);
      process.exit(1);
    });
}
