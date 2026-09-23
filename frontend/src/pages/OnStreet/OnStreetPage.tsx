import Button from '../../components/Button/index.ts'
import FeatureGrid, { FeatureIcon } from '../../components/FeatureGrid/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import Seo from '../../components/Seo/index.ts'
import StepList from '../../components/StepList/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { onStreetCopy as copy } from './onStreetCopy.ts'
import StreetScan from './StreetScan.tsx'
import styles from './OnStreetPage.module.css'

/** /yol-ustu-parklandirma — tarama anlı split hero, dört adımlı akış ve avantajlar. */
export default function OnStreetPage() {
  const path = usePath()

  return (
    <>
      <Seo title={copy.seo.title} description={copy.seo.description} />

      <PageHero
        variant="split"
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        lead={copy.hero.lead}
        mediaOrder="last"
        media={<StreetScan />}
        aside={<p className={styles.asideText}>{copy.hero.aside}</p>}
        actions={
          <>
            <Button to={path('contact')} size="lg" className={styles.heroPrimary}>
              {copy.hero.primary}
            </Button>
            <Button to={path('quote.index')} size="lg" variant="secondary" className={styles.heroSecondary}>
              {copy.hero.secondary}
            </Button>
          </>
        }
      />

      <Section id="nasil-calisir" tone="night" spacing="lg" labelledBy="nasil-calisir-baslik">
        <div className={styles.stack}>
          <SectionHeading
            id="nasil-calisir-baslik"
            tone="dark"
            eyebrow={copy.how.eyebrow}
            title={copy.how.title}
            lead={copy.how.lead}
          />
          <StepList
            tone="dark"
            label={copy.how.title}
            steps={copy.how.steps.map((step) => ({
              title: step.title,
              description: step.description,
              icon: <FeatureIcon name={step.icon} />,
            }))}
          />
        </div>
      </Section>

      <Section id="avantajlar" spacing="lg" labelledBy="avantajlar-baslik">
        <div className={styles.stack}>
          <SectionHeading id="avantajlar-baslik" eyebrow={copy.benefits.eyebrow} title={copy.benefits.title} />
          <FeatureGrid
            columns={3}
            label={copy.benefits.title}
            items={copy.benefits.items.map((item) => ({
              icon: <FeatureIcon name={item.icon} />,
              title: item.title,
              description: item.description,
            }))}
          />
        </div>
      </Section>
    </>
  )
}
