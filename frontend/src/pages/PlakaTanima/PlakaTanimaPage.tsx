import Section from '../../components/Section/index.ts'
import Seo from '../../components/Seo/index.ts'
import SubNav from '../../components/SubNav/index.ts'
import PlakaHero from './PlakaHero.tsx'
import PlakaSaha from './PlakaSaha.tsx'
import PlakaSpeed from './PlakaSpeed.tsx'
import PlakaTech from './PlakaTech.tsx'
import PlateScan from './PlateScan.tsx'
import { plakaCopy as copy } from './plakaCopy.ts'

/**
 * /plaka-tanima — amiral sayfa.
 * Okuma anı (sabit metin + kaydırmalı ParkingFlow) → alt gezinme → Başarı (koşullu plaka okuma) →
 * Hız (özellik kartları) → Teknoloji (gece tonu, sayaçlar) → Saha (donanım ve rehberler).
 */
export default function PlakaTanimaPage() {
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
    </>
  )
}
