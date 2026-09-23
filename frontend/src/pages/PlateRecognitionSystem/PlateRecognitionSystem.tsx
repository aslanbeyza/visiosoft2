import Button from '../../components/Button/index.ts'
import CtaBand from '../../components/CtaBand/index.ts'
import Faq from '../../components/Faq/index.ts'
import FeatureGrid, { FeatureIcon } from '../../components/FeatureGrid/index.ts'
import type { FeatureIconName } from '../../components/FeatureGrid/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import Prose from '../../components/Prose/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import Seo from '../../components/Seo/index.ts'
import StepList from '../../components/StepList/index.ts'
import SubNav from '../../components/SubNav/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import HeroMap from './HeroMap.tsx'
import PlateAnatomy from './PlateAnatomy.tsx'
import { prsCopy as copy } from './prsCopy.ts'
import styles from './PrsSections.module.css'

const stepIcons: FeatureIconName[] = ['camera', 'plate', 'settings', 'barrier']

/** /plaka-tanima-sistemi — eğitici çözüm sayfası. */
export default function PlateRecognitionSystem() {
  const path = usePath()

  return (
    <>
      <Seo title={copy.metaTitle} description={copy.metaDescription} />

      <PageHero
        variant="split"
        breadcrumbs={[{ label: copy.breadcrumbHome, to: path('home') }, { label: copy.title }]}
        eyebrow={copy.eyebrow}
        title={copy.title}
        lead={copy.lead}
        mediaOrder="last"
        media={<HeroMap />}
        actions={
          <div className={styles.actions}>
            <Button to={path('quote.index')} size="lg" arrow>
              {copy.quote}
            </Button>
            <Button to={path('contact')} size="lg" variant="secondary">
              {copy.contact}
            </Button>
          </div>
        }
      />

      <SubNav items={copy.subNav} />

      <Section id="nedir" tone="surface" spacing="lg" labelledBy="nedir-baslik">
        <div className={styles.split}>
          <div className={styles.copy}>
            <SectionHeading id="nedir-baslik" eyebrow={copy.about.eyebrow} title={copy.about.title} />
            <Prose size="lg">
              {copy.about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </Prose>
          </div>
          <PlateAnatomy />
        </div>
      </Section>

      <Section id="ozellikler" spacing="lg" labelledBy="ozellikler-baslik">
        <div className={styles.stack}>
          <SectionHeading
            id="ozellikler-baslik"
            eyebrow={copy.features.eyebrow}
            title={copy.features.title}
            lead={copy.features.lead}
          />
          <FeatureGrid
            columns={3}
            items={copy.features.items.map((item) => ({
              icon: <FeatureIcon name={item.icon} />,
              title: item.title,
              description: item.description,
            }))}
          />
        </div>
      </Section>

      <Section id="nasil-calisir" tone="night" spacing="lg" labelledBy="nasil-baslik">
        <div className={styles.stack}>
          <SectionHeading id="nasil-baslik" tone="dark" eyebrow={copy.how.eyebrow} title={copy.how.title} lead={copy.how.lead} />
          <StepList
            tone="dark"
            label={copy.how.title}
            steps={copy.how.steps.map((step, index) => ({ ...step, icon: <FeatureIcon name={stepIcons[index]} /> }))}
          />
        </div>
      </Section>

      <Section id="sss" spacing="lg" labelledBy="sss-baslik">
        <div className={styles.faqLayout}>
          <div className={styles.faqHead}>
            <SectionHeading id="sss-baslik" eyebrow={copy.faq.eyebrow} title={copy.faq.title} lead={copy.faq.lead} />
          </div>
          <Faq items={copy.faq.items} label={copy.faq.title} schema single />
        </div>
      </Section>

      <CtaBand
        eyebrow={copy.cta.eyebrow}
        title={copy.cta.title}
        description={copy.cta.description}
        primary={{ label: copy.quote, to: path('quote.index') }}
        secondary={{ label: copy.contact, to: path('contact') }}
      />
    </>
  )
}
