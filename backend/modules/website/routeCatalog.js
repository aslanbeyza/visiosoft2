import { locales, localizedPath } from "./localeConfig.js";

const routeSlugs = {
  contact: { tr: "iletisim", en: "contact", ru: "kontakt" },
  "software-products": { tr: "yazilim-urunleri", en: "software-products", ru: "programmnyye-produkty" },
  developers: { tr: "gelistiriciler", en: "developers", ru: "razrabotchikam" },
  "hardware-products": { tr: "donanim-urunleri", en: "hardware-products", ru: "oborudovanie" },
  "hardware-products.catalog": { tr: "katalog", en: "catalog", ru: "katalog" },
  "hardware-products.kiosk": { tr: "kiosk", en: "kiosk", ru: "kiosk" },
  "hardware-products.tir-kiosk": { tr: "tir-kiosk", en: "truck-kiosk", ru: "tir-kiosk" },
  "hardware-products.togerbox": { tr: "togerbox", en: "togerbox", ru: "togerbox" },
  "hardware-products.visiobox": { tr: "visiobox", en: "visiobox", ru: "visiobox" },
  "hardware-products.rack-kabin": { tr: "rack-kabin", en: "rack-cabinet", ru: "rack-kabin" },
  "hardware-products.kamera-muhafaza": { tr: "kamera-muhafaza", en: "camera-housing", ru: "kamera-muhafaza" },
  "hardware-products.kamera-montaj-kulesi": {
    tr: "kamera-montaj-kulesi",
    en: "camera-mount-tower",
    ru: "kamera-montazhnaya-bashnya",
  },
  "hardware-products.ledli-reklam-paneli": {
    tr: "ledli-reklam-paneli",
    en: "led-panel",
    ru: "svetodiodnaya-panel",
  },
  services: { tr: "hizmetlerimiz", en: "services", ru: "uslugi" },
  "website-pricing": { tr: "site-fiyatlari", en: "website-pricing", ru: "tseny-na-sayty" },
  "end-to-end": { tr: "uctan-uca-sistem", en: "end-to-end-system", ru: "kompleksnaya-sistema" },
  "on-street": { tr: "yol-ustu-parklandirma", en: "on-street-parking", ru: "ulichnaya-parkovka" },
  "parking-violations": {
    tr: "isgaliye-ve-park-ceza",
    en: "parking-violations-and-fines",
    ru: "narusheniya-parkovki-i-shtrafy",
  },
  hgs: { tr: "hgs-odeme", en: "hgs-payment", ru: "hgs-oplata" },
  references: { tr: "referanslarimiz", en: "references", ru: "nashi-referencii" },
  "bank-accounts": { tr: "banka-hesaplari", en: "bank-accounts", ru: "bankovskie-scheta" },
  "kus-bakisi": { tr: "kus-bakisi-otopark-yonetimi", en: "bird-eye-view-management", ru: "upravlenie-s-vysoty" },
  "mobil-abonelik": {
    tr: "mobil-uygulama-ile-park-aboneligi-nasil-yapilir",
    en: "mobile-subscription",
    ru: "mobilnaya-podpiska",
  },
  team: { tr: "takim", en: "team", ru: "komanda" },
  "designer-tool": { tr: "designer_kus_bakisi_cizim_araci", en: "designer-tool", ru: "instrument-dizaynera" },
  "low-confidence": {
    tr: "hgs_ile_dusuk_confidence_onay",
    en: "hgs-low-confidence-approval",
    ru: "podtverzhdenie-nizkoy-uverennosti-hgs",
  },
  comparison: { tr: "karsilastirma", en: "comparison", ru: "sravnenie" },
  "plate-recognition-system": {
    tr: "plaka-tanima-sistemi",
    en: "license-plate-recognition-system",
    ru: "sistema-raspoznavaniya-nomerov",
  },
  "parking-software": {
    tr: "otopark-yazilimi",
    en: "parking-software",
    ru: "programmnoe-obespechenie-dlya-parkovok",
  },
  "parking-reports": {
    tr: "otopark-yaziliminda-raporlar",
    en: "parking-software-reports",
    ru: "otchety-parkovochnoe-po",
  },
  "field-manual": { tr: "saha-kullanim-kilavuzu", en: "field-user-manual", ru: "polevoe-rukovodstvo" },
  glossary: { tr: "otopark-terimleri", en: "parking-glossary", ru: "slovar-parkovki" },
  "field-manual.pdf": {
    tr: "saha-kullanim-kilavuzu/pdf",
    en: "field-user-manual/pdf",
    ru: "polevoe-rukovodstvo/pdf",
  },
  "alpr.index": { tr: "plaka-tanima", en: "alpr", ru: "alpr" },
  "alpr.landing": { tr: "plaka-tanima-cozumu", en: "alpr-turnkey-solution", ru: "alpr-turnkey-solution" },
  "legal.privacy": { tr: "gizlilik-politikasi", en: "privacy-policy", ru: "politika-konfidentsialnosti" },
  "legal.terms": { tr: "kullanim-sartlari", en: "terms-of-use", ru: "usloviya-ispolzovaniya" },
  "legal.sales": { tr: "satis-ve-iadeler", en: "sales-and-refunds", ru: "prodazhi-i-vozvraty" },
  "legal.distance-sales": {
    tr: "mesafeli-satis-sozlesmesi",
    en: "distance-sales-agreement",
    ru: "dogovor-distantsionnoy-prodazhi",
  },
  "legal.return-policy": { tr: "iade-politikasi", en: "return-policy", ru: "politika-vozvrata" },
  "legal.legal": { tr: "yasal", en: "legal", ru: "pravovaya-informatsiya" },
  sitemap: { tr: "site-haritasi", en: "sitemap", ru: "karta-sayta" },
  "quote.index": { tr: "teklif-al", en: "get-quote", ru: "poluchit-predlozhenie" },
  "parking-quote-engine.index": {
    tr: "otopark-teklif-motoru",
    en: "parking-quote-engine",
    ru: "kalkulyator-parkovki",
  },
  "discovery.show": { tr: "ucretsiz-kesif", en: "free-discovery", ru: "besplatnyy-osmotr" },
};

const sitemapRouteNames = [
  "home",
  "contact",
  "software-products",
  "hardware-products",
  "services",
  "website-pricing",
  "quote.index",
  "parking-quote-engine.index",
  "discovery.show",
  "end-to-end",
  "on-street",
  "parking-violations",
  "hgs",
  "hgs-park",
  "references",
  "bank-accounts",
  "kus-bakisi",
  "mobil-abonelik",
  "team",
  "designer-tool",
  "low-confidence",
  "comparison",
  "plate-recognition-system",
  "parking-software",
  "field-manual",
  "glossary",
  "alpr.landing",
  "alpr.index",
  "legal.privacy",
  "legal.terms",
  "legal.sales",
  "legal.distance-sales",
  "legal.return-policy",
  "legal.legal",
  "sitemap",
  "blog.index",
];

const hardwareChildren = [
  "hardware-products.catalog",
  "hardware-products.kiosk",
  "hardware-products.tir-kiosk",
  "hardware-products.togerbox",
  "hardware-products.visiobox",
  "hardware-products.rack-kabin",
  "hardware-products.kamera-muhafaza",
  "hardware-products.kamera-montaj-kulesi",
  "hardware-products.ledli-reklam-paneli",
];

function slug(routeName, locale) {
  if (routeName === "home") {
    return "";
  }
  if (routeName === "blog.index") {
    return "blog";
  }
  if (routeName === "hgs-park") {
    return "hgs-park";
  }

  const localized = routeSlugs[routeName];
  if (!localized) {
    return routeName;
  }
  return localized[locale] || localized.tr || routeName;
}

function pathFor(routeName, locale) {
  if (hardwareChildren.includes(routeName)) {
    return localizedPath(locale, `${slug("hardware-products", locale)}/${slug(routeName, locale)}`);
  }
  return localizedPath(locale, slug(routeName, locale));
}

function leadFormPaths(routeName) {
  return locales.map((locale) => pathFor(routeName, locale));
}

function legacyRedirectsForLocale(locale) {
  if (locale === "tr") {
    return [];
  }

  return Object.keys(routeSlugs)
    .filter((routeName) => {
      const trSlug = slug(routeName, "tr");
      const localizedSlug = slug(routeName, locale);
      return trSlug !== localizedSlug;
    })
    .map((routeName) => ({
      from: pathFor(routeName.replace(locale, "tr"), "tr").replace(/^\/(iletisim|teklif-al|.*)/, (match) => {
        const prefix = locale === "en" ? "/en" : "/ru";
        const trPath = pathFor(routeName, "tr");
        return `${prefix}${trPath}`;
      }),
      to: pathFor(routeName, locale),
    }));
}

function catalog() {
  const routes = {};
  for (const locale of locales) {
    routes[locale] = {
      home: pathFor("home", locale),
      blog: localizedPath(locale, "blog"),
      "hgs-park": localizedPath(locale, "hgs-park"),
    };
    for (const routeName of Object.keys(routeSlugs)) {
      routes[locale][routeName] = pathFor(routeName, locale);
    }
  }
  return routes;
}

export {
  routeSlugs,
  sitemapRouteNames,
  slug,
  pathFor,
  leadFormPaths,
  legacyRedirectsForLocale,
  catalog,
};
