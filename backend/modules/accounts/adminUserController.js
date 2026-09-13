import { asyncHandler, collectErrors, emailRule, requiredString, optionalString } from "../../utils/index.js";
import userModel from "./userModel.js";

const index = asyncHandler(async (req, res) => {
  res.json({ data: await userModel.listUsers() });
});

const store = asyncHandler(async (req, res) => {
  collectErrors({
    name: requiredString(req.body.name, "name", 255),
    email: emailRule(req.body.email),
    password: requiredString(req.body.password, "password"),
  });

  const existing = await userModel.findByEmail(req.body.email);
  if (existing) {
    return res.status(422).json({ message: "Bu e-posta zaten kayıtlı" });
  }

  const user = await userModel.createUser({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    super: Boolean(req.body.super),
  });

  res.status(201).json({ data: userModel.publicUser(user) });
});

const update = asyncHandler(async (req, res) => {
  collectErrors({
    name: optionalString(req.body.name, "name", 255),
    email: req.body.email ? emailRule(req.body.email) : null,
    password: optionalString(req.body.password, "password"),
  });

  const fields = {};
  if (req.body.name) fields.name = req.body.name;
  if (req.body.email) fields.email = req.body.email;
  if (req.body.password) fields.password = req.body.password;
  if (req.body.super !== undefined) fields.super = Boolean(req.body.super);

  const user = await userModel.updateUser(req.params.id, fields);
  if (!user) {
    return res.status(404).json({ message: "Kullanıcı bulunamadı" });
  }

  res.json({ data: userModel.publicUser(user) });
});

const destroy = asyncHandler(async (req, res) => {
  await userModel.deleteUser(req.params.id);
  res.json({ message: "Kullanıcı silindi" });
});

export default { index, store, update, destroy };
