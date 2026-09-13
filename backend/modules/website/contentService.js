import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { locales } from "./localeConfig.js";

const dirname = fileURLToPath(new URL(".", import.meta.url));

function readLocalizedJson(folder, locale) {
  const safeLocale = locales.includes(locale) ? locale : "tr";
  const preferred = path.join(dirname, "../../data", folder, `${safeLocale}.json`);
  const fallback = path.join(dirname, "../../data", folder, "tr.json");
  const filePath = fs.existsSync(preferred) ? preferred : fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fieldManual(locale) {
  return readLocalizedJson("manuals/field-user-manual", locale);
}

function parkingSoftwareFaqs(locale) {
  return readLocalizedJson("faqs/parking-software", locale);
}

export default { fieldManual, parkingSoftwareFaqs };
