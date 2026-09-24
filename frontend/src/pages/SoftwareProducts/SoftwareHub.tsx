import Button from '../../components/Button/index.ts'
import CtaBand from '../../components/CtaBand/index.ts'
import MediaFrame from '../../components/MediaFrame/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import Picture from '../../components/Picture/index.ts'
import ScrollStack from '../../components/ScrollStack/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import Seo from '../../components/Seo/index.ts'
import { navCta } from '../../data/siteNav.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import HubOnStreetSection from './HubOnStreetSection.tsx'
import MonitorSection from './MonitorSection.tsx'
import ParkBizPhoneStage from './ParkBizPhoneStage.tsx'
import { SolutionsHubSection } from './SoftwareHubSections.tsx'
import { ctaCopy, heroCopy, hubSeo, zoneCopy } from './softwareHubCopy.ts'
import styles from './SoftwareHub.module.css'

const zoneItems = zoneCopy.items.map((item) => ({
  id: item.id,
  eyebrow: item.eyebrow,
  title: item.title,
  description: item.description,
  bullets: item.bullets,
  media: (
    <MediaFrame caption={item.caption} parallax={2} radius="md">
      <Picture {...item.image} sizes="(min-width: 1024px) 38rem, 100vw" />
    </MediaFrame>
  ),
}))

export default function SoftwareHub() {
  const path = usePath()

  return (
    <>
      <Seo title={hubSeo.title} description={hubSeo.description} />

      <PageHero
        variant="split"
        tone="paper"
        spacing="compact"
        eyebrow={heroCopy.eyebrow}
        title={heroCopy.title}
        lead={heroCopy.lead}
        mediaOrder="last"
        mediaInteractive
        media={<ParkBizPhoneStage animateOnView={false} />}
        actions={
          <>
            <Button to={path(heroCopy.primary.route)} size="lg" arrow>
              {heroCopy.primary.label}
            </Button>
            <Button to={`${path('software-products')}#${heroCopy.secondary.anchor}`} variant="secondary" size="lg">
              {heroCopy.secondary.label}
            </Button>
          </>
        }
      />

      <HubOnStreetSection />

      <Section id="zone" tone="paper" spacing="lg" labelledBy="hub-zone-title">
        <SectionHeading
          eyebrow={zoneCopy.eyebrow}
          title={zoneCopy.title}
          lead={zoneCopy.lead}
          id="hub-zone-title"
          className={styles.sectionHeading}
        />
        <div className={styles.zoneStack}>
          <ScrollStack items={zoneItems} label={zoneCopy.listLabel} />
        </div>
      </Section>

      <MonitorSection />

      <SolutionsHubSection />

      <CtaBand
        eyebrow={ctaCopy.eyebrow}
        title={ctaCopy.title}
        description={ctaCopy.description}
        primary={{ label: navCta.primary.label, to: path(navCta.primary.route) }}
        secondary={{ label: navCta.quickQuote.label, to: path(navCta.quickQuote.route) }}
      />
    </>
  )
}
