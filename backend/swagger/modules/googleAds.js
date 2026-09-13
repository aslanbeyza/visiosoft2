import { json, dataWrapper, adminSecurity } from "../components.js";

export default {
  "/api/admin/google-ads/status": {
    get: {
      tags: ["Google Ads"],
      summary: "API yapılandırma durumu ve son GCLID'ler",
      security: adminSecurity,
      responses: {
        200: json(
          dataWrapper({
            type: "object",
            properties: {
              configured: { type: "boolean" },
              recent_gclids: { type: "array", items: { type: "string" } },
            },
          }),
        ),
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
      },
    },
  },
  "/api/admin/google-ads/lookup": {
    get: {
      tags: ["Google Ads"],
      summary: "GCLID ile kampanya bilgisi",
      security: adminSecurity,
      parameters: [{ name: "gclid", in: "query", required: true, schema: { type: "string" } }],
      responses: {
        200: json(dataWrapper({ type: "object" })),
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
      },
    },
    post: {
      tags: ["Google Ads"],
      summary: "GCLID lookup (POST)",
      security: adminSecurity,
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { gclid: { type: "string" } },
            },
          },
        },
      },
      responses: {
        200: json(dataWrapper({ type: "object" })),
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
      },
    },
  },
};
