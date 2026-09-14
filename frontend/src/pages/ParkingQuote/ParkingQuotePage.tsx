import Button from '../../components/Button/index.ts'
import ChipList from '../../components/ChipList/index.ts'
import Magnetic from '../../components/Magnetic/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import Section from '../../components/Section/index.ts'
import Seo from '../../components/Seo/index.ts'
import HeroRules from './HeroRules.tsx'
import { quoteCopy } from './quoteCopy.ts'
import QuoteWizard from './QuoteWizard.tsx'

const WIZARD_ID = 'teklif-sihirbazi'

/** /otopark-teklif-motoru — kural kompozisyonlu hero + 3 adımlı sihirbaz ve canlı paket paneli. */
export default function ParkingQuotePage() {
  const { meta, hero } = quoteCopy

  return (
    <>
      <Seo title={meta.title} description={meta.description} />
      <PageHero
        variant="split"
        eyebrow={hero.eyebrow}
        title={hero.title}
        lead={hero.lead}
        aside={<ChipList items={[...hero.chips]} label={hero.rulesLabel} />}
        actions={
          <Magnetic>
            <Button href={`#${WIZARD_ID}`} size="lg" arrow>
              {hero.start}
            </Button>
          </Magnetic>
        }
        media={<HeroRules />}
        mediaOrder="last"
      />
      <Section id={WIZARD_ID} tone="surface" spacing="md" width="wide" label={quoteCopy.wizardLabel}>
        <QuoteWizard />
      </Section>
    </>
  )
}
