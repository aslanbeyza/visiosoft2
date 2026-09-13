import express from "express";
import { healthController } from "../controllers/index.js";
import accountsRoutes from "./accounts.js";
import leadsRoutes from "./leads.js";
import trafficRoutes from "./traffic.js";
import googleAdsRoutes from "./googleAds.js";
import websiteRoutes from "./website.js";
import billingRoutes from "./billing.js";

const router = express.Router();

router.get("/", healthController.getRoot);
router.get("/health", healthController.getHealth);
router.use(accountsRoutes);
router.use(leadsRoutes);
router.use(trafficRoutes);
router.use(googleAdsRoutes);
router.use(websiteRoutes);
router.use(billingRoutes);

export default router;
