import { Pool } from "pg";
import config from "../config/index.js";

const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
});

async function query(text, params = []) {
  return pool.query(text, params);
}

export { pool, query };
