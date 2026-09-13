import bcrypt from "bcrypt";
import crypto from "crypto";
import config from "../../config/index.js";
import { query } from "../../db/index.js";

function publicUser(user) {
  if (!user) {
    return null;
  }

  const { password, remember_token, ...safe } = user;
  return safe;
}

async function findById(id) {
  const result = await query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0] || null;
}

async function findByEmail(email) {
  const result = await query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0] || null;
}

async function findByGoogleId(googleId) {
  const result = await query("SELECT * FROM users WHERE google_id = $1", [googleId]);
  return result.rows[0] || null;
}

async function createUser({ name, email, password, super: isSuper = false, googleId, avatar }) {
  const hashed = password ? await bcrypt.hash(password, config.auth.bcryptRounds) : null;
  const result = await query(
    `INSERT INTO users (name, email, password, super, google_id, avatar, last_login)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     RETURNING *`,
    [name, email, hashed, isSuper, googleId || null, avatar || null],
  );
  return result.rows[0];
}

async function updateUser(id, fields) {
  const payload = { ...fields, updated_at: new Date() };
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, config.auth.bcryptRounds);
  } else {
    delete payload.password;
  }

  const keys = Object.keys(payload);
  const setSql = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
  const values = keys.map((key) => payload[key]);
  values.push(id);

  const result = await query(
    `UPDATE users SET ${setSql} WHERE id = $${values.length} RETURNING *`,
    values,
  );
  return result.rows[0] || null;
}

async function deleteUser(id) {
  await query("DELETE FROM users WHERE id = $1", [id]);
}

async function listUsers() {
  const result = await query(
    "SELECT id, name, email, super, avatar, last_login, created_at FROM users ORDER BY id DESC",
  );
  return result.rows;
}

async function verifyPassword(user, password) {
  if (!user?.password || !password) {
    return false;
  }
  return bcrypt.compare(password, user.password);
}

async function resolveGoogleUser(googleUser) {
  const googleId = googleUser.id;
  const email = googleUser.emails?.[0]?.value || `google-${googleId}@local.invalid`;
  const name = googleUser.displayName || "Google User";
  const avatar = googleUser.photos?.[0]?.value || null;

  const byGoogle = await findByGoogleId(googleId);
  if (byGoogle) {
    return updateUser(byGoogle.id, { avatar, last_login: new Date() });
  }

  const byEmail = await findByEmail(email);
  if (byEmail) {
    return updateUser(byEmail.id, { google_id: googleId, avatar, last_login: new Date() });
  }

  return createUser({
    name,
    email,
    googleId,
    avatar,
    password: crypto.randomBytes(20).toString("hex"),
  });
}

export default {
  publicUser,
  findById,
  findByEmail,
  findByGoogleId,
  createUser,
  updateUser,
  deleteUser,
  listUsers,
  verifyPassword,
  resolveGoogleUser,
};
