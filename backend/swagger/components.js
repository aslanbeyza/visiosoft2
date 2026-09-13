const adminSecurity = [{ cookieAuth: [] }];

function json(schema, description = "OK") {
  return {
    description,
    content: {
      "application/json": { schema },
    },
  };
}

function dataWrapper(schema) {
  return {
    type: "object",
    properties: {
      data: schema,
    },
  };
}

const components = {
  securitySchemes: {
    cookieAuth: {
      type: "apiKey",
      in: "cookie",
      name: "connect.sid",
      description: "Session cookie. Önce POST /api/auth/login çağır.",
    },
  },
  schemas: {
    ErrorMessage: {
      type: "object",
      properties: { message: { type: "string" } },
    },
    ValidationError: {
      type: "object",
      properties: {
        message: { type: "string", example: "Doğrulama hatası" },
        errors: {
          type: "object",
          additionalProperties: { type: "array", items: { type: "string" } },
        },
      },
    },
    PaginatedMeta: {
      type: "object",
      properties: {
        page: { type: "integer" },
        per_page: { type: "integer" },
        total: { type: "integer" },
      },
    },
    User: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        email: { type: "string", format: "email" },
        super: { type: "boolean" },
        avatar: { type: "string", nullable: true },
        last_login: { type: "string", format: "date-time", nullable: true },
      },
    },
    LeadProduct: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        qty: { type: "integer", minimum: 1 },
        isFree: { type: "boolean" },
        reason: { type: "string" },
      },
    },
    ContactLeadBody: {
      type: "object",
      required: ["name", "email", "phone", "website_url", "cf-turnstile-response"],
      properties: {
        name: { type: "string", maxLength: 255 },
        email: { type: "string", format: "email" },
        phone: { type: "string", maxLength: 20 },
        company: { type: "string", maxLength: 255 },
        message: { type: "string" },
        website_url: {
          type: "string",
          maxLength: 0,
          description: "Honeypot. Alan gönderilmeli, değer boş olmalı.",
        },
        "cf-turnstile-response": { type: "string" },
      },
    },
    LeadSubmission: {
      type: "object",
      properties: {
        id: { type: "string" },
        form_type: { type: "string", enum: ["quote", "parking_quote_engine", "discovery"] },
        name: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        company: { type: "string", nullable: true },
        address: { type: "string", nullable: true },
        message: { type: "string", nullable: true },
        products: {
          type: "array",
          nullable: true,
          items: { $ref: "#/components/schemas/LeadProduct" },
        },
        mail_sent_at: { type: "string", format: "date-time", nullable: true },
        submitted_at: { type: "string", format: "date-time" },
      },
    },
    BlogPostSummary: {
      type: "object",
      properties: {
        title: { type: "string" },
        slug: { type: "string" },
        locale: { type: "string", enum: ["tr", "en", "ru"] },
        date: { type: "string" },
        excerpt: { type: "string" },
        reading_minutes: { type: "integer" },
      },
    },
  },
  responses: {
    Unauthorized: {
      description: "Oturum yok",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorMessage" } } },
    },
    Forbidden: {
      description: "Super admin değil",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorMessage" } } },
    },
    NotFound: {
      description: "Kayıt bulunamadı",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorMessage" } } },
    },
    ValidationFailed: {
      description: "Doğrulama hatası",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ValidationError" } } },
    },
  },
};

export { components, adminSecurity, json, dataWrapper };
