import { useCallback, useId, useState } from 'react'
import Button from '../Button/index.ts'
import Section from '../Section/index.ts'
import SectionHeading from '../SectionHeading/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import FlagshipDetails from './FlagshipDetails.tsx'
import FlagshipStage from './FlagshipStage.tsx'
import FlagshipTabs from './FlagshipTabs.tsx'
import { flagships } from './flagships.ts'
import { homeFlagshipsCopy as text } from './homeFlagshipsCopy.ts'
import styles from './HomeFlagships.module.css'

/**
 * Ana sayfa donanım vitrini: başlık üründen ayrı, masaüstünde iki kolon, kaydırmayı ele geçirmez.
 */
export default function HomeFlagships() {
  const path = usePath()
  const base = useId()
  const [active, setActive] = useState(0)
  const count = flagships.length
  const tabId = useCallback((index: number) => `${base}-tab-${index}`, [base])
  const panelId = `${base}-panel`
  const step = useCallback((direction: 1 | -1) => setActive((current) => (current + direction + count) % count), [count])

  return (
    <Section id="donanim" tone="surface" spacing="lg" labelledBy="home-flagships-title">
      <SectionHeading eyebrow={text.eyebrow} title={text.title} lead={text.lead} id="home-flagships-title" />

      <div className={styles.showcase} role="region" aria-roledescription="carousel" aria-label={text.carouselLabel}>
        <div className={styles.stage} role="tabpanel" id={panelId} aria-labelledby={tabId(active)}>
          <FlagshipStage items={flagships} active={active} onStep={step} />
        </div>
        <div className={styles.details}>
          <FlagshipDetails items={flagships} active={active} />
        </div>
      </div>

      <div className={styles.tabs}>
        <FlagshipTabs items={flagships} active={active} onSelect={setActive} tabId={tabId} panelId={panelId} />
      </div>

      <div className={styles.footer}>
        <Button to={path('hardware-products')} variant="secondary" arrow>
          {text.all}
        </Button>
      </div>
    </Section>
  )
}
