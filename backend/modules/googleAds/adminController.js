import { query } from "../../db/index.js";
import { asyncHandler } from "../../utils/index.js";
import googleAdsService from "./googleAdsService.js";

const status = asyncHandler(async (req, res) => {
  const recent = await query(
    `SELECT gclid, MAX(last_seen_at) AS last_seen_at
     FROM traffic_visitors
     WHERE gclid IS NOT NULL AND gclid <> ''
     GROUP BY gclid
     ORDER BY last_seen_at DESC NULLS LAST
     LIMIT 8`,
  );

  res.json({
    data: {
      configured: googleAdsService.isConfigured(),
      recent_gclids: recent.rows.map((row) => row.gclid),
    },
  });
});

const lookup = asyncHandler(async (req, res) => {
  const gclid = String(req.query.gclid || req.body.gclid || "");
  const data = gclid ? await googleAdsService.getClickInfo(gclid) : {};
  res.json({ data });
});

export default { status, lookup };
