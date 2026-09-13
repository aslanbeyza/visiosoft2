import config from "../../config/index.js";
import { query } from "../../db/index.js";

async function score(req, acquisition) {
  let points = 0;
  const reasons = [];
  const userAgent = String(req.get("user-agent") || "").toLowerCase();

  if (userAgent === "") {
    points += 30;
    reasons.push("Missing user agent");
  } else {
    const pattern = config.traffic.botUserAgentPatterns.find(
      (item) => item && userAgent.includes(String(item).toLowerCase()),
    );
    if (pattern) {
      points += 50;
      reasons.push(`Bot-like user agent pattern: ${pattern}`);
    }
  }

  const ipAddress = req.clientIp || "";
  if (ipAddress) {
    const windowStart = new Date(Date.now() - config.traffic.ipBurstWindowMinutes * 60 * 1000);
    const { rows } = await query(
      `SELECT COUNT(*)::int AS count
       FROM traffic_visits
       WHERE ip_address = $1 AND occurred_at >= $2`,
      [ipAddress, windowStart],
    );
    const recentHitCount = rows[0]?.count || 0;
    if (recentHitCount >= config.traffic.ipBurstThreshold) {
      points += 25;
      reasons.push(`High request volume from IP in short window (${recentHitCount})`);
    }
  }

  const gclid = String(acquisition.gclid || "");
  if (gclid) {
    const gclidWindowStart = new Date(
      Date.now() - config.traffic.gclidMultiIpWindowDays * 24 * 60 * 60 * 1000,
    );
    const { rows } = await query(
      `SELECT COUNT(DISTINCT v.ip_address)::int AS count
       FROM traffic_visits v
       INNER JOIN traffic_visitors vis ON vis.id = v.traffic_visitor_id
       WHERE v.ip_address IS NOT NULL
         AND v.occurred_at >= $1
         AND vis.gclid = $2`,
      [gclidWindowStart, gclid],
    );
    const distinctIpCount = rows[0]?.count || 0;
    if (distinctIpCount >= 2) {
      points += 35;
      reasons.push(`GCLID shared across multiple IPs (${distinctIpCount})`);
    }
  }

  points = Math.min(100, points);

  return {
    score: points,
    is_suspected_bot: points >= config.traffic.botScoreThreshold,
    reasons,
  };
}

export default { score };
