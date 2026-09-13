import { randomUUID } from "crypto";
import config from "../../config/index.js";
import { query } from "../../db/index.js";
import geoIpService from "./geoIpService.js";
import botRiskScorer from "./botRiskScorer.js";

function nullableString(value) {
  if (value === undefined || value === null || typeof value === "object") {
    return null;
  }
  const trimmed = String(value).trim();
  return trimmed === "" ? null : trimmed;
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || ""),
  );
}

function resolveVisitorUuid(req) {
  const cookieValue = req.cookies?.[config.traffic.cookieName];
  if (cookieValue && isUuid(cookieValue)) {
    return cookieValue;
  }
  return randomUUID();
}

function resolveAcquisitionData(req, sessionAcquisition = {}) {
  const queryParams = req.query || {};
  const acquisition = {
    utm_source: nullableString(queryParams.utm_source ?? sessionAcquisition.utm_source),
    utm_medium: nullableString(queryParams.utm_medium ?? sessionAcquisition.utm_medium),
    utm_campaign: nullableString(queryParams.utm_campaign ?? sessionAcquisition.utm_campaign),
    utm_term: nullableString(queryParams.utm_term ?? sessionAcquisition.utm_term),
    utm_content: nullableString(queryParams.utm_content ?? sessionAcquisition.utm_content),
    referer: nullableString(req.get("referer") ?? sessionAcquisition.referer),
    gclid: nullableString(queryParams.gclid ?? sessionAcquisition.gclid),
    gad_source: nullableString(queryParams.gad_source ?? sessionAcquisition.gad_source),
    gclsrc: nullableString(queryParams.gclsrc ?? sessionAcquisition.gclsrc),
    dclid: nullableString(queryParams.dclid ?? sessionAcquisition.dclid),
    fbclid: nullableString(queryParams.fbclid ?? sessionAcquisition.fbclid),
    msclkid: nullableString(queryParams.msclkid ?? sessionAcquisition.msclkid),
    landing_page: sessionAcquisition.landing_page || fullUrl(req),
    timestamp: sessionAcquisition.timestamp || nowSql(),
  };

  let refererHost = null;
  try {
    refererHost = acquisition.referer ? new URL(acquisition.referer).host : null;
  } catch {
    refererHost = null;
  }

  if (!acquisition.utm_source) {
    if (acquisition.gclid || acquisition.gclsrc) {
      acquisition.utm_source = "google";
      acquisition.utm_medium = "cpc";
    } else if (
      refererHost &&
      ["google.", "bing.", "yahoo.", "yandex."].some((host) => refererHost.includes(host))
    ) {
      acquisition.utm_source = refererHost;
      acquisition.utm_medium = "organic";
    }
  }

  return acquisition;
}

function isAdTraffic(acquisition) {
  return [
    acquisition.utm_source,
    acquisition.utm_medium,
    acquisition.utm_campaign,
    acquisition.utm_term,
    acquisition.utm_content,
    acquisition.gclid,
    acquisition.gad_source,
    acquisition.gclsrc,
    acquisition.dclid,
    acquisition.fbclid,
    acquisition.msclkid,
  ].some((value) => value);
}

function fullUrl(req) {
  return `${req.protocol}://${req.get("host")}${req.originalUrl}`;
}

function nowSql() {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

function queueVisitorCookie(res, visitorUuid) {
  res.cookie(config.traffic.cookieName, visitorUuid, {
    maxAge: config.traffic.cookieLifetimeMinutes * 60 * 1000,
    httpOnly: true,
    path: "/",
    domain: config.session.domain,
    secure: config.session.secure,
    sameSite: config.traffic.cookieSameSite,
  });
}

function syncSessionTracking(req, acquisition) {
  if (!req.session.visitor_tracking) {
    req.session.visitor_tracking = {};
  }
  if (!req.session.visitor_tracking.acquisition) {
    req.session.visitor_tracking.acquisition = acquisition;
  }

  const visitedPages = req.session.visitor_tracking.visited_pages || [];
  visitedPages.push({
    url: fullUrl(req),
    timestamp: nowSql(),
  });
  req.session.visitor_tracking.visited_pages = visitedPages.slice(-20);
}

async function start(req) {
  const now = new Date();
  const visitorUuid = resolveVisitorUuid(req);
  const sessionAcquisition = req.session?.visitor_tracking?.acquisition || {};
  const acquisition = resolveAcquisitionData(req, sessionAcquisition);
  const adTraffic = isAdTraffic(acquisition);
  const geoData = await geoIpService.lookup(req.clientIp);
  const locale = req.locale || "tr";

  let visitor;
  const existing = await query("SELECT * FROM traffic_visitors WHERE visitor_uuid = $1", [visitorUuid]);

  if (existing.rows[0]) {
    visitor = existing.rows[0];
    const updates = {
      last_seen_at: now,
      last_ip: req.clientIp,
      last_user_agent: req.get("user-agent") || null,
      last_accept_language: req.get("accept-language") || null,
      last_locale: locale,
    };

    if (!visitor.country_code && geoData.country_code) {
      updates.country_code = geoData.country_code;
      updates.country_name = geoData.country_name;
      updates.city = geoData.city;
    }

    if (adTraffic && !visitor.is_ad_traffic) {
      Object.assign(updates, {
        is_ad_traffic: true,
        utm_source: acquisition.utm_source,
        utm_medium: acquisition.utm_medium,
        utm_campaign: acquisition.utm_campaign,
        utm_term: acquisition.utm_term,
        utm_content: acquisition.utm_content,
        gclid: acquisition.gclid,
        gad_source: acquisition.gad_source,
        gclsrc: acquisition.gclsrc,
        dclid: acquisition.dclid,
        fbclid: acquisition.fbclid,
        msclkid: acquisition.msclkid,
      });
    }

    const fields = Object.keys(updates);
    const setSql = fields.map((field, index) => `${field} = $${index + 1}`).join(", ");
    const values = fields.map((field) => updates[field]);
    values.push(visitor.id);
    const updated = await query(
      `UPDATE traffic_visitors SET ${setSql}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
      values,
    );
    visitor = updated.rows[0];
  } else {
    try {
      const created = await query(
        `INSERT INTO traffic_visitors (
          visitor_uuid, first_seen_at, last_seen_at, first_ip, last_ip,
          first_user_agent, last_user_agent, first_accept_language, last_accept_language,
          first_locale, last_locale, first_referer, first_landing_url, is_ad_traffic,
          utm_source, utm_medium, utm_campaign, utm_term, utm_content,
          gclid, gad_source, gclsrc, dclid, fbclid, msclkid,
          country_code, country_name, city
        ) VALUES (
          $1,$2,$2,$3,$3,$4,$4,$5,$5,$6,$6,$7,$8,$9,
          $10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23
        ) RETURNING *`,
        [
          visitorUuid,
          now,
          req.clientIp || null,
          req.get("user-agent") || null,
          req.get("accept-language") || null,
          locale,
          req.get("referer") || null,
          fullUrl(req),
          adTraffic,
          acquisition.utm_source,
          acquisition.utm_medium,
          acquisition.utm_campaign,
          acquisition.utm_term,
          acquisition.utm_content,
          acquisition.gclid,
          acquisition.gad_source,
          acquisition.gclsrc,
          acquisition.dclid,
          acquisition.fbclid,
          acquisition.msclkid,
          geoData.country_code,
          geoData.country_name,
          geoData.city,
        ],
      );
      visitor = created.rows[0];
    } catch (error) {
      if (error.code === "23505") {
        const fallback = await query("SELECT * FROM traffic_visitors WHERE visitor_uuid = $1", [
          visitorUuid,
        ]);
        visitor = fallback.rows[0];
      } else {
        throw error;
      }
    }
  }

  const botRisk = await botRiskScorer.score(req, acquisition);
  const visitResult = await query(
    `INSERT INTO traffic_visits (
      traffic_visitor_id, session_id, request_method, route_name, host, path, full_url,
      query_params, referer, ip_address, bot_score, is_suspected_bot, bot_reasons, occurred_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10,$11,$12,$13::jsonb,$14)
    RETURNING *`,
    [
      visitor.id,
      req.sessionID || null,
      req.method,
      req.routeName || null,
      req.get("host") || null,
      req.path,
      fullUrl(req),
      JSON.stringify(req.query || {}),
      req.get("referer") || null,
      req.clientIp || null,
      botRisk.score,
      botRisk.is_suspected_bot,
      JSON.stringify(botRisk.reasons),
      now,
    ],
  );

  syncSessionTracking(req, acquisition);

  return {
    visitor,
    visit: visitResult.rows[0],
    acquisition,
    visitorUuid,
  };
}

async function finish(visitor, visit, statusCode, startedAt) {
  const durationMs = Math.round((Date.now() - startedAt));
  await query(
    `UPDATE traffic_visits
     SET response_status = $1, response_time_ms = $2, updated_at = NOW()
     WHERE id = $3`,
    [statusCode, durationMs, visit.id],
  );
  await query("UPDATE traffic_visitors SET last_seen_at = NOW(), updated_at = NOW() WHERE id = $1", [
    visitor.id,
  ]);
}

export default {
  start,
  finish,
  queueVisitorCookie,
  resolveAcquisitionData,
  isAdTraffic,
};
