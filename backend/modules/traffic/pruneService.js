import { query } from "../../db/index.js";

async function prune({ before, includeLeadLinked = false }) {
  if (!before) {
    throw new Error("The --before option is required. Example: npm run traffic:prune -- --before=2026-01-01");
  }

  const beforeDate = new Date(`${before}T23:59:59.999Z`);
  if (Number.isNaN(beforeDate.getTime())) {
    throw new Error("The --before option must be a valid date in YYYY-MM-D format.");
  }

  const visitFilter = includeLeadLinked
    ? "occurred_at < $1"
    : `occurred_at < $1
       AND id NOT IN (SELECT traffic_visit_id FROM lead_submissions WHERE traffic_visit_id IS NOT NULL)`;

  const visitCount = await query(
    `SELECT COUNT(*)::int AS count FROM traffic_visits WHERE ${visitFilter}`,
    [beforeDate],
  );
  await query(`DELETE FROM traffic_visits WHERE ${visitFilter}`, [beforeDate]);

  const visitorCount = await query(
    `SELECT COUNT(*)::int AS count
     FROM traffic_visitors
     WHERE last_seen_at < $1
       AND id NOT IN (SELECT traffic_visitor_id FROM traffic_visits WHERE traffic_visitor_id IS NOT NULL)
       AND id NOT IN (SELECT traffic_visitor_id FROM lead_submissions WHERE traffic_visitor_id IS NOT NULL)`,
    [beforeDate],
  );
  await query(
    `DELETE FROM traffic_visitors
     WHERE last_seen_at < $1
       AND id NOT IN (SELECT traffic_visitor_id FROM traffic_visits WHERE traffic_visitor_id IS NOT NULL)
       AND id NOT IN (SELECT traffic_visitor_id FROM lead_submissions WHERE traffic_visitor_id IS NOT NULL)`,
    [beforeDate],
  );

  return {
    deletedVisits: visitCount.rows[0].count,
    deletedVisitors: visitorCount.rows[0].count,
  };
}

export default { prune };
