import swaggerUi from "swagger-ui-express";
import { buildDocument } from "./document.js";

export function mountSwagger(app) {
  const document = buildDocument();

  app.get("/swagger.json", (req, res) => {
    res.json(document);
  });

  app.use(
    "/swagger",
    swaggerUi.serve,
    swaggerUi.setup(document, {
      customSiteTitle: "VisioSoft API",
      swaggerOptions: {
        persistAuthorization: true,
        withCredentials: true,
      },
    }),
  );
}

export { buildDocument };
