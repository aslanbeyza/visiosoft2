import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { locales } from "./localeConfig.js";

const dirname = fileURLToPath(new URL(".", import.meta.url));
const cache = new Map();

function load(locale) {
  const safeLocale = locales.includes(locale) ? locale : "tr";
  if (cache.has(safeLocale)) {
    return cache.get(safeLocale);
  }

  const filePath = path.join(dirname, "../../data/lang", `${safeLocale}.json`);
  const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
  cache.set(safeLocale, content);
  return content;
}

function translate(key, locale = "tr", replace = {}) {
  const messages = load(locale);
  let value = messages[key] || key;
  for (const [name, replacement] of Object.entries(replace)) {
    value = value.replaceAll(`:${name}`, replacement);
  }
  return value;
}

export default { load, translate };
