import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "../../config/index.js";
import { asyncHandler, collectErrors, emailRule, requiredString } from "../../utils/index.js";
import userModel from "./userModel.js";
import oauthRedirect from "./oauthRedirect.js";

function configurePassport() {
  if (!config.google.clientId || !config.google.clientSecret) {
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientId,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackUrl,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await userModel.resolveGoogleUser(profile);
          done(null, user);
        } catch (error) {
          done(error);
        }
      },
    ),
  );
}

const login = asyncHandler(async (req, res) => {
  collectErrors({
    email: emailRule(req.body.email),
    password: requiredString(req.body.password, "password"),
  });

  const user = await userModel.findByEmail(req.body.email);
  const valid = await userModel.verifyPassword(user, req.body.password);
  if (!user || !valid) {
    return res.status(401).json({ message: "E-posta veya şifre hatalı" });
  }

  req.session.userId = user.id;
  await userModel.updateUser(user.id, { last_login: new Date() });
  res.json({ data: userModel.publicUser(user) });
});

const me = asyncHandler(async (req, res) => {
  res.json({ data: userModel.publicUser(req.user) });
});

const logout = asyncHandler(async (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    if (req.accepts("html") && !req.path.startsWith("/api")) {
      return res.redirect(config.app.frontendUrl);
    }
    res.json({ message: "Çıkış yapıldı" });
  });
});

function redirectToGoogle(req, res, next) {
  if (!config.google.clientId) {
    return res.status(503).json({ message: "Google OAuth yapılandırılmadı" });
  }

  req.session.oauth_redirect = oauthRedirect.sanitize(req.query.redirect, "/");
  passport.authenticate("google", { scope: ["profile", "email"], session: false })(req, res, next);
}

function handleGoogleCallback(req, res, next) {
  passport.authenticate("google", { session: false }, async (error, user) => {
    if (error || !user) {
      return res.redirect(`${config.app.frontendUrl}/?error=google-login-failed`);
    }

    req.session.userId = user.id;
    const redirectTo = req.session.oauth_redirect || "/";
    delete req.session.oauth_redirect;
    res.redirect(redirectTo.startsWith("/") ? `${config.app.frontendUrl}${redirectTo}` : redirectTo);
  })(req, res, next);
}

export default {
  configurePassport,
  login,
  me,
  logout,
  redirectToGoogle,
  handleGoogleCallback,
};
