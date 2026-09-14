import CtaBand from '../../components/CtaBand/index.ts'
import Seo from '../../components/Seo/index.ts'
import SubNav from '../../components/SubNav/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import HgsHero from './HgsHero.tsx'
import { HgsAdvantages, HgsFlow, HgsMethods, HgsSectors } from './HgsSections.tsx'
import PaymentMatrix from './PaymentMatrix.tsx'
import { hgsPageCopy as copy } from './hgsPageCopy.ts'

/**
 * /hgs-odeme — çözüm sayfası.
 * Gece tonlu hero (HGS → POS → QR zinciri) → Ödeme matrisi (yöntem kutucukları + ParkingFlow vurgusu) → alt gezinme →
 * Yöntemler (kartlar) → Avantajlar (panel ekranı + liste) → Nasıl çalışır (lacivert, adım çizgisi) → Sektörler → CtaBand.
 */
export default function HgsPage() {
  const path = usePath()

  return (
    <>
      <Seo title={copy.seo.title} description={copy.seo.description} />
      <HgsHero />
      <PaymentMatrix />
      <SubNav items={copy.subNav} />
      <HgsMethods />
      <HgsAdvantages />
      <HgsFlow />
      <HgsSectors />
      <CtaBand
        eyebrow={copy.cta.eyebrow}
        title={copy.cta.title}
        description={copy.cta.description}
        primary={{ label: copy.cta.primary, to: path('quote.index') }}
        secondary={{ label: copy.cta.secondary, to: path('contact') }}
      />
    </>
  )
}
