import CtaBand from '../../components/CtaBand/index.ts'
import Section from '../../components/Section/index.ts'
import Seo from '../../components/Seo/index.ts'
import SubNav from '../../components/SubNav/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import PlakaHero from './PlakaHero.tsx'
import PlakaSaha from './PlakaSaha.tsx'
import PlakaSpeed from './PlakaSpeed.tsx'
import PlakaTech from './PlakaTech.tsx'
import PlateScan from './PlateScan.tsx'
import { plakaCopy as copy } from './plakaCopy.ts'

/**
 * /plaka-tanima — amiral sayfa.
 * Okuma anı (sabit metin + kaydırmalı ParkingFlow) → alt gezinme → Başarı (koşullu plaka okuma) →
 * Hız (özellik kartları) → Teknoloji (gece tonu, sayaçlar) → Saha (donanım ve rehberler) → CtaBand.
 */
export default function PlakaTanimaPage() {
  const path = usePath()

  return (
    <>
      <Seo title={copy.seo.title} description={copy.seo.description} />
      <PlakaHero />
      <SubNav items={copy.subNav} />
      <Section id="basari" tone="surface" labelledBy="basari-baslik">
        <PlateScan />
      </Section>
      <PlakaSpeed />
      <PlakaTech />
      <PlakaSaha />
      <CtaBand
        eyebrow={copy.cta.eyebrow}
        title={copy.cta.title}
        description={copy.cta.description}
        primary={{ label: copy.cta.primary, to: path('discovery.show') }}
        secondary={{ label: copy.cta.secondary, to: path('quote.index') }}
      />
    </>
  )
}
