import { migrate, pool } from "../db/index.js";
import { pruneService } from "../modules/traffic/index.js";

function arg(name) {
  const prefix = `--${name}=`;
  const match = process.argv.find((item) => item.startsWith(prefix));
  if (match) {
    return match.slice(prefix.length);
  }
  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0) {
    return process.argv[index + 1];
  }
  return null;
}

async function run() {
  await migrate();
  const result = await pruneService.prune({
    before: arg("before"),
    includeLeadLinked: process.argv.includes("--include-lead-linked"),
  });
  console.log(`Deleted ${result.deletedVisits} visits and ${result.deletedVisitors} orphan visitors.`);
}

run()
  .then(() => pool.end())
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
