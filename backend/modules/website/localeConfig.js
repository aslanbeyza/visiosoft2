const locales = ["tr", "en", "ru"];

const prefixedLocales = {
  tr: "",
  en: "en",
  ru: "ru",
};

function localePrefix(locale) {
  return prefixedLocales[locale] ?? "";
}

function localizedPath(locale, slug = "") {
  const prefix = localePrefix(locale);
  const cleanSlug = String(slug || "").replace(/^\/+|\/+$/g, "");

  if (!prefix && !cleanSlug) {
    return "/";
  }

  if (!prefix) {
    return `/${cleanSlug}`;
  }

  return cleanSlug ? `/${prefix}/${cleanSlug}` : `/${prefix}`;
}

export { locales, prefixedLocales, localePrefix, localizedPath };
