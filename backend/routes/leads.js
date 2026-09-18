import express from "express";
import { requireAuth, requireSuper } from "../middleware/index.js";
import { leadController, leadAdminController } from "../modules/leads/index.js";
import { leadFormPaths } from "../modules/website/index.js";

const router = express.Router();

router.post("/api/leads/quote", leadController.storeQuote);
router.post("/api/leads/parking-quote-engine", leadController.storeParkingQuote);
router.post("/api/leads/discovery", leadController.storeDiscovery);
router.post("/api/leads/contact", leadController.storeContact);

for (const pathName of leadFormPaths("quote.index")) {
  router.post(pathName, leadController.storeQuote);
}
for (const pathName of leadFormPaths("parking-quote-engine.index")) {
  router.post(pathName, leadController.storeParkingQuote);
}
for (const pathName of leadFormPaths("discovery.show")) {
  router.post(pathName, leadController.storeDiscovery);
}

router.get("/api/admin/leads", requireAuth, requireSuper, leadAdminController.index);
router.get("/api/admin/leads/:id", requireAuth, requireSuper, leadAdminController.show);

export default router;
