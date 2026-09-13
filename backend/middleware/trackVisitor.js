import { clientIp, logger } from "../utils/index.js";
import { trackingService } from "../modules/traffic/index.js";

const SKIP_PREFIXES = ["/health", "/favicon", "/sitemap.xml", "/swagger", "/swagger.json"];

function shouldSkip(req) {
  return SKIP_PREFIXES.some((prefix) => req.path === prefix || req.path.startsWith(`${prefix}/`));
}

function trackVisitor(req, res, next) {
  req.clientIp = clientIp(req);

  if (shouldSkip(req)) {
    return next();
  }

  const startedAt = Date.now();

  trackingService
    .start(req)
    .then((result) => {
      req.trackedVisitorId = result.visitor.id;
      req.trackedVisitId = result.visit.id;
      trackingService.queueVisitorCookie(res, result.visitorUuid);

      res.on("finish", () => {
        trackingService.finish(result.visitor, result.visit, res.statusCode, startedAt).catch((error) => {
          logger.debug("Traffic finish failed", { error: error.message });
        });
      });

      next();
    })
    .catch((error) => {
      logger.warn("Traffic tracking failed", { error: error.message });
      next();
    });
}

export default trackVisitor;
