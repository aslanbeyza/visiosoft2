import config from "../config/index.js";
import { components } from "./components.js";
import {
  health,
  accounts,
  leads,
  traffic,
  googleAds,
  website,
  billing,
} from "./modules/index.js";

export function buildDocument() {
  return {
    openapi: "3.0.3",
    info: {
      title: "VisioSoft API",
      version: "1.0.0",
      description:
        "Modüler backend. Auth cookie session kullanır: önce Accounts > login, sonra Authorize.",
    },
    servers: [{ url: config.app.url, description: "Aktif ortam" }],
    tags: [
      { name: "Health", description: "Sağlık kontrolü" },
      { name: "Accounts", description: "Auth ve admin kullanıcılar" },
      { name: "Leads", description: "Formlar, mail ve CRM" },
      { name: "Traffic", description: "Ziyaretçi takibi" },
      { name: "Google Ads", description: "GCLID lookup" },
      { name: "Website", description: "İçerik, i18n, blog, sitemap" },
      { name: "Billing", description: "Placeholder" },
    ],
    paths: {
      ...health,
      ...accounts,
      ...leads,
      ...traffic,
      ...googleAds,
      ...website,
      ...billing,
    },
    components,
  };
}
