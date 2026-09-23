import Button from '../../components/Button/index.ts'
import CtaBand from '../../components/CtaBand/index.ts'
import FeatureGrid, { InvoiceIcon, KioskIcon, SupportIcon } from '../../components/FeatureGrid/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import Reveal from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import Seo from '../../components/Seo/index.ts'
import SubNav from '../../components/SubNav/index.ts'
import TextReveal from '../../components/TextReveal/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import AboutTeam from './AboutTeam.tsx'
import HeroPlan from './HeroPlan.tsx'
import { aboutPageCopy as copy } from './aboutPageCopy.ts'
import styles from './AboutPage.module.css'

const storyIcons = [<KioskIcon key="kiosk" />, <SupportIcon key="support" />, <InvoiceIcon key="invoice" />]
const [storyId, teamId] = copy.subNav.map((item) => item.id)

export default function AboutPage() {
  const path = usePath()

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} />

      <PageHero
        variant="split"
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        lead={copy.hero.lead}
        media={<HeroPlan />}
        mediaOrder="last"
        actions={
          <>
            <Button to={path('contact')} size="lg" arrow>
              {copy.hero.primary}
            </Button>
            <Button to={path('references')} variant="secondary" size="lg">
              {copy.hero.secondary}
            </Button>
          </>
        }
      />

      <SubNav items={copy.subNav} />

      <Section id={storyId} tone="surface" spacing="lg" labelledBy={`${storyId}-baslik`}>
        <div className={styles.storyHead}>
          <SectionHeading id={`${storyId}-baslik`} eyebrow={copy.story.eyebrow} title={copy.story.title} />
          <div className={styles.storyText}>
            <TextReveal as="p" mode="words" className={styles.statement} text={copy.story.statement} />
            <Reveal as="p" className={styles.body} delay={0.3} y={16}>
              {copy.story.lead}
            </Reveal>
          </div>
        </div>
        <FeatureGrid
          columns={3}
          label={copy.story.listLabel}
          items={copy.story.items.map((item, index) => ({ ...item, icon: storyIcons[index] }))}
        />
      </Section>

      <AboutTeam id={teamId} />

      <CtaBand
        title={copy.cta.title}
        description={copy.cta.description}
        primary={{ label: copy.cta.primary, to: path('contact') }}
        secondary={{ label: copy.cta.secondary, to: path('discovery.show') }}
      />
    </>
  )
}
