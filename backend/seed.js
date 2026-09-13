import { migrate, pool } from "./db/index.js";
import config from "./config/index.js";
import { userModel } from "./modules/accounts/index.js";

async function seed() {
  await migrate();

  const existing = await userModel.findByEmail(config.auth.adminEmail);
  if (existing) {
    console.log("Admin kullanıcı zaten var:", existing.email);
  } else {
    const user = await userModel.createUser({
      name: "Admin",
      email: config.auth.adminEmail,
      password: config.auth.adminPassword,
      super: true,
    });
    console.log("Admin kullanıcı oluşturuldu:", user.email);
  }
}

seed()
  .then(() => pool.end())
  .catch((error) => {
    console.error("Seed hatası:", error);
    process.exit(1);
  });
