import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import passport from "passport";
import { fileURLToPath } from "node:url";
import path from "node:path";
import config from "./config/index.js";
import { pool, migrate } from "./db/index.js";
import routes from "./routes/index.js";
import { setLocale, trackVisitor, notFound, errorHandler } from "./middleware/index.js";
import { authController } from "./modules/accounts/index.js";
import { mountSwagger } from "./swagger/index.js";

const PgSession = connectPgSimple(session);

authController.configurePassport();

const app = express();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "express_sessions",
      createTableIfMissing: false,
    }),
    secret: config.session.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: config.session.lifetimeMinutes * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: config.session.secure,
      domain: config.session.domain,
    },
  }),
);
app.use(passport.initialize());
mountSwagger(app);
app.use(setLocale);
app.use(trackVisitor);
app.use(routes);
app.use(notFound);
app.use(errorHandler);

async function start() {
  await migrate();
  app.listen(config.app.port, () => {
    console.log(`Sunucu http://localhost:${config.app.port} adresinde çalışıyor`);
  });
}

const isMain =
  Boolean(process.argv[1]) && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMain) {
  start().catch((error) => {
    console.error("Sunucu başlatılamadı:", error);
    process.exit(1);
  });
}

export default app;
