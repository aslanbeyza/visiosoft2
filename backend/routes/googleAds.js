import express from "express";
import { requireAuth, requireSuper } from "../middleware/index.js";
import { googleAdsAdminController } from "../modules/googleAds/index.js";

const router = express.Router();

router.get("/api/admin/google-ads/status", requireAuth, requireSuper, googleAdsAdminController.status);
router.get("/api/admin/google-ads/lookup", requireAuth, requireSuper, googleAdsAdminController.lookup);
router.post("/api/admin/google-ads/lookup", requireAuth, requireSuper, googleAdsAdminController.lookup);

export default router;
