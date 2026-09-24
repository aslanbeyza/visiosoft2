import "dotenv/config";

function env(name, fallback = "") {
  const value = process.env[name];
  return value === undefined || value === "" ? fallback : value;
}

function envInt(name, fallback) {
  const value = Number.parseInt(env(name, String(fallback)), 10);
  return Number.isNaN(value) ? fallback : value;
}

function envBool(name, fallback = false) {
  const value = env(name, "").toLowerCase();
  if (value === "") {
    return fallback;
  }
  return ["1", "true", "yes", "on"].includes(value);
}

export default {
  app: {
    name: env("APP_NAME", "VisioSoft"),
    env: env("APP_ENV", "local"),
    url: env("APP_URL", "http://localhost:3000"),
    frontendUrl: env("FRONTEND_URL", "http://localhost:5173"),
    port: envInt("PORT", 3000),
  },
  cors: {

    origin: env("CORS_ORIGIN", "http://localhost:5173,http://localhost:5174")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  },
  db: {
    host: env("DB_HOST", "127.0.0.1"),
    port: envInt("DB_PORT", 5432),
    database: env("DB_DATABASE", "visiosoft"),
    user: env("DB_USERNAME", "beyzaaslan"),
    password: env("DB_PASSWORD", ""),
  },
  session: {
    secret: env("SESSION_SECRET", "visiosoft-local-session-secret"),
    lifetimeMinutes: envInt("SESSION_LIFETIME", 120),
    domain: env("SESSION_DOMAIN", "") || undefined,
    secure: envBool("SESSION_SECURE_COOKIE", false),
  },
  auth: {
    bcryptRounds: envInt("BCRYPT_ROUNDS", 12),
    adminEmail: env("ADMIN_EMAIL", "a@a.com"),
    adminPassword: env("ADMIN_PASSWORD", "236330"),
  },
  google: {
    clientId: env("GOOGLE_CLIENT_ID"),
    clientSecret: env("GOOGLE_CLIENT_SECRET"),
    callbackUrl: env("GOOGLE_REDIRECT_URI", "http://localhost:3000/auth/google/callback"),
  },
  mail: {
    host: env("MAIL_HOST", "sandbox.smtp.mailtrap.io"),
    port: envInt("MAIL_PORT", 587),
    user: env("MAIL_USERNAME"),
    pass: env("MAIL_PASSWORD"),
    fromAddress: env("MAIL_FROM_ADDRESS", "quotes@sale.test"),
    fromName: env("MAIL_FROM_NAME", "VisioSoft"),
    quoteTo: env("QUOTE_MAIL_TO"),
  },
  turnstile: {
    siteKey: env("TURNSTILE_SITE_KEY"),
    secret: env("TURNSTILE_SECRET_KEY"),
  },
  crm: {
    baseUrl: env("CRM_BASE_URL"),
    apiKey: env("CRM_LEAD_INTAKE_API_KEY"),
  },
  traffic: {
    cookieName: env("TRAFFIC_VISITOR_COOKIE", "visiosoft_vid"),
    cookieLifetimeMinutes: envInt("TRAFFIC_VISITOR_COOKIE_LIFETIME", 60 * 24 * 365 * 2),
    cookieSameSite: env("TRAFFIC_VISITOR_COOKIE_SAME_SITE", "lax"),
    botScoreThreshold: envInt("TRAFFIC_BOT_SCORE_THRESHOLD", 60),
    ipBurstWindowMinutes: envInt("TRAFFIC_IP_BURST_WINDOW_MINUTES", 5),
    ipBurstThreshold: envInt("TRAFFIC_IP_BURST_THRESHOLD", 25),
    gclidMultiIpWindowDays: envInt("TRAFFIC_GCLID_MULTI_IP_WINDOW_DAYS", 30),
    botUserAgentPatterns: [
      "bot",
      "crawler",
      "spider",
      "slurp",
      "python",
      "scrapy",
      "curl",
      "wget",
      "httpclient",
      "go-http-client",
      "headless",
      "phantom",
      "selenium",
      "puppeteer",
      "playwright",
    ],
  },
  googleAds: {
    developerToken: env("GOOGLE_ADS_DEVELOPER_TOKEN"),
    clientId: env("GOOGLE_ADS_CLIENT_ID"),
    clientSecret: env("GOOGLE_ADS_CLIENT_SECRET"),
    refreshToken: env("GOOGLE_ADS_REFRESH_TOKEN"),
    customerId: env("GOOGLE_ADS_CUSTOMER_ID"),
  },
  website: {
    sitemapHost: env("SITEMAP_HOST", env("APP_URL", "https://visiosoft.com.tr")),
    groqApiKey: env("GROQ_API_KEY"),
    groqModel: env("GROQ_MODEL", "llama-3.3-70b-versatile"),
    meetUrl: env("MEET_URL", "https://meet.google.com/juf-tgiq-scf"),
    calendlyUrl: env("CALENDLY_URL", "https://calendly.com/fatihalp/30min"),
    nodeBinary: env("NODE_BINARY"),
    whatsappWaId: env("WHATSAPP_WA_ID", "905015045034"),
    whatsappDisplay: env("WHATSAPP_DISPLAY", "+90 (501) 504 5034"),
    canonicalRedirectQueryParameters: ["view", "status", "ref", "__hstc", "__hssc", "__hsfp"],
  },
  zone: {
    apiUrl: env("ZONE_API_URL", "https://zone.test/api"),
    apiToken: env("ZONE_API_TOKEN"),
  },
};
