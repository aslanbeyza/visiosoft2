import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from '../../components/Button/index.ts'
import FeatureGrid, { CloudIcon, KioskIcon, MapIcon, SupportIcon } from '../../components/FeatureGrid/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import ParkingFlow from '../../components/ParkingFlow/index.ts'
import Reveal from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import Seo from '../../components/Seo/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { notFoundCopy as copy } from './notFoundCopy.ts'
import styles from './NotFoundPage.module.css'

const icons: Record<string, ReactNode> = {
  home: <MapIcon />,
  'hardware-products': <KioskIcon />,
  'software-products': <CloudIcon />,
  contact: <SupportIcon />,
}

function readablePath(pathname: string) {
  try {
    return decodeURIComponent(pathname)
  } catch {
    return pathname
  }
}

const LINKS_HEADING_ID = 'devam-baglantilari'

export default function NotFoundPage() {
  const path = usePath()
  const { pathname } = useLocation()
  const items = copy.links.map((link) => ({
    icon: icons[link.route],
    title: link.title,
    description: link.description,
    to: path(link.route),
  }))

  return (
    <>
      <Seo title={copy.seoTitle} noindex />
      <PageHero
        variant="split"
        tone="surface"
        eyebrow={copy.eyebrow}
        title={copy.title}
        lead={copy.lead}
        aside={
          <p className={styles.requested}>
            <span className={styles.requestedLabel}>{copy.requestedLabel}</span>
            <code className={styles.path}>{readablePath(pathname)}</code>
          </p>
        }
        actions={
          <>
            <Button to={path('home')} size="lg" arrow>
              {copy.home}
            </Button>
            <Button to={path('contact')} variant="secondary" size="lg">
              {copy.contact}
            </Button>
          </>
        }
        media={<ParkingFlow steps={copy.steps} mode="auto" barrier="closed" showLabels={false} label={copy.sceneLabel} />}
        mediaOrder="last"
      />

      <Section tone="paper" spacing="lg" width="wide" labelledBy={LINKS_HEADING_ID}>
        <div className={styles.links}>
          <SectionHeading id={LINKS_HEADING_ID} title={copy.linksTitle} />
          <FeatureGrid items={items} columns={4} />
          <Reveal as="p" className={styles.sitemap} y={12} amount={0.5}>
            {copy.sitemapPrompt} <Link to={path('sitemap')}>{copy.sitemapLink}</Link>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
