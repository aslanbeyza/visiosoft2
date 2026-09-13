import { userModel } from "../modules/accounts/index.js";

async function requireAuth(req, res, next) {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Oturum gerekli" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Oturum gerekli" });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

function requireSuper(req, res, next) {
  if (!req.user?.super) {
    return res.status(403).json({ message: "Yalnızca super admin erişebilir" });
  }
  next();
}

export { requireAuth, requireSuper };
