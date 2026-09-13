import express from "express";

const router = express.Router();

// Billing modülü Laravel'de boş iskeletti. PayTR iframe Website config'te duruyor.
router.get("/api/billing/status", (req, res) => {
  res.json({
    data: {
      enabled: false,
      note: "Billing module is a placeholder. Payment currently uses the PayTR hosted link.",
    },
  });
});

export default router;
