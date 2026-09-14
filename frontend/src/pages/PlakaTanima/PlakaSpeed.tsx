import FeatureGrid from '../../components/FeatureGrid/index.ts'
import type { FeatureItem } from '../../components/FeatureGrid/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import { plakaCopy } from './plakaCopy.ts'
import { ChipIcon, LeafIcon, SpeedIcon, WeatherIcon } from './plakaIcons.tsx'
import styles from './PlakaSpeed.module.css'

const copy = plakaCopy.speed
const icons = [<SpeedIcon key="hiz" />, <ChipIcon key="cip" />, <LeafIcon key="guc" />, <WeatherIcon key="hava" />]

/** Hız bölümü: solda sabit başlık, sağda 2×2 özellik kartları (bento). */
export default function PlakaSpeed() {
  const items: FeatureItem[] = copy.items.map((item, index) => ({ ...item, icon: icons[index] }))

  return (
    <Section id="hiz" tone="paper" labelledBy="hiz-baslik" innerClassName={styles.inner}>
      <div className={styles.head}>
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} id="hiz-baslik" />
      </div>
      <FeatureGrid items={items} columns={2} variant="card" label={copy.title} />
    </Section>
  )
}
