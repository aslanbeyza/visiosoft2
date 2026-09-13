import { json, dataWrapper, adminSecurity } from "../components.js";

const leadAliases = `
Eski site path'leri de aynı handler'a gider:
- quote: /teklif-al, /en/get-quote, /ru/poluchit-predlozhenie
- parking: /otopark-teklif-motoru, /en/parking-quote-engine, /ru/kalkulyator-parkovki
- discovery: /ucretsiz-kesif, /en/free-discovery, /ru/besplatnyy-osmotr
`;

export default {
  "/api/leads/quote": {
    post: {
      tags: ["Leads"],
      summary: "Teklif formu",
      description: leadAliases,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              allOf: [
                { $ref: "#/components/schemas/ContactLeadBody" },
                {
                  type: "object",
                  properties: {
                    products: {
                      type: "array",
                      items: { $ref: "#/components/schemas/LeadProduct" },
                    },
                  },
                },
              ],
            },
          },
        },
      },
      responses: {
        200: json({ type: "object", properties: { message: { type: "string" } } }),
        422: { $ref: "#/components/responses/ValidationFailed" },
        500: json({ $ref: "#/components/schemas/ErrorMessage" }, "Mail gönderilemedi"),
      },
    },
  },
  "/api/leads/parking-quote-engine": {
    post: {
      tags: ["Leads"],
      summary: "Otopark teklif motoru",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              allOf: [
                { $ref: "#/components/schemas/ContactLeadBody" },
                {
                  type: "object",
                  required: ["project_type", "needs_barrier", "needs_turnkey_installation", "products"],
                  properties: {
                    project_type: { type: "string", enum: ["paid", "subscription"] },
                    payment_methods: {
                      type: "array",
                      items: { type: "string", enum: ["card", "hgs"] },
                    },
                    needs_barrier: { type: "boolean" },
                    needs_turnkey_installation: { type: "boolean" },
                    products: {
                      type: "array",
                      minItems: 1,
                      items: { $ref: "#/components/schemas/LeadProduct" },
                    },
                  },
                },
              ],
            },
          },
        },
      },
      responses: {
        200: json({ type: "object", properties: { message: { type: "string" } } }),
        422: { $ref: "#/components/responses/ValidationFailed" },
        500: json({ $ref: "#/components/schemas/ErrorMessage" }, "Mail gönderilemedi"),
      },
    },
  },
  "/api/leads/discovery": {
    post: {
      tags: ["Leads"],
      summary: "Ücretsiz keşif formu",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              allOf: [
                { $ref: "#/components/schemas/ContactLeadBody" },
                {
                  type: "object",
                  required: ["address"],
                  properties: { address: { type: "string" } },
                },
              ],
            },
          },
        },
      },
      responses: {
        200: json({ type: "object", properties: { message: { type: "string" } } }),
        422: { $ref: "#/components/responses/ValidationFailed" },
        500: json({ $ref: "#/components/schemas/ErrorMessage" }, "Mail gönderilemedi"),
      },
    },
  },
  "/api/admin/leads": {
    get: {
      tags: ["Leads"],
      summary: "Lead listesi",
      security: adminSecurity,
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        { name: "per_page", in: "query", schema: { type: "integer", default: 25 } },
        { name: "form_type", in: "query", schema: { type: "string", enum: ["quote", "parking_quote_engine", "discovery"] } },
        { name: "email", in: "query", schema: { type: "string" } },
        { name: "from", in: "query", schema: { type: "string", format: "date" } },
        { name: "to", in: "query", schema: { type: "string", format: "date" } },
        { name: "mail_failed", in: "query", schema: { type: "boolean" } },
        { name: "suspicious_visit", in: "query", schema: { type: "boolean" } },
      ],
      responses: {
        200: json({
          type: "object",
          properties: {
            data: { type: "array", items: { $ref: "#/components/schemas/LeadSubmission" } },
            meta: { $ref: "#/components/schemas/PaginatedMeta" },
          },
        }),
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
      },
    },
  },
  "/api/admin/leads/{id}": {
    get: {
      tags: ["Leads"],
      summary: "Lead detayı + Google Ads",
      security: adminSecurity,
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: {
        200: json(dataWrapper({ $ref: "#/components/schemas/LeadSubmission" })),
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
        404: { $ref: "#/components/responses/NotFound" },
      },
    },
  },
};
