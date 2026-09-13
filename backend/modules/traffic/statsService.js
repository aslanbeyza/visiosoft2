import { query } from "../../db/index.js";

async function overview() {
  const today = startOfDay(new Date());
  const yesterday = startOfDay(addDays(today, -1));
  const last7Days = addDays(new Date(), -7);
  const last30Days = addDays(new Date(), -30);

  const [todayAd, yesterdayAd, last7, last7Suspicious, leads30, adVisitors30, top] = await Promise.all([
    query(
      `SELECT COUNT(*)::int AS count FROM traffic_visitors
       WHERE is_ad_traffic = TRUE AND last_seen_at >= $1`,
      [today],
    ),
    query(
      `SELECT COUNT(*)::int AS count FROM traffic_visitors
       WHERE is_ad_traffic = TRUE AND last_seen_at >= $1 AND last_seen_at < $2`,
      [yesterday, today],
    ),
    query("SELECT COUNT(*)::int AS count FROM traffic_visits WHERE occurred_at >= $1", [last7Days]),
    query(
      `SELECT COUNT(*)::int AS count FROM traffic_visits
       WHERE occurred_at >= $1 AND is_suspected_bot = TRUE`,
      [last7Days],
    ),
    query("SELECT COUNT(*)::int AS count FROM lead_submissions WHERE submitted_at >= $1", [last30Days]),
    query(
      `SELECT COUNT(*)::int AS count FROM traffic_visitors
       WHERE last_seen_at >= $1 AND is_ad_traffic = TRUE`,
      [last30Days],
    ),
    query(
      `SELECT COALESCE(utm_source, '-') AS source, COALESCE(utm_campaign, '-') AS campaign, COUNT(*)::int AS total
       FROM traffic_visitors
       WHERE last_seen_at >= $1 AND is_ad_traffic = TRUE
       GROUP BY 1, 2
       ORDER BY total DESC
       LIMIT 1`,
      [last30Days],
    ),
  ]);

  const last7DayTotal = last7.rows[0].count;
  const last7DaySuspicious = last7Suspicious.rows[0].count;
  const last30DayLeadCount = leads30.rows[0].count;
  const last30DayAdVisitors = adVisitors30.rows[0].count;
  const topRow = top.rows[0];

  return {
    ad_traffic_today: todayAd.rows[0].count,
    ad_traffic_yesterday: yesterdayAd.rows[0].count,
    suspicious_rate_7d: last7DayTotal > 0 ? Number(((last7DaySuspicious / last7DayTotal) * 100).toFixed(2)) : 0,
    suspicious_visits_7d: last7DaySuspicious,
    total_visits_7d: last7DayTotal,
    lead_conversion_30d:
      last30DayAdVisitors > 0 ? Number(((last30DayLeadCount / last30DayAdVisitors) * 100).toFixed(2)) : 0,
    leads_30d: last30DayLeadCount,
    ad_visitors_30d: last30DayAdVisitors,
    top_source_campaign: topRow ? `${topRow.source} / ${topRow.campaign}` : "-",
    top_source_campaign_count: topRow ? topRow.total : 0,
  };
}

function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export default { overview };
