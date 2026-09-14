import type { ComponentType } from 'react'
import ContentPage from '../../components/ContentPage/index.ts'
import About from '../About/index.ts'
import AlprLanding from '../AlprLanding/index.ts'
import BankAccounts from '../BankAccounts/index.ts'
import Comparison from '../Comparison/index.ts'
import Developers from '../Developers/index.ts'
import EndToEnd from '../EndToEnd/index.ts'
import HardwareProduct from '../HardwareProduct/index.ts'
import HardwareProducts from '../HardwareProducts/index.ts'
import Hgs from '../Hgs/index.ts'
import HgsPark from '../HgsPark/index.ts'
import Legal from '../Legal/index.ts'
import OnStreet from '../OnStreet/index.ts'
import ParkingReports from '../ParkingReports/index.ts'
import ParkingSoftware from '../ParkingSoftware/index.ts'
import ParkingViolations from '../ParkingViolations/index.ts'
import PlakaTanima from '../PlakaTanima/index.ts'
import PlateRecognitionSystem from '../PlateRecognitionSystem/index.ts'
import ProductDetail from '../ProductDetail/index.ts'
import References from '../References/index.ts'
import Services from '../Services/index.ts'
import Showcase from '../Showcase/index.ts'
import WebsitePricing from '../WebsitePricing/index.ts'
import { copyFor } from './pageCopy.ts'

const hardwareSlugs: Record<string, string> = {
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
  // Kiosk yeni ürün detay şablonunu kullanır; diğer donanımlar şimdilik eski sayfada kalır.
  if (routeName === 'hardware-products.kiosk') {
    return <ProductDetail slug="kiosk" />
  }

  const hardwareSlug = hardwareSlugs[routeName]
  if (hardwareSlug) {
    return <HardwareProduct slug={hardwareSlug} />
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
