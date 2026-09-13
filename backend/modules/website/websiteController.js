import fs from "node:fs";
import config from "../../config/index.js";
import { asyncHandler } from "../../utils/index.js";
import i18nService from "./i18nService.js";
import contentService from "./contentService.js";
import blogService from "./blogService.js";
import sitemapService from "./sitemapService.js";
import redirectService from "./redirectService.js";
import pdfService from "./pdfService.js";
import { catalog, pathFor } from "./routeCatalog.js";
import { locales } from "./localeConfig.js";

const getI18n = asyncHandler(async (req, res) => {
  res.json({ data: i18nService.load(req.params.locale || req.locale) });
});

const getRoutes = asyncHandler(async (req, res) => {
  res.json({ data: catalog() });
});

const getManual = asyncHandler(async (req, res) => {
  res.json({ data: contentService.fieldManual(req.query.locale || req.locale) });
});

const getFaqs = asyncHandler(async (req, res) => {
  res.json({ data: contentService.parkingSoftwareFaqs(req.query.locale || req.locale) });
});

const getBlogIndex = asyncHandler(async (req, res) => {
  const locale = req.query.locale || req.locale || "tr";
  res.json({ data: blogService.listSummaries(locale) });
});

const getBlogShow = asyncHandler(async (req, res) => {
  const locale = req.query.locale || req.locale || "tr";
  const post = blogService.findByLocaleAndSlug(locale, req.params.slug);

  if (post) {
    return res.json({
      data: {
        ...post,
        related: blogService.related(post, locale),
      },
    });
  }

  const otherLocale = blogService.localeForSlug(req.params.slug);
  if (otherLocale && otherLocale !== locale) {
    return res.redirect(301, pathFor("blog.index", otherLocale).replace(/blog$/, `blog/${req.params.slug}`));
  }

  return res.status(404).json({ message: "Yazı bulunamadı" });
});

const getSitemap = asyncHandler(async (req, res) => {
  res.type("application/xml").send(sitemapService.toXml());
});

const getRedirectHint = asyncHandler(async (req, res) => {
  const target = redirectService.redirectPathFor(req.query.path);
  res.json({ data: { redirect_to: target } });
});

const getConfig = asyncHandler(async (req, res) => {
  res.json({
    data: {
      locales,
      meet_url: config.website.meetUrl,
      calendly_url: config.website.calendlyUrl,
      whatsapp_wa_id: config.website.whatsappWaId,
      whatsapp_display: config.website.whatsappDisplay,
      turnstile_site_key: config.turnstile.siteKey,
      payment_iframe: "https://www.paytr.com/link/SqmGCxQ",
    },
  });
});

const downloadManualPdf = asyncHandler(async (req, res) => {
  const locale = req.query.locale || req.locale || "tr";
  const pageUrl = `${config.app.url}${pathFor("field-manual", locale)}?pdf=1`;

  try {
    const result = await pdfService.generate(pageUrl, locale);
    res.download(result.path, result.download_name, (error) => {
      if (!error) {
        fs.unlink(result.path, () => {});
      }
    });
  } catch (error) {
    const diagnostics = await pdfService.diagnostics();
    res.status(503).json({
      message:
        locale === "en"
          ? "Server-side PDF generation failed. Missing component details are listed below."
          : locale === "ru"
            ? "Не удалось сформировать PDF на сервере. Ниже приведены сведения об отсутствующих компонентах."
            : "PDF sunucu tarafında üretilemedi. Eksik veya çalışmayan bileşenler aşağıda listelenmiştir.",
      error: error.message,
      diagnostics,
    });
  }
});

const meetRedirect = (req, res) => {
  res.redirect(302, config.website.meetUrl);
};

export default {
  getI18n,
  getRoutes,
  getManual,
  getFaqs,
  getBlogIndex,
  getBlogShow,
  getSitemap,
  getRedirectHint,
  getConfig,
  downloadManualPdf,
  meetRedirect,
};
