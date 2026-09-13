import { query } from "../../db/index.js";

const FORM_TYPES = {
  QUOTE: "quote",
  PARKING_QUOTE_ENGINE: "parking_quote_engine",
  DISCOVERY: "discovery",
};

function formName(formType) {
  switch (formType) {
    case FORM_TYPES.QUOTE:
      return "Teklif Al";
    case FORM_TYPES.PARKING_QUOTE_ENGINE:
      return "Otopark Teklif Motoru";
    case FORM_TYPES.DISCOVERY:
      return "Ücretsiz Keşif";
    default:
      return "Web Formu";
  }
}

async function createLead(data) {
  const result = await query(
    `INSERT INTO lead_submissions (
      traffic_visitor_id, traffic_visit_id, form_type, name, email, phone, company,
      address, message, products, turnstile_validated, submitted_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,$12)
    RETURNING *`,
    [
      data.traffic_visitor_id || null,
      data.traffic_visit_id || null,
      data.form_type,
      data.name,
      data.email,
      data.phone,
      data.company || null,
      data.address || null,
      data.message || null,
      data.products ? JSON.stringify(data.products) : null,
      data.turnstile_validated !== false,
      data.submitted_at,
    ],
  );
  return result.rows[0];
}

async function findById(id) {
  const result = await query("SELECT * FROM lead_submissions WHERE id = $1", [id]);
  return result.rows[0] || null;
}

async function findWithTracking(id) {
  const result = await query(
    `SELECT l.*,
            vis.utm_source, vis.utm_medium, vis.gclid, vis.first_referer, vis.first_landing_url,
            vis.last_ip, vis.first_ip, vis.last_user_agent, vis.first_user_agent,
            vis.visitor_uuid, vis.country_name, vis.city, vis.first_locale, vis.first_accept_language,
            vis.utm_campaign, vis.gad_source, vis.is_ad_traffic,
            v.referer AS visit_referer, v.full_url AS visit_full_url, v.ip_address AS visit_ip,
            v.is_suspected_bot, v.bot_score
     FROM lead_submissions l
     LEFT JOIN traffic_visitors vis ON vis.id = l.traffic_visitor_id
     LEFT JOIN traffic_visits v ON v.id = l.traffic_visit_id
     WHERE l.id = $1`,
    [id],
  );
  return result.rows[0] || null;
}

async function markMailResult(id, { sent, error }) {
  if (sent) {
    await query(
      "UPDATE lead_submissions SET mail_sent_at = NOW(), mail_error = NULL, updated_at = NOW() WHERE id = $1",
      [id],
    );
    return;
  }

  await query(
    "UPDATE lead_submissions SET mail_error = $2, updated_at = NOW() WHERE id = $1",
    [id, error],
  );
}

export default {
  FORM_TYPES,
  formName,
  createLead,
  findById,
  findWithTracking,
  markMailResult,
};
