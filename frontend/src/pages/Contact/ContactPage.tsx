import CtaBand from '../../components/CtaBand/index.ts'
import IframeEmbed from '../../components/IframeEmbed/index.ts'
import Reveal from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import Seo from '../../components/Seo/index.ts'
import SubNav from '../../components/SubNav/index.ts'
import { company, whatsappUrl } from '../../data/company.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import ChannelTiles from './ChannelTiles.tsx'
import type { ChannelTile } from './ChannelTiles.tsx'
import CompanyFacts from './CompanyFacts.tsx'
import ContactLocations from './ContactLocations.tsx'
import GreetingHero from './GreetingHero.tsx'
import { contactCopy as copy } from './contactCopy.ts'
import styles from './ContactPage.module.css'

const [channelsId, locationsId, factsId, meetingId] = copy.subNav.map((item) => item.id)

export default function ContactPage() {
  const { config } = useLocale()
  const path = usePath()
  const channels = copy.channels
  const waId = config?.whatsapp_wa_id || company.whatsapp.waId
  const waDisplay = config?.whatsapp_display || company.whatsapp.display
  const calendlyUrl = config?.calendly_url || copy.meeting.fallbackUrl

  const tiles: ChannelTile[] = [
    {
      key: 'whatsapp',
      icon: 'whatsapp',
      eyebrow: channels.whatsapp.eyebrow,
      value: waDisplay,
      description: channels.whatsapp.description,
      action: channels.whatsapp.action,
      href: whatsappUrl(waId),
      external: true,
    },
    {
      key: 'dealer',
      icon: 'phone',
      eyebrow: channels.dealer.eyebrow,
      value: channels.dealer.name,
      detail: channels.dealer.phoneDisplay,
      description: channels.dealer.description,
      action: channels.dealer.action,
      href: channels.dealer.phoneHref,
    },
    {
      key: 'email',
      icon: 'mail',
      eyebrow: channels.email.eyebrow,
      value: company.email,
      description: channels.email.description,
      action: channels.email.action,
      href: `mailto:${company.email}`,
    },
  ]

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} />

      <GreetingHero
        eyebrow={copy.hero.eyebrow}
        srTitle={copy.hero.srTitle}
        greetings={copy.hero.greetings}
        lead={copy.hero.lead}
        pauseLabel={copy.hero.pause}
        playLabel={copy.hero.play}
        aside={<ChannelTiles id={channelsId} tiles={tiles} label={channels.label} newTab={channels.newTab} />}
      />

      <SubNav items={copy.subNav} />

      <ContactLocations id={locationsId} />
      <CompanyFacts id={factsId} />

      <Section id={meetingId} tone="surface" spacing="lg" labelledBy={`${meetingId}-baslik`}>
        <div className={styles.meeting}>
          <div className={styles.meetingCopy}>
            <SectionHeading id={`${meetingId}-baslik`} eyebrow={copy.meeting.eyebrow} title={copy.meeting.title} lead={copy.meeting.lead} />
            <Reveal as="p" className={styles.note} delay={0.2} y={16}>
              {copy.meeting.note}
            </Reveal>
          </div>
          <Reveal className={styles.embed} delay={0.1} y={32}>
            <IframeEmbed
              src={calendlyUrl}
              title={copy.meeting.embedTitle}
              description={copy.meeting.embedDescription}
              height="46rem"
              fallbackHref={calendlyUrl}
              fallbackLabel={copy.meeting.open}
            />
          </Reveal>
        </div>
      </Section>

      <CtaBand
        title={copy.cta.title}
        description={copy.cta.description}
        primary={{ label: copy.cta.primary, to: path('discovery.show') }}
        secondary={{ label: copy.cta.secondary, to: path('quote.index') }}
      />
    </>
  )
}
