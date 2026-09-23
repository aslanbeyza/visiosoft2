import Seo from '../../components/Seo/index.ts'
import HgsHero from './HgsHero.tsx'
import { HgsAdvantages, HgsFlow, HgsMethods, HgsSectors } from './HgsSections.tsx'
import PaymentMatrix from './PaymentMatrix.tsx'
import { hgsPageCopy as copy } from './hgsPageCopy.ts'

/**
 * /hgs-odeme — çözüm sayfası.
 * Hero (HGS → POS → QR zinciri) → Ödeme matrisi → Yöntemler → Avantajlar → Nasıl çalışır → Sektörler.
 */
export default function HgsPage() {
  return (
    <>
      <Seo title={copy.seo.title} description={copy.seo.description} />
      <HgsHero />
      <PaymentMatrix />
      <HgsMethods />
      <HgsAdvantages />
      <HgsFlow />
      <HgsSectors />
    </>
  )
}
