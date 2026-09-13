export const locales = ['tr'] as const
export type Locale = 'tr'

type LegacyLocale = 'tr' | 'en' | 'ru'

const prefixes: Record<LegacyLocale, string> = {
  tr: '',
  en: 'en',
  ru: 'ru',
}

const routeSlugs: Record<string, Record<LegacyLocale, string>> = {
  contact: { tr: 'iletisim', en: 'contact', ru: 'kontakt' },
  'software-products': { tr: 'yazilim-urunleri', en: 'software-products', ru: 'programmnyye-produkty' },
  developers: { tr: 'gelistiriciler', en: 'developers', ru: 'razrabotchikam' },
  'hardware-products': { tr: 'donanim-urunleri', en: 'hardware-products', ru: 'oborudovanie' },
  'hardware-products.catalog': { tr: 'katalog', en: 'catalog', ru: 'katalog' },
  'hardware-products.kiosk': { tr: 'kiosk', en: 'kiosk', ru: 'kiosk' },
  'hardware-products.tir-kiosk': { tr: 'tir-kiosk', en: 'truck-kiosk', ru: 'tir-kiosk' },
  'hardware-products.togerbox': { tr: 'togerbox', en: 'togerbox', ru: 'togerbox' },
  'hardware-products.visiobox': { tr: 'visiobox', en: 'visiobox', ru: 'visiobox' },
  'hardware-products.rack-kabin': { tr: 'rack-kabin', en: 'rack-cabinet', ru: 'rack-kabin' },
  'hardware-products.kamera-muhafaza': { tr: 'kamera-muhafaza', en: 'camera-housing', ru: 'kamera-muhafaza' },
  'hardware-products.kamera-montaj-kulesi': {
    tr: 'kamera-montaj-kulesi',
    en: 'camera-mount-tower',
    ru: 'kamera-montazhnaya-bashnya',
  },
  'hardware-products.ledli-reklam-paneli': { tr: 'ledli-reklam-paneli', en: 'led-panel', ru: 'svetodiodnaya-panel' },
  services: { tr: 'hizmetlerimiz', en: 'services', ru: 'uslugi' },
  'website-pricing': { tr: 'site-fiyatlari', en: 'website-pricing', ru: 'tseny-na-sayty' },
  'end-to-end': { tr: 'uctan-uca-sistem', en: 'end-to-end-system', ru: 'kompleksnaya-sistema' },
  'on-street': { tr: 'yol-ustu-parklandirma', en: 'on-street-parking', ru: 'ulichnaya-parkovka' },
  'parking-violations': {
    tr: 'isgaliye-ve-park-ceza',
    en: 'parking-violations-and-fines',
    ru: 'narusheniya-parkovki-i-shtrafy',
  },
  hgs: { tr: 'hgs-odeme', en: 'hgs-payment', ru: 'hgs-oplata' },
  references: { tr: 'referanslarimiz', en: 'references', ru: 'nashi-referencii' },
  'bank-accounts': { tr: 'banka-hesaplari', en: 'bank-accounts', ru: 'bankovskie-scheta' },
  'kus-bakisi': { tr: 'kus-bakisi-otopark-yonetimi', en: 'bird-eye-view-management', ru: 'upravlenie-s-vysoty' },
  'mobil-abonelik': {
    tr: 'mobil-uygulama-ile-park-aboneligi-nasil-yapilir',
    en: 'mobile-subscription',
    ru: 'mobilnaya-podpiska',
  },
  team: { tr: 'takim', en: 'team', ru: 'komanda' },
  'designer-tool': { tr: 'designer_kus_bakisi_cizim_araci', en: 'designer-tool', ru: 'instrument-dizaynera' },
  'low-confidence': {
    tr: 'hgs_ile_dusuk_confidence_onay',
    en: 'hgs-low-confidence-approval',
    ru: 'podtverzhdenie-nizkoy-uverennosti-hgs',
  },
  comparison: { tr: 'karsilastirma', en: 'comparison', ru: 'sravnenie' },
  'plate-recognition-system': {
    tr: 'plaka-tanima-sistemi',
    en: 'license-plate-recognition-system',
    ru: 'sistema-raspoznavaniya-nomerov',
  },
  'parking-software': {
    tr: 'otopark-yazilimi',
    en: 'parking-software',
    ru: 'programmnoe-obespechenie-dlya-parkovok',
  },
  'parking-reports': {
    tr: 'otopark-yaziliminda-raporlar',
    en: 'parking-software-reports',
    ru: 'otchety-parkovochnoe-po',
  },
  'field-manual': { tr: 'saha-kullanim-kilavuzu', en: 'field-user-manual', ru: 'polevoe-rukovodstvo' },
  'alpr.index': { tr: 'plaka-tanima', en: 'alpr', ru: 'alpr' },
  'alpr.landing': { tr: 'plaka-tanima-cozumu', en: 'alpr-turnkey-solution', ru: 'alpr-turnkey-solution' },
  'legal.privacy': { tr: 'gizlilik-politikasi', en: 'privacy-policy', ru: 'politika-konfidentsialnosti' },
  'legal.terms': { tr: 'kullanim-sartlari', en: 'terms-of-use', ru: 'usloviya-ispolzovaniya' },
  'legal.sales': { tr: 'satis-ve-iadeler', en: 'sales-and-refunds', ru: 'prodazhi-i-vozvraty' },
  'legal.distance-sales': {
    tr: 'mesafeli-satis-sozlesmesi',
    en: 'distance-sales-agreement',
    ru: 'dogovor-distantsionnoy-prodazhi',
  },
  'legal.return-policy': { tr: 'iade-politikasi', en: 'return-policy', ru: 'politika-vozvrata' },
  'legal.legal': { tr: 'yasal', en: 'legal', ru: 'pravovaya-informatsiya' },
  sitemap: { tr: 'site-haritasi', en: 'sitemap', ru: 'karta-sayta' },
  'quote.index': { tr: 'teklif-al', en: 'get-quote', ru: 'poluchit-predlozhenie' },
  'parking-quote-engine.index': {
    tr: 'otopark-teklif-motoru',
    en: 'parking-quote-engine',
    ru: 'kalkulyator-parkovki',
  },
  'discovery.show': { tr: 'ucretsiz-kesif', en: 'free-discovery', ru: 'besplatnyy-osmotr' },
}

const hardwareChildren = [
  'hardware-products.catalog',
  'hardware-products.kiosk',
  'hardware-products.tir-kiosk',
  'hardware-products.togerbox',
  'hardware-products.visiobox',
  'hardware-products.rack-kabin',
  'hardware-products.kamera-muhafaza',
  'hardware-products.kamera-montaj-kulesi',
  'hardware-products.ledli-reklam-paneli',
]

export const marketingRouteNames = [
  'developers',
  'hardware-products',
  ...hardwareChildren,
  'services',
  'website-pricing',
  'end-to-end',
  'on-street',
  'parking-violations',
  'hgs',
  'references',
  'bank-accounts',
  'kus-bakisi',
  'mobil-abonelik',
  'team',
  'designer-tool',
  'low-confidence',
  'comparison',
  'plate-recognition-system',
  'parking-software',
  'parking-reports',
  'alpr.index',
  'alpr.landing',
  'legal.privacy',
  'legal.terms',
  'legal.sales',
  'legal.distance-sales',
  'legal.return-policy',
  'legal.legal',
] as const

function localizedPath(locale: LegacyLocale, slugValue = '') {
  const prefix = prefixes[locale]
  const clean = slugValue.replace(/^\/+|\/+$/g, '')
  if (!prefix && !clean) return '/'
  if (!prefix) return `/${clean}`
  return clean ? `/${prefix}/${clean}` : `/${prefix}`
}

function slug(routeName: string, locale: LegacyLocale = 'tr') {
  if (routeName === 'home') return ''
  if (routeName === 'blog.index') return 'blog'
  if (routeName === 'hgs-park') return 'hgs-park'
  if (routeName === 'payment') return 'payment'
  return routeSlugs[routeName]?.[locale] || routeSlugs[routeName]?.tr || routeName
}

function pathForLocale(routeName: string, locale: LegacyLocale, extra = '') {
  if (hardwareChildren.includes(routeName)) {
    const base = `${slug('hardware-products', locale)}/${slug(routeName, locale)}`
    return localizedPath(locale, extra ? `${base}/${extra}` : base)
  }

  return localizedPath(locale, extra ? `${slug(routeName, locale)}/${extra}` : slug(routeName, locale))
}

export function pathFor(routeName: string, extra = '') {
  return pathForLocale(routeName, 'tr', extra)
}

export function localeFromPath(_pathname: string): Locale {
  return 'tr'
}

export function routeNameFromPath(pathname: string): string {
  const normalized = pathname.replace(/\/+$/, '') || '/'

  if (normalized === pathFor('home')) return 'home'
  if (normalized === pathFor('blog.index') || normalized.startsWith(`${pathFor('blog.index')}/`)) {
    return normalized === pathFor('blog.index') ? 'blog.index' : 'blog.show'
  }

  const names = ['hgs-park', 'payment', ...Object.keys(routeSlugs)].sort(
    (a, b) => pathFor(b).length - pathFor(a).length,
  )

  for (const name of names) {
    if (normalized === pathFor(name)) return name
  }

  return 'home'
}

export function redirectToTurkish(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '') || '/'
  if (normalized === '/en' || normalized === '/ru') return '/'

  const legacy: LegacyLocale | null = normalized.startsWith('/en/') ? 'en' : normalized.startsWith('/ru/') ? 'ru' : null
  if (!legacy) return normalized

  const names = ['home', 'blog.index', 'hgs-park', 'payment', ...Object.keys(routeSlugs)].sort(
    (a, b) => pathForLocale(b, legacy).length - pathForLocale(a, legacy).length,
  )

  for (const name of names) {
    const candidate = pathForLocale(name, legacy)
    if (normalized === candidate) {
      return name === 'blog.index' ? pathFor('blog.index') : pathFor(name)
    }
    if (name === 'blog.index' && normalized.startsWith(`${candidate}/`)) {
      return pathFor('blog.index')
    }
  }

  return '/'
}
