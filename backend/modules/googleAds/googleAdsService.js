import config from "../../config/index.js";
import { logger } from "../../utils/index.js";

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const API_BASE = "https://googleads.googleapis.com/v19";
const cache = new Map();

function isConfigured() {
  return Boolean(
    config.googleAds.developerToken &&
      config.googleAds.clientId &&
      config.googleAds.clientSecret &&
      config.googleAds.refreshToken &&
      config.googleAds.customerId,
  );
}

async function fetchAccessToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: config.googleAds.clientId,
      client_secret: config.googleAds.clientSecret,
      refresh_token: config.googleAds.refreshToken,
      grant_type: "refresh_token",
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    logger.warn("Google Ads OAuth token refresh failed", { status: response.status });
    return null;
  }

  const data = await response.json();
  return data.access_token || null;
}

async function getClickInfo(gclid) {
  if (!isConfigured() || !/^[A-Za-z0-9\-_]+$/.test(gclid)) {
    return {};
  }

  if (cache.has(gclid)) {
    return cache.get(gclid);
  }

  const accessToken = await fetchAccessToken();
  if (!accessToken) {
    return {};
  }

  const gaql = `
SELECT
  click_view.gclid,
  campaign.id,
  campaign.name,
  ad_group.id,
  ad_group.name,
  click_view.keyword_info.text,
  click_view.keyword_info.match_type,
  segments.date
FROM click_view
WHERE click_view.gclid = '${gclid}'
  AND segments.date DURING LAST_90_DAYS
LIMIT 1`;

  try {
    const response = await fetch(
      `${API_BASE}/customers/${config.googleAds.customerId}/googleAds:searchStream`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "developer-token": config.googleAds.developerToken,
          "login-customer-id": config.googleAds.customerId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: gaql }),
        signal: AbortSignal.timeout(10000),
      },
    );

    if (!response.ok) {
      logger.warn("Google Ads API error", { status: response.status });
      return {};
    }

    const payload = await response.json();
    const rows = payload?.[0]?.results || [];
    if (!rows.length) {
      cache.set(gclid, {});
      return {};
    }

    const row = rows[0];
    const result = {
      campaign_id: row.campaign?.id || null,
      campaign_name: row.campaign?.name || null,
      ad_group_id: row.adGroup?.id || null,
      ad_group_name: row.adGroup?.name || null,
      keyword_text: row.clickView?.keywordInfo?.text || null,
      match_type: row.clickView?.keywordInfo?.matchType || null,
      click_date: row.segments?.date || null,
    };
    cache.set(gclid, result);
    return result;
  } catch (error) {
    logger.warn("Google Ads API exception", { error: error.message });
    return {};
  }
}

export default { isConfigured, getClickInfo };
