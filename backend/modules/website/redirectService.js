import config from "../../config/index.js";
import { pathFor } from "./routeCatalog.js";

function redirectExactLegacyPath(pathname) {
  switch (pathname) {
    case "index.html":
      return pathFor("home", "tr");
    case "about.html":
    case "about/index.html":
      return pathFor("team", "tr");
    case "contact.html":
    case "contact-us/index.html":
      return pathFor("contact", "tr");
    case "services.html":
      return pathFor("services", "tr");
    case "case-studies.html":
    case "case-studies/index.html":
      return pathFor("references", "tr");
    case "management-system-policy/index.html":
      return pathFor("legal.legal", "tr");
    default:
      return null;
  }
}

function redirectLegacyProjectPath(pathname) {
  if (!/^nproject(?:-category)?\/.+\/index\.html$/.test(pathname)) {
    return null;
  }
  return pathFor("references", "tr");
}

function normalizeHardwareSuffix(locale, suffix) {
  const normalized = suffix ? suffix.replace(/^\/+|\/+$/g, "") : null;
  if (!normalized) {
    return null;
  }
  if (locale === "en" && normalized === "katalog") return "catalog";
  if (locale === "ru" && normalized === "catalog") return "katalog";
  return normalized;
}

function redirectLegacyLocalizedAlias(pathname) {
  const hardware = pathname.match(/^(en|ru)\/donanim-urunleri(?:\/(.*))?$/);
  if (hardware) {
    const base = pathFor("hardware-products", hardware[1]);
    const suffix = normalizeHardwareSuffix(hardware[1], hardware[2]);
    return suffix ? `${base}/${suffix}` : base;
  }

  const bank = pathname.match(/^(en|ru)\/banka-hesaplari$/);
  if (bank) {
    return pathFor("bank-accounts", bank[1]);
  }

  const alpr = pathname.match(/^(en|ru)\/plaka-tanima$/);
  if (alpr) {
    return pathFor("alpr.index", alpr[1]);
  }

  return null;
}

function redirectPathFor(pathname) {
  const clean = String(pathname || "").replace(/^\/+|\/+$/g, "");
  if (!clean || clean === ".") {
    return null;
  }

  return (
    redirectExactLegacyPath(clean) ||
    redirectLegacyProjectPath(clean) ||
    redirectLegacyLocalizedAlias(clean)
  );
}

function stripRedirectableQuery(query = {}) {
  const cleaned = { ...query };
  for (const key of config.website.canonicalRedirectQueryParameters) {
    delete cleaned[key];
  }
  return cleaned;
}

export default {
  redirectPathFor,
  stripRedirectableQuery,
};
