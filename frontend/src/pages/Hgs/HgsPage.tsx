import Seo from '../../components/Seo/index.ts'
import SubNav from '../../components/SubNav/index.ts'
import HgsHero from './HgsHero.tsx'
import { HgsAdvantages, HgsFlow, HgsMethods, HgsSectors } from './HgsSections.tsx'
import PaymentMatrix from './PaymentMatrix.tsx'
import { hgsPageCopy as copy } from './hgsPageCopy.ts'

/**
 * /hgs-odeme — çözüm sayfası.
 * Gece tonlu hero (HGS → POS → QR zinciri) → Ödeme matrisi (yöntem kutucukları + ParkingFlow vurgusu) → alt gezinme →
 * Yöntemler (kartlar) → Avantajlar (panel ekranı + liste) → Nasıl çalışır (lacivert, adım çizgisi) → Sektörler.
 */
export default function HgsPage() {
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
    </>
  )
}
