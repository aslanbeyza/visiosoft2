import { locales } from "../modules/website/index.js";

function setLocale(req, res, next) {
  const firstSegment = req.path.split("/").filter(Boolean)[0];

  if (firstSegment === "en" || firstSegment === "ru") {
    req.locale = firstSegment;
    if (req.session) {
      req.session.locale = firstSegment;
    }
    return next();
  }

  if (req.query.locale && locales.includes(req.query.locale)) {
    req.locale = req.query.locale;
    return next();
  }

  if (req.path === "/" && req.session && !req.session.locale && req.accepts("html") && !req.path.startsWith("/api")) {
    const browserLang = String(req.headers["accept-language"] || "").slice(0, 2);
    if (browserLang === "en" || browserLang === "ru") {
      return res.redirect(302, `/${browserLang}`);
    }
  }

  req.locale = "tr";
  if (req.session) {
    req.session.locale = "tr";
  }
  next();
}

export default setLocale;
