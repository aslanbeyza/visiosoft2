import { ValidationError, logger } from "../utils/index.js";

function errorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(422).json({
      message: "Doğrulama hatası",
      errors: err.errors,
    });
  }

  logger.error(err.message || "Sunucu hatası", {
    stack: err.stack,
    path: req.path,
  });

  res.status(err.status || 500).json({
    message: err.message || "Sunucu hatası",
  });
}

export default errorHandler;
