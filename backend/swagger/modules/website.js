import { json, dataWrapper } from "../components.js";

export default {
  "/api/website/config": {
    get: {
      tags: ["Website"],
      summary: "Public site ayarları",
      responses: {
        200: json(dataWrapper({ type: "object" })),
      },
    },
  },
  "/api/website/routes": {
    get: {
      tags: ["Website"],
      summary: "Locale slug haritası",
      responses: {
        200: json(dataWrapper({ type: "object" })),
      },
    },
  },
  "/api/website/redirects": {
    get: {
      tags: ["Website"],
      summary: "Eski URL için 301 hedefi",
      parameters: [{ name: "path", in: "query", required: true, schema: { type: "string" } }],
      responses: {
        200: json(
          dataWrapper({
            type: "object",
            properties: { redirect_to: { type: "string", nullable: true } },
          }),
        ),
      },
    },
  },
  "/api/i18n/{locale}": {
    get: {
      tags: ["Website"],
      summary: "Çeviri sözlüğü",
      parameters: [
        { name: "locale", in: "path", required: true, schema: { type: "string", enum: ["tr", "en", "ru"] } },
      ],
      responses: {
        200: json(dataWrapper({ type: "object" })),
      },
    },
  },
  "/api/blog": {
    get: {
      tags: ["Website"],
      summary: "Blog listesi",
      parameters: [
        { name: "locale", in: "query", schema: { type: "string", enum: ["tr", "en", "ru"] } },
      ],
      responses: {
        200: json(dataWrapper({ type: "array", items: { $ref: "#/components/schemas/BlogPostSummary" } })),
      },
    },
  },
  "/api/blog/{slug}": {
    get: {
      tags: ["Website"],
      summary: "Blog yazısı",
      parameters: [
        { name: "slug", in: "path", required: true, schema: { type: "string" } },
        { name: "locale", in: "query", schema: { type: "string", enum: ["tr", "en", "ru"] } },
      ],
      responses: {
        200: json(dataWrapper({ type: "object" })),
        301: { description: "Slug başka locale'de" },
        404: { $ref: "#/components/responses/NotFound" },
      },
    },
  },
  "/api/faqs/parking-software": {
    get: {
      tags: ["Website"],
      summary: "Otopark yazılımı SSS",
      parameters: [
        { name: "locale", in: "query", schema: { type: "string", enum: ["tr", "en", "ru"] } },
      ],
      responses: {
        200: json(dataWrapper({ type: "object" })),
      },
    },
  },
  "/api/manuals/field-user-manual": {
    get: {
      tags: ["Website"],
      summary: "Saha kullanım kılavuzu JSON",
      parameters: [
        { name: "locale", in: "query", schema: { type: "string", enum: ["tr", "en", "ru"] } },
      ],
      responses: {
        200: json(dataWrapper({ type: "object" })),
      },
    },
  },
  "/api/manuals/field-user-manual/pdf": {
    get: {
      tags: ["Website"],
      summary: "Saha kılavuzu PDF",
      parameters: [
        { name: "locale", in: "query", schema: { type: "string", enum: ["tr", "en", "ru"] } },
      ],
      responses: {
        200: { description: "PDF dosyası" },
        503: json({ type: "object" }, "PDF üretilemedi"),
      },
    },
  },
  "/sitemap.xml": {
    get: {
      tags: ["Website"],
      summary: "Sitemap XML",
      responses: {
        200: { description: "XML sitemap" },
      },
    },
  },
  "/meet": {
    get: {
      tags: ["Website"],
      summary: "Meet yönlendirmesi",
      responses: {
        302: { description: "Meet URL'ine gider" },
      },
    },
  },
};
