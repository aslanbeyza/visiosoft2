import { query } from "../../db/index.js";
import { asyncHandler } from "../../utils/index.js";
import statsService from "./statsService.js";
import pruneService from "./pruneService.js";

function pagination(req) {
  const page = Math.max(1, Number.parseInt(req.query.page || "1", 10));
  const perPage = Math.min(100, Math.max(1, Number.parseInt(req.query.per_page || "25", 10)));
  return { page, perPage, offset: (page - 1) * perPage };
}

const listVisitors = asyncHandler(async (req, res) => {
  const { page, perPage, offset } = pagination(req);
  const filters = [];
  const values = [];

  if (req.query.utm_source) {
    values.push(`%${req.query.utm_source}%`);
    filters.push(`utm_source ILIKE $${values.length}`);
  }
  if (req.query.gclid) {
    values.push(`%${req.query.gclid}%`);
    filters.push(`gclid ILIKE $${values.length}`);
  }
  if (req.query.is_ad_traffic === "true" || req.query.is_ad_traffic === "false") {
    values.push(req.query.is_ad_traffic === "true");
    filters.push(`is_ad_traffic = $${values.length}`);
  }

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const count = await query(`SELECT COUNT(*)::int AS count FROM traffic_visitors ${where}`, values);
  values.push(perPage, offset);
  const rows = await query(
    `SELECT * FROM traffic_visitors ${where} ORDER BY last_seen_at DESC NULLS LAST LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values,
  );

  res.json({ data: rows.rows, meta: { page, per_page: perPage, total: count.rows[0].count } });
});

const listVisits = asyncHandler(async (req, res) => {
  const { page, perPage, offset } = pagination(req);
  const filters = [];
  const values = [];

  if (req.query.visitor_id) {
    values.push(req.query.visitor_id);
    filters.push(`v.traffic_visitor_id = $${values.length}`);
  }
  if (req.query.is_suspected_bot === "true" || req.query.is_suspected_bot === "false") {
    values.push(req.query.is_suspected_bot === "true");
    filters.push(`v.is_suspected_bot = $${values.length}`);
  }
  if (req.query.from) {
    values.push(req.query.from);
    filters.push(`v.occurred_at >= $${values.length}`);
  }
  if (req.query.to) {
    values.push(req.query.to);
    filters.push(`v.occurred_at <= $${values.length}`);
  }
  if (req.query.search) {
    values.push(`%${req.query.search}%`);
    filters.push(`(v.path ILIKE $${values.length} OR v.full_url ILIKE $${values.length} OR v.ip_address ILIKE $${values.length})`);
  }

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const count = await query(`SELECT COUNT(*)::int AS count FROM traffic_visits v ${where}`, values);
  values.push(perPage, offset);
  const rows = await query(
    `SELECT v.*, vis.visitor_uuid, vis.utm_source, vis.utm_medium, vis.utm_campaign, vis.gclid,
            vis.country_name, vis.city, vis.first_locale,
            (SELECT COUNT(*)::int FROM lead_submissions ls WHERE ls.traffic_visit_id = v.id) AS lead_count
     FROM traffic_visits v
     INNER JOIN traffic_visitors vis ON vis.id = v.traffic_visitor_id
     ${where}
     ORDER BY v.occurred_at DESC
     LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values,
  );

  res.json({ data: rows.rows, meta: { page, per_page: perPage, total: count.rows[0].count } });
});

const showVisit = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT v.*, vis.visitor_uuid, vis.utm_source, vis.utm_medium, vis.utm_campaign, vis.utm_term,
            vis.utm_content, vis.gclid, vis.gad_source, vis.country_code, vis.country_name, vis.city,
            vis.first_locale, vis.first_accept_language, vis.is_ad_traffic
     FROM traffic_visits v
     INNER JOIN traffic_visitors vis ON vis.id = v.traffic_visitor_id
     WHERE v.id = $1`,
    [req.params.id],
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Visit bulunamadı" });
  }

  res.json({ data: result.rows[0] });
});

const exportVisits = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT v.occurred_at, vis.utm_source, vis.utm_medium, vis.utm_campaign, vis.utm_term, vis.utm_content,
            vis.gclid, vis.gad_source, vis.country_name, vis.city, vis.first_locale, v.referer,
            vis.first_landing_url, v.ip_address, v.bot_score, v.is_suspected_bot,
            (SELECT COUNT(*)::int FROM lead_submissions ls WHERE ls.traffic_visit_id = v.id) AS lead_count
     FROM traffic_visits v
     INNER JOIN traffic_visitors vis ON vis.id = v.traffic_visitor_id
     ORDER BY v.occurred_at DESC
     LIMIT 5000`,
  );

  const header = [
    "visited_at",
    "source",
    "medium",
    "campaign",
    "term",
    "content",
    "gclid",
    "gad_source",
    "country",
    "city",
    "language",
    "referer",
    "landing_page",
    "ip",
    "bot_score",
    "is_suspected_bot",
    "lead_count",
  ];

  const lines = [header.join(",")];
  for (const row of result.rows) {
    lines.push(
      [
        row.occurred_at,
        row.utm_source,
        row.utm_medium,
        row.utm_campaign,
        row.utm_term,
        row.utm_content,
        row.gclid,
        row.gad_source,
        row.country_name,
        row.city,
        row.first_locale,
        row.referer,
        row.first_landing_url,
        row.ip_address,
        row.bot_score,
        row.is_suspected_bot,
        row.lead_count,
      ]
        .map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`)
        .join(","),
    );
  }

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=traffic-visits.csv");
  res.send(lines.join("\n"));
});

const stats = asyncHandler(async (req, res) => {
  res.json({ data: await statsService.overview() });
});

const prune = asyncHandler(async (req, res) => {
  const result = await pruneService.prune({
    before: req.body.before,
    includeLeadLinked: Boolean(req.body.include_lead_linked),
  });
  res.json({ message: `Deleted ${result.deletedVisits} visits and ${result.deletedVisitors} orphan visitors.`, data: result });
});

export default {
  listVisitors,
  listVisits,
  showVisit,
  exportVisits,
  stats,
  prune,
};
