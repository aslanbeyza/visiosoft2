import config from "../../config/index.js";

function sanitize(value, fallback) {
  const candidate = String(value || "").trim();
  if (candidate === "") {
    return fallback;
  }

  if (candidate.startsWith("/")) {
    return candidate;
  }

  try {
    const url = new URL(candidate);
    const baseHost = new URL(config.app.url).host;
    if (url.host.toLowerCase() !== baseHost.toLowerCase()) {
      return fallback;
    }
    return url.pathname + url.search;
  } catch {
    return fallback;
  }
}

export default { sanitize };
