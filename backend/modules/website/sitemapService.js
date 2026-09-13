import config from "../../config/index.js";
import { locales } from "./localeConfig.js";
import { sitemapRouteNames, pathFor } from "./routeCatalog.js";

function urls() {
  const host = String(config.website.sitemapHost).replace(/\/$/, "");
  const items = [];

  for (const name of sitemapRouteNames) {
    const alternates = locales.map((locale) => ({
      locale,
      href: `${host}${pathFor(name, locale)}`,
    }));

    for (const alternate of alternates) {
      items.push({
        loc: alternate.href,
        alternates,
      });
    }
  }

  return items;
}

function toXml(items = urls()) {
  const body = items
    .map((item) => {
      const links = item.alternates
        .map(
          (alternate) =>
            `<xhtml:link rel="alternate" hreflang="${alternate.locale}" href="${alternate.href}" />`,
        )
        .join("");
      return `<url><loc>${item.loc}</loc>${links}</url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>`;
}

export default { urls, toXml };
