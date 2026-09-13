import { migrate, pool } from "../db/index.js";
import { crmJob } from "../jobs/index.js";

async function run() {
  await migrate();
  await crmJob.processPendingJobs();
  console.log("Bekleyen CRM işleri işlendi.");
}

run()
  .then(() => pool.end())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
