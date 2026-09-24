import FeatureGrid, { FeatureIcon } from '../../components/FeatureGrid/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import Seo from '../../components/Seo/index.ts'
import { comparisonCopy as copy } from './comparisonCopy.ts'
import CompareRows from './CompareRows.tsx'
import ContrastCards from './ContrastCards.tsx'
import RoiCalculator from './RoiCalculator.tsx'
import { roiCopy } from './roiCopy.ts'
import styles from './ComparisonPage.module.css'

/** Opens with the payback calculator (the question buyers ask first), then the contrast, the side-by-side questions and the infrastructure. */
export default function ComparisonPage() {
  const infra = copy.infra.items.map((item) => ({
    icon: <FeatureIcon name={item.icon} />,
    title: item.title,
    description: item.description,
  }))

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} />

      <Section id={roiCopy.id} labelledBy="amortisman-title" className={styles.first}>
        <SectionHeading id="amortisman-title" as="h1" title={roiCopy.title} className={styles.heading} />
        <RoiCalculator />
      </Section>

      <Section id="yaklasimlar" tone="surface" labelledBy="yaklasimlar-title">
        <SectionHeading
          id="yaklasimlar-title"
          eyebrow={copy.contrast.eyebrow}
          title={copy.contrast.title}
          className={styles.heading}
        />
        <ContrastCards />
      </Section>

      <Section id="karsilastirma" labelledBy="karsilastirma-title">
        <SectionHeading id="karsilastirma-title" title={copy.table.title} className={styles.heading} />
        <CompareRows />
      </Section>

      <Section id="altyapi" tone="surface" labelledBy="altyapi-title">
        <div className={styles.infra}>
          <SectionHeading id="altyapi-title" eyebrow={copy.infra.eyebrow} title={copy.infra.title} lead={copy.infra.lead} />
          <FeatureGrid items={infra} columns={2} variant="numbered" label={copy.infra.title} />
        </div>
      </Section>
    </>
  )
}
