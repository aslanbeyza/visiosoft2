import Button from '../../components/Button/index.ts'
import ComparisonTable from '../../components/ComparisonTable/index.ts'
import CtaBand from '../../components/CtaBand/index.ts'
import FeatureGrid, { FeatureIcon } from '../../components/FeatureGrid/index.ts'
import Magnetic from '../../components/Magnetic/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import Seo from '../../components/Seo/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { comparisonCopy as copy } from './comparisonCopy.ts'
import ContrastCards from './ContrastCards.tsx'
import RemoteView from './RemoteView.tsx'
import styles from './ComparisonPage.module.css'

export default function ComparisonPage() {
  const path = usePath()
  const infra = copy.infra.items.map((item) => ({
    icon: <FeatureIcon name={item.icon} />,
    title: item.title,
    description: item.description,
  }))

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} />

      <PageHero
        variant="split"
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        lead={copy.hero.lead}
        mediaOrder="last"
        className={styles.hero}
        media={<RemoteView />}
        mediaNote={copy.scene.note}
        actions={
          <>
            <Magnetic>
              <Button to={path('discovery.show')} size="lg" arrow>
                {copy.hero.primary}
              </Button>
            </Magnetic>
            <Button href="#karsilastirma" variant="secondary" size="lg">
              {copy.hero.secondary}
            </Button>
          </>
        }
      />

      <Section id="yaklasimlar" tone="surface" labelledBy="yaklasimlar-title">
        <SectionHeading
          id="yaklasimlar-title"
          eyebrow={copy.contrast.eyebrow}
          title={copy.contrast.title}
          className={styles.heading}
        />
        <ContrastCards />
      </Section>

      <Section id="karsilastirma" labelledBy="karsilastirma-title" width="content">
        <SectionHeading
          id="karsilastirma-title"
          eyebrow={copy.table.eyebrow}
          title={copy.table.title}
          lead={copy.table.lead}
          className={styles.heading}
        />
        <ComparisonTable caption={copy.table.caption} columns={copy.table.columns} rows={copy.table.rows} />
      </Section>

      <Section id="altyapi" tone="surface" labelledBy="altyapi-title">
        <div className={styles.infra}>
          <SectionHeading id="altyapi-title" eyebrow={copy.infra.eyebrow} title={copy.infra.title} lead={copy.infra.lead} />
          <FeatureGrid items={infra} columns={2} variant="numbered" label={copy.infra.title} />
        </div>
      </Section>

      <CtaBand
        eyebrow={copy.cta.eyebrow}
        title={copy.cta.title}
        description={copy.cta.description}
        primary={{ label: copy.cta.primary, to: path('discovery.show') }}
        secondary={{ label: copy.cta.secondary, to: path('contact') }}
      />
    </>
  )
}
