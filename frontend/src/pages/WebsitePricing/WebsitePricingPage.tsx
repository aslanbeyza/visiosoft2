import CtaBand from '../../components/CtaBand/index.ts'
import Faq from '../../components/Faq/index.ts'
import FeatureGrid, { FeatureIcon } from '../../components/FeatureGrid/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import Seo from '../../components/Seo/index.ts'
import StepList from '../../components/StepList/index.ts'
import SubNav from '../../components/SubNav/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import PricingHero from './PricingHero.tsx'
import PricingInfo from './PricingInfo.tsx'
import PricingSchema from './PricingSchema.tsx'
import { pricingCopy as copy } from './pricingCopy.ts'
import styles from './WebsitePricingPage.module.css'

const [features, onboarding, system, faq] = copy.subNav
const featureItems = copy.features.items.map(({ icon, ...item }) => ({ ...item, icon: <FeatureIcon name={icon} /> }))

/**
 * /site-fiyatlari — Site otopark yönetimi.
 * Açılış (site kesiti + fiyat kartı) → alt gezinme → Özellikler (kartlar) → Kurulum (kaydırmalı adımlar) →
 * Sistem nedir? (gece tonu, Prose) → SSS (akordeon + FAQPage şeması) → CtaBand. Service/Offer şeması ayrıca eklenir.
 */
export default function WebsitePricingPage() {
  const path = usePath()

  return (
    <>
      <Seo title={copy.seo.title} description={copy.seo.description} />
      <PricingSchema />
      <PricingHero />
      <SubNav items={copy.subNav} />

      <Section id={features.id} tone="surface" labelledBy={`${features.id}-baslik`}>
        <SectionHeading id={`${features.id}-baslik`} eyebrow={copy.features.eyebrow} title={copy.features.title} lead={copy.features.lead} />
        <FeatureGrid items={featureItems} columns={3} className={styles.block} />
      </Section>

      <Section id={onboarding.id} tone="paper" spacing="lg" labelledBy={`${onboarding.id}-baslik`}>
        <SectionHeading id={`${onboarding.id}-baslik`} eyebrow={copy.onboarding.eyebrow} title={copy.onboarding.title} lead={copy.onboarding.lead} />
        <StepList steps={copy.onboarding.steps} className={styles.block} label={copy.onboarding.eyebrow} />
      </Section>

      <Section id={system.id} tone="night" spacing="lg" label={system.label}>
        <PricingInfo />
      </Section>

      <Section id={faq.id} tone="paper" labelledBy={`${faq.id}-baslik`}>
        <div className={styles.faqGrid}>
          <SectionHeading id={`${faq.id}-baslik`} eyebrow={copy.faq.eyebrow} title={copy.faq.title} className={styles.faqHeading} />
          <Faq items={copy.faq.items} schema label={copy.faq.title} />
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
