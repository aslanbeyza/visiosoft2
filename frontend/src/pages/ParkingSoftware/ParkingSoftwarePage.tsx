import Button from '../../components/Button/index.ts'
import CheckList from '../../components/CheckList/index.ts'
import CtaBand from '../../components/CtaBand/index.ts'
import Faq from '../../components/Faq/index.ts'
import FeatureGrid, { FeatureIcon } from '../../components/FeatureGrid/index.ts'
import Magnetic from '../../components/Magnetic/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import Reveal from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import Seo from '../../components/Seo/index.ts'
import SubNav from '../../components/SubNav/index.ts'
import TextReveal from '../../components/TextReveal/index.ts'
import { parkingSoftwareFaq } from '../../data/faqs/parking-software/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import EdgeDiagram from './EdgeDiagram.tsx'
import { parkingSoftwareCopy as copy } from './parkingSoftwareCopy.ts'
import PlatformMap from './PlatformMap.tsx'
import styles from './ParkingSoftwarePage.module.css'

export default function ParkingSoftwarePage() {
  const path = usePath()
  const faq = parkingSoftwareFaq()
  const features = copy.features.items.map((item) => ({
    icon: <FeatureIcon name={item.icon} />,
    title: item.title,
    description: item.description,
  }))

  return (
    <>
      <Seo title={copy.seoTitle} description={faq.meta_description} />

      <PageHero
        variant="centered"
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        lead={copy.hero.lead}
        spacing="compact"
        actions={
          <>
            <Magnetic>
              <Button to={path('quote.index')} size="lg" arrow>
                {copy.hero.primary}
              </Button>
            </Magnetic>
            <Button href="#sss" variant="secondary" size="lg">
              {copy.hero.secondary}
            </Button>
          </>
        }
      />

      <Section spacing="none" className={styles.stageSection} label={copy.hero.mapLabel}>
        <PlatformMap nodes={copy.features.items} alt={copy.hero.mapAlt} caption={copy.hero.mapCaption} />
      </Section>

      <SubNav items={copy.subNav} />

      <Section id="nedir" tone="surface" labelledBy="nedir-title">
        <div className={styles.explainer}>
          <div className={styles.explainerCopy}>
            <SectionHeading id="nedir-title" eyebrow={copy.explainer.eyebrow} title={copy.explainer.title} />
            <TextReveal as="p" mode="words" className={styles.statement} text={copy.explainer.paragraphs[0]} />
            <Reveal as="p" className={styles.body} delay={0.2}>
              {copy.explainer.paragraphs[1]}
            </Reveal>
          </div>
          <div className={styles.explainerList}>
            <Reveal as="p" className={styles.listLabel}>
              {copy.explainer.listLabel}
            </Reveal>
            <CheckList items={copy.explainer.list} label={copy.explainer.listLabel} />
          </div>
        </div>
      </Section>

      <Section id="ozellikler" labelledBy="ozellikler-title">
        <SectionHeading
          id="ozellikler-title"
          eyebrow={copy.features.eyebrow}
          title={copy.features.title}
          lead={copy.features.lead}
          className={styles.heading}
        />
        <FeatureGrid items={features} columns={3} label={copy.features.title} />
      </Section>

      <Section id="mimari" tone="night" labelledBy="mimari-title">
        <div className={styles.architecture}>
          <SectionHeading
            id="mimari-title"
            tone="dark"
            eyebrow={copy.architecture.eyebrow}
            title={copy.architecture.title}
            lead={copy.architecture.lead}
          />
          <CheckList items={copy.architecture.list} tone="dark" label={copy.architecture.listLabel} />
        </div>
        <div className={styles.diagram}>
          <EdgeDiagram
            label={copy.architecture.diagramLabel}
            nodes={copy.architecture.nodes}
            links={copy.architecture.links}
          />
        </div>
      </Section>

      <Section id="neden-visiosoft" tone="surface" labelledBy="neden-title">
        <SectionHeading id="neden-title" eyebrow={copy.reasons.eyebrow} title={copy.reasons.title} className={styles.heading} />
        <FeatureGrid items={copy.reasons.items} columns={4} variant="numbered" label={copy.reasons.title} />
      </Section>

      <Section id="sss" labelledBy="sss-title" width="content">
        <div className={styles.faq}>
          <SectionHeading id="sss-title" eyebrow={copy.faqEyebrow} title={faq.section_title} lead={faq.section_intro} />
          <Faq items={faq.items} schema label={copy.faqLabel} />
        </div>
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
