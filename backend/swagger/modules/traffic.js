import { json, dataWrapper, adminSecurity } from "../components.js";

export default {
  "/api/admin/traffic/stats": {
    get: {
      tags: ["Traffic"],
      summary: "Dashboard istatistikleri",
      security: adminSecurity,
      responses: {
        200: json(dataWrapper({ type: "object" })),
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
      },
    },
  },
  "/api/admin/traffic/visitors": {
    get: {
      tags: ["Traffic"],
      summary: "Ziyaretçi listesi",
      security: adminSecurity,
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        { name: "per_page", in: "query", schema: { type: "integer", default: 25 } },
        { name: "utm_source", in: "query", schema: { type: "string" } },
        { name: "gclid", in: "query", schema: { type: "string" } },
        { name: "is_ad_traffic", in: "query", schema: { type: "boolean" } },
      ],
      responses: {
        200: json({
          type: "object",
          properties: {
            data: { type: "array", items: { type: "object" } },
            meta: { $ref: "#/components/schemas/PaginatedMeta" },
          },
        }),
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
      },
    },
  },
  "/api/admin/traffic/visits": {
    get: {
      tags: ["Traffic"],
      summary: "Ziyaret listesi",
      security: adminSecurity,
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        { name: "per_page", in: "query", schema: { type: "integer", default: 25 } },
        { name: "visitor_id", in: "query", schema: { type: "string" } },
        { name: "is_suspected_bot", in: "query", schema: { type: "boolean" } },
        { name: "from", in: "query", schema: { type: "string", format: "date" } },
        { name: "to", in: "query", schema: { type: "string", format: "date" } },
        { name: "search", in: "query", schema: { type: "string" } },
      ],
      responses: {
        200: json({
          type: "object",
          properties: {
            data: { type: "array", items: { type: "object" } },
            meta: { $ref: "#/components/schemas/PaginatedMeta" },
          },
        }),
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
      },
    },
  },
  "/api/admin/traffic/visits/export": {
    get: {
      tags: ["Traffic"],
      summary: "Ziyaretleri CSV indir",
      security: adminSecurity,
      responses: {
        200: {
          description: "CSV dosyası",
          content: { "text/csv": { schema: { type: "string" } } },
        },
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
      },
    },
  },
  "/api/admin/traffic/visits/{id}": {
    get: {
      tags: ["Traffic"],
      summary: "Ziyaret detayı",
      security: adminSecurity,
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: {
        200: json(dataWrapper({ type: "object" })),
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
        404: { $ref: "#/components/responses/NotFound" },
      },
    },
  },
  "/api/admin/traffic/prune": {
    post: {
      tags: ["Traffic"],
      summary: "Eski traffic kayıtlarını sil",
      security: adminSecurity,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["before"],
              properties: {
                before: { type: "string", format: "date", example: "2026-01-01" },
                include_lead_linked: { type: "boolean", default: false },
              },
            },
          },
        },
      },
      responses: {
        200: json({
          type: "object",
          properties: {
            message: { type: "string" },
            data: {
              type: "object",
              properties: {
                deletedVisits: { type: "integer" },
                deletedVisitors: { type: "integer" },
              },
            },
          },
        }),
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
      },
    },
  },
};
