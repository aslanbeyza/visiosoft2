import express from "express";
import { requireAuth, requireSuper } from "../middleware/index.js";
import { trafficAdminController } from "../modules/traffic/index.js";

const router = express.Router();

router.get("/api/admin/traffic/stats", requireAuth, requireSuper, trafficAdminController.stats);
router.get("/api/admin/traffic/visitors", requireAuth, requireSuper, trafficAdminController.listVisitors);
router.get("/api/admin/traffic/visits", requireAuth, requireSuper, trafficAdminController.listVisits);
router.get("/api/admin/traffic/visits/export", requireAuth, requireSuper, trafficAdminController.exportVisits);
router.get("/api/admin/traffic/visits/:id", requireAuth, requireSuper, trafficAdminController.showVisit);
router.post("/api/admin/traffic/prune", requireAuth, requireSuper, trafficAdminController.prune);

export default router;
