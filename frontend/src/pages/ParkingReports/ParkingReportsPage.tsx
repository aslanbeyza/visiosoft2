import Button from '../../components/Button/index.ts'
import ChipList from '../../components/ChipList/index.ts'
import CountUp from '../../components/CountUp/index.ts'
import DeviceFrame from '../../components/DeviceFrame/index.ts'
import Faq from '../../components/Faq/index.ts'
import FeatureGrid from '../../components/FeatureGrid/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import Reveal from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import Seo from '../../components/Seo/index.ts'
import { useMediaQuery } from '../../hooks/useMediaQuery/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import FinanceSummaryDemo from './FinanceSummaryDemo.tsx'
import ReportDeck from './ReportDeck.tsx'
import type { DeckCard } from './ReportDeck.tsx'
import { reportGroups } from './reportGroups.ts'
import { reportsCopy as copy } from './reportsCopy.ts'
import styles from './ParkingReportsPage.module.css'

const tones = ['paper', 'surface', 'paper'] as const

const totalReports = reportGroups.reduce((sum, group) => sum + group.items.length, 0)

const deckCards: DeckCard[] = [
  {
    key: copy.newReports.anchor,
    icon: 'settings',
    label: copy.newReports.eyebrow,
    short: copy.newReportsNav,
    badge: copy.newReports.formats.join(' · '),
    lines: copy.newReports.items.map((item) => item.title),
  },
  ...[...reportGroups].reverse().map((group) => ({
    key: group.anchor,
    icon: group.icon,
    label: group.label,
    short: group.short,
    badge: `${group.items.length} ${copy.hero.reportUnit}`,
    lines: group.items.slice(0, 3).map((item) => item.title),
  })),
]

export default function ParkingReportsPage() {
  const path = usePath()
  const onLaptop = useMediaQuery('(min-width: 1024px)')

  return (
    <>
      <Seo title={copy.seo.title} description={copy.seo.description} />

      <PageHero
        variant="split"
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        lead={copy.hero.lead}
        mediaOrder="last"
        aside={
          <ChipList
            items={[`${totalReports} ${copy.hero.reportUnit}`, ...copy.hero.highlights]}
            icon="dot"
            label={copy.hero.highlightsLabel}
          />
        }
        actions={
          <>
            <Button to={path('quote.index')} size="lg" arrow>
              {copy.hero.primary}
            </Button>
            <Button href={`#${reportGroups[0].anchor}`} variant="secondary" size="lg">
              {copy.hero.secondary}
            </Button>
          </>
        }
        media={<ReportDeck cards={deckCards} />}
      />

      {reportGroups.map((group, index) => (
        <Section key={group.anchor} id={group.anchor} tone={tones[index]} labelledBy={`${group.anchor}-title`}>
          <div className={styles.groupHead}>
            <SectionHeading id={`${group.anchor}-title`} eyebrow={group.label} title={group.headline} lead={group.summary} />
            <Reveal className={styles.count} delay={0.2}>
              <CountUp value={group.items.length} className={styles.countValue} />
              <span className={styles.countLabel}>{copy.hero.reportUnit}</span>
            </Reveal>
          </div>

          {group.anchor === 'finansal' ? (
            <div className={styles.finance}>
              {onLaptop ? (
                <DeviceFrame kind="laptop" className={styles.laptop}>
                  <div className={styles.laptopViewport}>
                    <FinanceSummaryDemo className={styles.inScreen} />
                  </div>
                </DeviceFrame>
              ) : (
                <FinanceSummaryDemo />
              )}
            </div>
          ) : null}

          <FeatureGrid items={group.items} columns={4} variant="numbered" label={group.label} />
        </Section>
      ))}

      <Section id={copy.newReports.anchor} tone="night" labelledBy="yeni-raporlar-title">
        <div className={styles.groupHead}>
          <SectionHeading id="yeni-raporlar-title" tone="dark" eyebrow={copy.newReports.eyebrow} title={copy.newReports.title} lead={copy.newReports.lead} />
          <div className={styles.formats}>
            <Reveal as="p" className={styles.formatsLabel}>
              {copy.newReports.formatsLabel}
            </Reveal>
            <ChipList items={copy.newReports.formats} tone="dark" label={copy.newReports.formatsLabel} />
          </div>
        </div>
        <FeatureGrid items={copy.newReports.items} columns={3} tone="dark" label={copy.newReports.eyebrow} />
      </Section>

      <Section id={copy.faq.anchor} tone="surface" width="content" labelledBy="sss-title">
        <div className={styles.faq}>
          <SectionHeading id="sss-title" eyebrow={copy.faq.eyebrow} title={copy.faq.title} />
          <Faq items={copy.faq.items} schema label={copy.faq.label} defaultOpen={0} />
        </div>
      </Section>
    </>
  )
}
