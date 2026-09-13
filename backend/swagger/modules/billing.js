import { json, dataWrapper } from "../components.js";

export default {
  "/api/billing/status": {
    get: {
      tags: ["Billing"],
      summary: "Billing durumu (placeholder)",
      description: "Laravel Billing modülü boştu. Ödeme PayTR hosted link ile yapılıyor.",
      responses: {
        200: json(
          dataWrapper({
            type: "object",
            properties: {
              enabled: { type: "boolean" },
              note: { type: "string" },
            },
          }),
        ),
      },
    },
  },
};
