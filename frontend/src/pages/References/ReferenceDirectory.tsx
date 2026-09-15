import { useState } from 'react'
import LogoWall from '../../components/LogoWall/index.ts'
import Reveal from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import { referencesCopy } from './referencesCopy.ts'
import { referenceItems, sectorCounts, sectorLabels, sectorOrder } from './sectors.ts'
import type { SectorKey } from './sectors.ts'
import styles from './ReferenceDirectory.module.css'

type Filter = SectorKey | 'all'

const copy = referencesCopy.list

const options: { key: Filter; label: string; count: number }[] = [
  { key: 'all', label: copy.all, count: referenceItems.length },
  ...sectorOrder.map((key) => ({ key, label: sectorLabels[key], count: sectorCounts[key] })),
]

/** Tüm referanslar: sektör süzgeci (aria-pressed düğmeler) ve adlarıyla logo ızgarası. */
export default function ReferenceDirectory() {
  const [filter, setFilter] = useState<Filter>('all')
  const [announcement, setAnnouncement] = useState('')

  const visible = filter === 'all' ? referenceItems : referenceItems.filter((item) => item.sector === filter)

  const select = (key: Filter, count: number) => {
    setFilter(key)
    // Yalnızca kullanıcı seçim yaptığında duyurulur
    setAnnouncement(copy.status(count))
  }

  return (
    <Section tone="surface" spacing="lg" id={copy.id} labelledBy={copy.headingId}>
      <div className={styles.root}>
        <div className={styles.head}>
          <SectionHeading id={copy.headingId} eyebrow={copy.eyebrow} title={copy.title} />
          <Reveal className={styles.filters} delay={0.15} y={16}>
            <div role="group" aria-label={copy.filterLabel} className={styles.group}>
              {options.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  className={styles.filter}
                  aria-pressed={filter === option.key}
                  onClick={() => select(option.key, option.count)}
                >
                  {option.label}
                  <span className={styles.count}>{option.count}</span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div>
          <LogoWall
            key={filter}
            variant="grid"
            showNames
            label={copy.wallLabel}
            logos={visible.map((item) => ({ src: item.url, alt: item.name, href: item.website ?? undefined }))}
            color
          />
        </div>

        <p className={styles.note}>{copy.note}</p>
        <p className={styles.srOnly} aria-live="polite">
          {announcement}
        </p>
      </div>
    </Section>
  )
}
