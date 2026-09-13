import { json } from "../components.js";

export default {
  "/": {
    get: {
      tags: ["Health"],
      summary: "API kökü",
      responses: {
        200: json({
          type: "object",
          properties: { message: { type: "string" } },
        }),
      },
    },
  },
  "/health": {
    get: {
      tags: ["Health"],
      summary: "Sağlık kontrolü",
      responses: {
        200: json({
          type: "object",
          properties: { status: { type: "string", example: "ok" } },
        }),
      },
    },
  },
};
