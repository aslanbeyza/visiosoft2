import Section from '../Section/index.ts'
import TrustHeader from './TrustHeader.tsx'
import TrustLogos from './TrustLogos.tsx'
import TrustStats from './TrustStats.tsx'

const TITLE_ID = 'home-trust-title'

/**
 * Ana sayfa 4.2 Kurumsal: başlık + açıklama + üç ilke, kaynaklı dört istatistik ve seçili 12 referans logosu.
 * Tek, sakin bir sıra: başlık satırları yükselir → ilkeler sırayla → istatistik çizgileri çizilir ve bir kez sayar →
 * logolar dalga halinde belirir. Her parça kendi görünümüyle bir kez tetiklenir; hareket azaltmada son hâl gösterilir.
 */
export default function HomeTrust() {
  return (
    <Section id="kurumsal" tone="paper" spacing="md" labelledBy={TITLE_ID}>
      <TrustHeader titleId={TITLE_ID} />
      <TrustStats />
      <TrustLogos />
    </Section>
  )
}
