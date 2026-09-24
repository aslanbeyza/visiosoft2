import CheckList from '../../components/CheckList/index.ts'
import CtaBand from '../../components/CtaBand/index.ts'
import FeatureGrid, { FeatureIcon } from '../../components/FeatureGrid/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import Seo from '../../components/Seo/index.ts'
import StepList from '../../components/StepList/index.ts'
import SubNav from '../../components/SubNav/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import InvoiceFlow from './InvoiceFlow.tsx'
import ServicesHero from './ServicesHero.tsx'
import { servicesCopy as copy } from './servicesCopy.ts'
import StatusBoard from './StatusBoard.tsx'
import styles from './ServicesPage.module.css'

export default function ServicesPage() {
  const path = usePath()
  const steps = copy.discovery.steps.map((step) => ({
    icon: <FeatureIcon name={step.icon} />,
    title: step.title,
    description: step.description,
  }))

  const support = copy.support.items.map((item, index) => ({
    icon: <FeatureIcon name={item.icon} />,
    title: item.title,
    description: item.description,
    meta: item.meta,
    featured: index === 0,
  }))

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} />

      <ServicesHero />

      <SubNav items={copy.subNav} />

      <Section id="kesif-kurulum" tone="surface" labelledBy="kesif-kurulum-title">
        <SectionHeading
          id="kesif-kurulum-title"
          eyebrow={copy.discovery.eyebrow}
          title={copy.discovery.title}
          lead={copy.discovery.lead}
          className={styles.heading}
        />
        <StepList steps={steps} label={copy.discovery.label} />
      </Section>

      <Section id="destek" labelledBy="destek-title">
        <SectionHeading
          id="destek-title"
          eyebrow={copy.support.eyebrow}
          title={copy.support.title}
          lead={copy.support.lead}
          className={styles.heading}
        />
        <FeatureGrid items={support} columns={3} label={copy.support.label} />
      </Section>

      <Section id="uzaktan-izleme" tone="night" labelledBy="uzaktan-izleme-title">
        <div className={styles.split} data-layout="monitor">
          <div className={styles.copy}>
            <SectionHeading
              id="uzaktan-izleme-title"
              tone="dark"
              eyebrow={copy.monitoring.eyebrow}
              title={copy.monitoring.title}
              lead={copy.monitoring.lead}
            />
            <CheckList items={copy.monitoring.list} tone="dark" label={copy.monitoring.listLabel} />
          </div>
          <StatusBoard {...copy.monitoring.board} />
        </div>
      </Section>

      <Section id="muhasebe" tone="surface" labelledBy="muhasebe-title">
        <div className={styles.split} data-layout="accounting">
          <div className={styles.copy}>
            <SectionHeading
              id="muhasebe-title"
              eyebrow={copy.accounting.eyebrow}
              title={copy.accounting.title}
              lead={copy.accounting.lead}
            />
            <CheckList items={copy.accounting.list} columns={2} label={copy.accounting.listLabel} />
          </div>
          <InvoiceFlow label={copy.accounting.flowLabel} steps={copy.accounting.flow} />
        </div>
      </Section>

      <CtaBand
        eyebrow={copy.cta.eyebrow}
        title={copy.cta.title}
        description={copy.cta.description}
        primary={{ label: copy.cta.primary, to: path('contact') }}
        secondary={{ label: copy.cta.secondary, to: path('discovery.show') }}
      />
    </>
  )
}
