import Button from '../../components/Button/index.ts'
import CtaBand from '../../components/CtaBand/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import Seo from '../../components/Seo/index.ts'
import StatRow from '../../components/StatRow/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import LogoDrift from './LogoDrift.tsx'
import ReferenceDirectory from './ReferenceDirectory.tsx'
import { referencesCopy as copy } from './referencesCopy.ts'
import { referenceItems, sectorCounts } from './sectors.ts'
import styles from './ReferencesPage.module.css'

export default function ReferencesPage() {
  const path = usePath()

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} />
      <PageHero
        variant="split"
        tone="paper"
        mediaOrder="last"
        breadcrumbs={[{ label: copy.breadcrumbs.home, to: path('home') }, { label: copy.breadcrumbs.current }]}
        eyebrow={copy.eyebrow}
        title={copy.title}
        lead={copy.lead}
        aside={
          <div className={styles.stats}>
            <StatRow
              columns={3}
              label={copy.stats.label}
              items={[
                { value: referenceItems.length, label: copy.stats.total },
                { value: sectorCounts.belediye, label: copy.stats.belediye },
                { value: sectorCounts['kurum-teknopark'], label: copy.stats.kurum },
              ]}
            />
          </div>
        }
        actions={
          <Button href={`#${copy.list.id}`} size="lg" arrow>
            {copy.jump}
          </Button>
        }
        media={<LogoDrift logos={referenceItems} toggleLabel={copy.drift.toggle} />}
      />

      <ReferenceDirectory />

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
