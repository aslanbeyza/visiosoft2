import { useId } from 'react'
import FeatureGrid from '../../components/FeatureGrid/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import type { ProductCopy } from '../HardwareProduct/products.ts'
import styles from './DetailSections.module.css'

type DetailFeaturesProps = {
  copy: ProductCopy
}

export default function DetailFeatures({ copy }: DetailFeaturesProps) {
  const titleId = useId()
  const items = copy.features.map((feature) => ({ title: feature.title, description: feature.desc }))

  return (
    <Section id="ozellikler" tone="paper" spacing="lg" labelledBy={titleId}>
      <SectionHeading eyebrow={copy.highlights_title} title={copy.highlights_desc} id={titleId} className={styles.compactHeading} />
      <div className={styles.body}>
        <FeatureGrid items={items} columns={4} variant="numbered" />
      </div>
    </Section>
  )
}
