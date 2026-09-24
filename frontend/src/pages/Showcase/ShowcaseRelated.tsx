import type { ReactNode } from 'react'
import FeatureGrid, { MapIcon, PhoneIcon, SettingsIcon, ShieldIcon } from '../../components/FeatureGrid/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { showcaseRelated } from './showcaseCopy.ts'
import type { ShowcaseRoute } from './showcaseCopy.ts'
import styles from './ShowcaseLayout.module.css'

const icons: Record<ShowcaseRoute, ReactNode> = {
  'kus-bakisi': <MapIcon />,
  'mobil-abonelik': <PhoneIcon />,
  'designer-tool': <SettingsIcon />,
  'low-confidence': <ShieldIcon />,
}

const order: ShowcaseRoute[] = ['kus-bakisi', 'designer-tool', 'low-confidence', 'mobil-abonelik']

export default function ShowcaseRelated({ current, tone }: { current: ShowcaseRoute; tone: 'paper' | 'surface' }) {
  const path = usePath()
  const headingId = `${current}-diger-vitrinler`

  const items = order
    .filter((route) => route !== current)
    .map((route) => ({
      icon: icons[route],
      title: showcaseRelated.items[route].title,
      description: showcaseRelated.items[route].description,
      meta: showcaseRelated.meta,
      to: path(route),
    }))

  return (
    <Section tone={tone} labelledBy={headingId}>
      <div className={styles.stack}>
        <SectionHeading id={headingId} eyebrow={showcaseRelated.eyebrow} title={showcaseRelated.title} />
        <FeatureGrid columns={3} items={items} label={showcaseRelated.title} />
      </div>
    </Section>
  )
}
