import express from "express";
import { websiteController, pathFor, locales } from "../modules/website/index.js";

const router = express.Router();

router.get("/sitemap.xml", websiteController.getSitemap);
router.get("/meet", websiteController.meetRedirect);
router.get("/api/website/config", websiteController.getConfig);
router.get("/api/website/routes", websiteController.getRoutes);
router.get("/api/website/redirects", websiteController.getRedirectHint);
router.get("/api/i18n/:locale", websiteController.getI18n);
router.get("/api/manuals/field-user-manual", websiteController.getManual);
router.get("/api/manuals/field-user-manual/pdf", websiteController.downloadManualPdf);
router.get("/api/faqs/parking-software", websiteController.getFaqs);
router.get("/api/blog", websiteController.getBlogIndex);
router.get("/api/blog/:slug", websiteController.getBlogShow);

for (const locale of locales) {
  router.get(pathFor("field-manual.pdf", locale), (req, res, next) => {
    req.locale = locale;
    websiteController.downloadManualPdf(req, res, next);
  });
}

export default router;
