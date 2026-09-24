import { lazy } from 'react'
import type { ComponentType } from 'react'
import type { ProductDetailSlug } from '../ProductDetail/index.ts'
import { pages } from '../registry.ts'
import { copyFor } from './pageCopy.ts'

const ContentPage = lazy(pages.contentPage)
const About = lazy(pages.about)
const AlprLanding = lazy(pages.alprLanding)
const BankAccounts = lazy(pages.bankAccounts)
const Comparison = lazy(pages.comparison)
const Developers = lazy(pages.developers)
const EndToEnd = lazy(pages.endToEnd)
const HardwareProducts = lazy(pages.hardwareProducts)
const Hgs = lazy(pages.hgs)
const HgsPark = lazy(pages.hgsPark)
const Legal = lazy(pages.legal)
const OnStreet = lazy(pages.onStreet)
const ParkingReports = lazy(pages.parkingReports)
const ParkingSoftware = lazy(pages.parkingSoftware)
const ParkingViolations = lazy(pages.parkingViolations)
const PlakaTanima = lazy(pages.plakaTanima)
const PlateRecognitionSystem = lazy(pages.plateRecognitionSystem)
const ProductDetail = lazy(pages.productDetail)
const References = lazy(pages.references)
const Services = lazy(pages.services)
const Showcase = lazy(pages.showcase)
const WebsitePricing = lazy(pages.websitePricing)

const hardwareSlugs: Record<string, ProductDetailSlug> = {
  'hardware-products.kiosk': 'kiosk',
  'hardware-products.tir-kiosk': 'tir-kiosk',
  'hardware-products.togerbox': 'togerbox',
  'hardware-products.visiobox': 'visiobox',
  'hardware-products.rack-kabin': 'rack-kabin',
  'hardware-products.kamera-muhafaza': 'kamera-muhafaza',
  'hardware-products.kamera-montaj-kulesi': 'kamera-montaj-kulesi',
  'hardware-products.ledli-reklam-paneli': 'ledli-reklam-paneli',
}

const dedicatedPages: Record<string, ComponentType> = {
  developers: Developers,
  services: Services,
  'end-to-end': EndToEnd,
  'on-street': OnStreet,
  'parking-violations': ParkingViolations,
  hgs: Hgs,
  'hgs-park': HgsPark,
  'alpr.index': PlakaTanima,
  'alpr.landing': AlprLanding,
  comparison: Comparison,
  'parking-software': ParkingSoftware,
  'plate-recognition-system': PlateRecognitionSystem,
  'website-pricing': WebsitePricing,
  'parking-reports': ParkingReports,
  references: References,
  'bank-accounts': BankAccounts,
  'hardware-products': HardwareProducts,
  team: About,
}

const showcaseRoutes = ['kus-bakisi', 'mobil-abonelik', 'designer-tool', 'low-confidence']
const legalRoutes = [
  'legal.privacy',
  'legal.terms',
  'legal.sales',
  'legal.distance-sales',
  'legal.return-policy',
  'legal.legal',
]

export default function Marketing({ routeName }: { routeName: string }) {
  const hardwareSlug = hardwareSlugs[routeName]
  if (hardwareSlug) {
    return <ProductDetail key={hardwareSlug} slug={hardwareSlug} />
  }

  if (showcaseRoutes.includes(routeName)) {
    return <Showcase routeName={routeName} />
  }

  if (legalRoutes.includes(routeName)) {
    return <Legal routeName={routeName} />
  }

  const Dedicated = dedicatedPages[routeName]
  if (Dedicated) {
    return <Dedicated />
  }

  if (routeName === 'hardware-products.catalog') {
    return <HardwareProducts />
  }

  const copy = copyFor(routeName)
  return (
    <ContentPage
      routeName={routeName}
      titleKey={copy.titleKey}
      descriptionKey={copy.descriptionKey}
      points={copy.points}
      image={copy.image}
    />
  )
}
