import CtaBand from '../../components/CtaBand/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import Seo from '../../components/Seo/index.ts'
import StepList from '../../components/StepList/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import ViolationAudit from './ViolationAudit.tsx'
import ViolationBoard from './ViolationBoard.tsx'
import ViolationHero from './ViolationHero.tsx'
import { titleIds, violationsCopy as copy } from './violationsCopy.ts'
import styles from './ParkingViolationsPage.module.css'

/**
 * /isgaliye-ve-park-ceza — Akıllı Park Sistemi.
 * Açılış → İhlal panosu (kartlar + park planı, imza anı) → Denetim (fotoğraf + kazanımlar) → Süreç (adımlar) → CtaBand.
 */
export default function ParkingViolationsPage() {
  const path = usePath()

  return (
    <>
      <Seo title={copy.seo.title} description={copy.seo.description} />
      <ViolationHero />

      <Section id={copy.board.id} tone="surface" labelledBy={titleIds.board}>
        <SectionHeading id={titleIds.board} eyebrow={copy.board.eyebrow} title={copy.board.title} lead={copy.board.lead} />
        <ViolationBoard />
      </Section>

      <Section id={copy.audit.id} tone="paper" spacing="lg" labelledBy={titleIds.audit}>
        <ViolationAudit />
      </Section>

      <Section id={copy.process.id} tone="surface" labelledBy={titleIds.process}>
        <SectionHeading id={titleIds.process} eyebrow={copy.process.eyebrow} title={copy.process.title} />
        <StepList steps={copy.process.steps} className={styles.steps} label={copy.process.title} />
      </Section>

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
