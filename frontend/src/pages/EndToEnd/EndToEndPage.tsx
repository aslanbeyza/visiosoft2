import CtaBand from '../../components/CtaBand/index.ts'
import FeatureGrid, { FeatureIcon } from '../../components/FeatureGrid/index.ts'
import ParkingFlow, { parkingFlowSteps } from '../../components/ParkingFlow/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import Seo from '../../components/Seo/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import E2eHero from './E2eHero.tsx'
import { endToEndCopy as copy } from './endToEndCopy.ts'
import styles from './EndToEndPage.module.css'

/** /uctan-uca-sistem — hub & spoke hero, sahadaki geçiş akışı, avantajlar ve dönüşüm bandı. */
export default function EndToEndPage() {
  const path = usePath()

  return (
    <>
      <Seo title={copy.seo.title} description={copy.seo.description} />

      <E2eHero />

      <Section id="gecis-akisi" tone="night" spacing="lg" labelledBy="gecis-akisi-baslik">
        <div className={styles.stack}>
          <SectionHeading
            id="gecis-akisi-baslik"
            tone="dark"
            eyebrow={copy.flow.eyebrow}
            title={copy.flow.title}
            lead={copy.flow.lead}
          />
          <ParkingFlow
            steps={parkingFlowSteps}
            mode="auto"
            tone="dark"
            label={copy.flow.label}
            caption={copy.flow.caption}
          />
        </div>
      </Section>

      <Section id="neden-visiosoft" tone="surface" spacing="lg" labelledBy="neden-visiosoft-baslik">
        <div className={styles.stack}>
          <SectionHeading id="neden-visiosoft-baslik" eyebrow={copy.why.eyebrow} title={copy.why.title} />
          <FeatureGrid
            columns={3}
            label={copy.why.title}
            items={copy.why.items.map((item) => ({
              icon: <FeatureIcon name={item.icon} />,
              title: item.title,
              description: item.description,
            }))}
          />
        </div>
      </Section>

      <CtaBand
        eyebrow={copy.cta.eyebrow}
        title={copy.cta.title}
        description={copy.cta.description}
        primary={{ label: copy.hero.quote, to: path('quote.index') }}
        secondary={{ label: copy.hero.contact, to: path('contact') }}
      />
    </>
  )
}
