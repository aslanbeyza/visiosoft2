import { isPrivateIp, logger } from "../../utils/index.js";

async function lookup(ip) {
  if (isPrivateIp(ip)) {
    return emptyResult();
  }

  try {
    const url = `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,countryCode,country,city`;
    const response = await fetch(url, { signal: AbortSignal.timeout(3000) });

    if (!response.ok) {
      return emptyResult();
    }

    const data = await response.json();
    if (data.status !== "success") {
      return emptyResult();
    }

    return {
      country_code: data.countryCode || null,
      country_name: data.country || null,
      city: data.city || null,
    };
  } catch (error) {
    logger.debug("GeoIp lookup failed", { ip, error: error.message });
    return emptyResult();
  }
}

function emptyResult() {
  return {
    country_code: null,
    country_name: null,
    city: null,
  };
}

export default { lookup };
