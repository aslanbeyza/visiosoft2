import express from "express";
import { requireAuth, requireSuper } from "../middleware/index.js";
import { authController, adminUserController } from "../modules/accounts/index.js";

const router = express.Router();

router.get("/auth/google", authController.redirectToGoogle);
router.get("/auth/google/callback", authController.handleGoogleCallback);
router.get("/logout", authController.logout);
router.post("/api/auth/login", authController.login);
router.post("/api/auth/logout", authController.logout);
router.get("/api/auth/me", requireAuth, authController.me);

router.get("/api/admin/users", requireAuth, requireSuper, adminUserController.index);
router.post("/api/admin/users", requireAuth, requireSuper, adminUserController.store);
router.patch("/api/admin/users/:id", requireAuth, requireSuper, adminUserController.update);
router.delete("/api/admin/users/:id", requireAuth, requireSuper, adminUserController.destroy);

export default router;
