import { json, dataWrapper, adminSecurity } from "../components.js";

export default {
  "/api/auth/login": {
    post: {
      tags: ["Accounts"],
      summary: "Admin / kullanıcı girişi",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", format: "email" },
                password: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        200: json(dataWrapper({ $ref: "#/components/schemas/User" })),
        401: { $ref: "#/components/responses/Unauthorized" },
        422: { $ref: "#/components/responses/ValidationFailed" },
      },
    },
  },
  "/api/auth/logout": {
    post: {
      tags: ["Accounts"],
      summary: "Çıkış",
      security: adminSecurity,
      responses: {
        200: json({ type: "object", properties: { message: { type: "string" } } }),
      },
    },
  },
  "/api/auth/me": {
    get: {
      tags: ["Accounts"],
      summary: "Oturumdaki kullanıcı",
      security: adminSecurity,
      responses: {
        200: json(dataWrapper({ $ref: "#/components/schemas/User" })),
        401: { $ref: "#/components/responses/Unauthorized" },
      },
    },
  },
  "/auth/google": {
    get: {
      tags: ["Accounts"],
      summary: "Google OAuth başlat",
      parameters: [
        {
          name: "redirect",
          in: "query",
          schema: { type: "string" },
          description: "Giriş sonrası yönlendirme. Sadece aynı origin veya / ile başlayan path.",
        },
      ],
      responses: {
        302: { description: "Google'a yönlendirir" },
        503: json({ $ref: "#/components/schemas/ErrorMessage" }, "OAuth yapılandırılmadı"),
      },
    },
  },
  "/auth/google/callback": {
    get: {
      tags: ["Accounts"],
      summary: "Google OAuth callback",
      responses: {
        302: { description: "Frontend'e yönlendirir" },
      },
    },
  },
  "/logout": {
    get: {
      tags: ["Accounts"],
      summary: "Tarayıcı çıkışı (Laravel uyumu)",
      responses: {
        302: { description: "Frontend'e yönlendirir" },
      },
    },
  },
  "/api/admin/users": {
    get: {
      tags: ["Accounts"],
      summary: "Kullanıcı listesi",
      security: adminSecurity,
      responses: {
        200: json(dataWrapper({ type: "array", items: { $ref: "#/components/schemas/User" } })),
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
      },
    },
    post: {
      tags: ["Accounts"],
      summary: "Kullanıcı oluştur",
      security: adminSecurity,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email", "password"],
              properties: {
                name: { type: "string" },
                email: { type: "string", format: "email" },
                password: { type: "string" },
                super: { type: "boolean" },
              },
            },
          },
        },
      },
      responses: {
        201: json(dataWrapper({ $ref: "#/components/schemas/User" })),
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
        422: { $ref: "#/components/responses/ValidationFailed" },
      },
    },
  },
  "/api/admin/users/{id}": {
    patch: {
      tags: ["Accounts"],
      summary: "Kullanıcı güncelle",
      security: adminSecurity,
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
                email: { type: "string", format: "email" },
                password: { type: "string" },
                super: { type: "boolean" },
              },
            },
          },
        },
      },
      responses: {
        200: json(dataWrapper({ $ref: "#/components/schemas/User" })),
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
        404: { $ref: "#/components/responses/NotFound" },
      },
    },
    delete: {
      tags: ["Accounts"],
      summary: "Kullanıcı sil",
      security: adminSecurity,
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: {
        200: json({ type: "object", properties: { message: { type: "string" } } }),
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
      },
    },
  },
};
