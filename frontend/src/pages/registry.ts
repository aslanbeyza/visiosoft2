import type { ComponentType } from 'react'

type PageModule = { default: ComponentType<any> }
type Loader = () => Promise<PageModule>

export const pages = {
  home: () => import('./Home/index.ts'),
  about: () => import('./About/index.ts'),
  alprLanding: () => import('./AlprLanding/index.ts'),
  bankAccounts: () => import('./BankAccounts/index.ts'),
  blogIndex: () => import('./BlogIndex/index.ts'),
  blogShow: () => import('./BlogShow/index.ts'),
  comparison: () => import('./Comparison/index.ts'),
  developers: () => import('./Developers/index.ts'),
  endToEnd: () => import('./EndToEnd/index.ts'),
  fieldManual: () => import('./FieldManual/index.ts'),
  glossary: () => import('./Glossary/index.ts'),
  hardwareProducts: () => import('./HardwareProducts/index.ts'),
  hgs: () => import('./Hgs/index.ts'),
  hgsPark: () => import('./HgsPark/index.ts'),
  legal: () => import('./Legal/index.ts'),
  notFound: () => import('./NotFound/index.ts'),
  onStreet: () => import('./OnStreet/index.ts'),
  parkingQuote: () => import('./ParkingQuote/index.ts'),
  parkingReports: () => import('./ParkingReports/index.ts'),
  parkingSoftware: () => import('./ParkingSoftware/index.ts'),
  parkingViolations: () => import('./ParkingViolations/index.ts'),
  payment: () => import('./Payment/index.ts'),
  plakaTanima: () => import('./PlakaTanima/index.ts'),
  plateRecognitionSystem: () => import('./PlateRecognitionSystem/index.ts'),
  productDetail: () => import('./ProductDetail/index.ts'),
  productGallery: () => import('./ProductGallery/index.ts'),
  quote: () => import('./Quote/index.ts'),
  contact: () => import('./Contact/index.ts'),
  references: () => import('./References/index.ts'),
  services: () => import('./Services/index.ts'),
  showcase: () => import('./Showcase/index.ts'),
  sitemap: () => import('./Sitemap/index.ts'),
  softwareProducts: () => import('./SoftwareProducts/index.ts'),
  websitePricing: () => import('./WebsitePricing/index.ts'),

  contentPage: () => import('../components/ContentPage/index.ts'),
} satisfies Record<string, Loader>

export type PageKey = keyof typeof pages

const routePages: Record<string, PageKey> = {
  home: 'home',
  'software-products': 'softwareProducts',
  contact: 'contact',
  'quote.index': 'quote',
  'discovery.show': 'quote',
  'parking-quote-engine.index': 'parkingQuote',
  'blog.index': 'blogIndex',
  'blog.show': 'blogShow',
  'field-manual': 'fieldManual',
  glossary: 'glossary',
  sitemap: 'sitemap',
  payment: 'payment',
  'hgs-park': 'hgsPark',
  developers: 'developers',
  'hardware-products': 'hardwareProducts',
  'hardware-products.catalog': 'hardwareProducts',
  'hardware-products.kiosk': 'productDetail',
  'hardware-products.tir-kiosk': 'productDetail',
  'hardware-products.togerbox': 'productDetail',
  'hardware-products.visiobox': 'productDetail',
  'hardware-products.rack-kabin': 'productDetail',
  'hardware-products.kamera-muhafaza': 'productDetail',
  'hardware-products.kamera-montaj-kulesi': 'productDetail',
  'hardware-products.ledli-reklam-paneli': 'productDetail',
  'product-gallery': 'productGallery',
  services: 'services',
  'website-pricing': 'websitePricing',
  'end-to-end': 'endToEnd',
  'on-street': 'onStreet',
  'parking-violations': 'parkingViolations',
  hgs: 'hgs',
  references: 'references',
  'bank-accounts': 'bankAccounts',
  'kus-bakisi': 'showcase',
  'mobil-abonelik': 'showcase',
  'designer-tool': 'showcase',
  'low-confidence': 'showcase',
  team: 'about',
  comparison: 'comparison',
  'plate-recognition-system': 'plateRecognitionSystem',
  'parking-software': 'parkingSoftware',
  'parking-reports': 'parkingReports',
  'alpr.index': 'plakaTanima',
  'alpr.landing': 'alprLanding',
  'legal.privacy': 'legal',
  'legal.terms': 'legal',
  'legal.sales': 'legal',
  'legal.distance-sales': 'legal',
  'legal.return-policy': 'legal',
  'legal.legal': 'legal',
}

const loaded = new Map<PageKey, Promise<PageModule>>()

export function preloadPage(key: PageKey): Promise<PageModule> {
  const cached = loaded.get(key)
  if (cached) return cached
  const promise = (pages[key] as Loader)().catch((error: unknown) => {
    loaded.delete(key)
    throw error
  })
  loaded.set(key, promise)
  return promise
}

export function preloadRoute(routeName: string): Promise<PageModule> {
  return preloadPage(routePages[routeName] ?? 'notFound')
}

export function pageKeyForRoute(routeName: string): PageKey {
  return routePages[routeName] ?? 'notFound'
}
