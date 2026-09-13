import { query } from "../../db/index.js";
import { asyncHandler } from "../../utils/index.js";
import { googleAdsService } from "../googleAds/index.js";
import leadModel from "./leadModel.js";

const index = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page || "1", 10));
  const perPage = Math.min(100, Math.max(1, Number.parseInt(req.query.per_page || "25", 10)));
  const offset = (page - 1) * perPage;
  const filters = [];
  const values = [];

  if (req.query.form_type) {
    values.push(req.query.form_type);
    filters.push(`l.form_type = $${values.length}`);
  }
  if (req.query.email) {
    values.push(`%${req.query.email}%`);
    filters.push(`l.email ILIKE $${values.length}`);
  }
  if (req.query.from) {
    values.push(req.query.from);
    filters.push(`l.submitted_at >= $${values.length}`);
  }
  if (req.query.to) {
    values.push(req.query.to);
    filters.push(`l.submitted_at <= $${values.length}`);
  }
  if (req.query.mail_failed === "true") {
    filters.push("l.mail_error IS NOT NULL");
  }
  if (req.query.suspicious_visit === "true") {
    filters.push("v.is_suspected_bot = TRUE");
  }

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const count = await query(`SELECT COUNT(*)::int AS count FROM lead_submissions l LEFT JOIN traffic_visits v ON v.id = l.traffic_visit_id ${where}`, values);
  values.push(perPage, offset);

  const rows = await query(
    `SELECT l.*, vis.visitor_uuid, vis.country_name, vis.utm_source, vis.utm_medium, vis.gclid,
            v.is_suspected_bot
     FROM lead_submissions l
     LEFT JOIN traffic_visitors vis ON vis.id = l.traffic_visitor_id
     LEFT JOIN traffic_visits v ON v.id = l.traffic_visit_id
     ${where}
     ORDER BY l.submitted_at DESC
     LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values,
  );

  res.json({ data: rows.rows, meta: { page, per_page: perPage, total: count.rows[0].count } });
});

const show = asyncHandler(async (req, res) => {
  const lead = await leadModel.findWithTracking(req.params.id);
  if (!lead) {
    return res.status(404).json({ message: "Lead bulunamadı" });
  }

  const campaign = lead.gclid ? await googleAdsService.getClickInfo(lead.gclid) : {};
  res.json({
    data: {
      ...lead,
      form_name: leadModel.formName(lead.form_type),
      google_ads: campaign,
    },
  });
});

export default { index, show };
