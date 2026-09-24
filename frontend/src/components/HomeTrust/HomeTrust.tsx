import Section from '../Section/index.ts'
import TrustHeader from './TrustHeader.tsx'
import TrustLogos from './TrustLogos.tsx'
import TrustStats from './TrustStats.tsx'

const TITLE_ID = 'home-trust-title'

export default function HomeTrust() {
  return (
    <Section id="kurumsal" tone="paper" spacing="md" labelledBy={TITLE_ID}>
      <TrustHeader titleId={TITLE_ID} />
      <TrustStats />
      <TrustLogos />
    </Section>
  )
}
