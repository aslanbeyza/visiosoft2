import CtaBand from '../../components/CtaBand/index.ts'
import Seo from '../../components/Seo/index.ts'
import { company, phoneUrl, whatsappUrl } from '../../data/company.ts'
import { navCta } from '../../data/siteNav.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { PHONE_QUERY, useMediaQuery } from '../../hooks/useMediaQuery/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import ChannelTiles from './ChannelTiles.tsx'
import type { ChannelTile } from './ChannelTiles.tsx'
import CompanyFacts from './CompanyFacts.tsx'
import ContactLocations from './ContactLocations.tsx'
import GreetingHero from './GreetingHero.tsx'
import MeetingSection from './MeetingSection.tsx'
import { contactCopy as copy } from './contactCopy.ts'

/** Direct channels first (WhatsApp, dealer line, e-mail), then locations, company facts and the meeting calendar. No form: that lives on the quote page. */
export default function ContactPage() {
  const { config } = useLocale()
  const path = usePath()
  const channels = copy.channels
  const waId = config?.whatsapp_wa_id || company.whatsapp.waId
  const waDisplay = config?.whatsapp_display || company.whatsapp.display
  const calendlyUrl = config?.calendly_url || copy.meeting.fallbackUrl
  const isPhone = useMediaQuery(PHONE_QUERY)

  const tiles: ChannelTile[] = [
    // On phones the floating WhatsApp button is already on screen, so this tile calls the line instead.
    isPhone
      ? {
          key: 'whatsapp',
          icon: 'phone',
          eyebrow: channels.whatsapp.eyebrow,
          value: waDisplay,
          description: channels.whatsapp.description,
          action: channels.whatsapp.callAction,
          href: phoneUrl(waId),
        }
      : {
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
        aside={<ChannelTiles id={channels.id} tiles={tiles} label={channels.label} newTab={channels.newTab} />}
      />

      <ContactLocations id={copy.locations.id} />
      <CompanyFacts id={copy.corporate.id} />
      <MeetingSection id={copy.meeting.id} calendlyUrl={calendlyUrl} />

      <CtaBand
        title={copy.cta.title}
        description={copy.cta.description}
        primary={{ label: navCta.primary.label, to: path(navCta.primary.route) }}
        secondary={{ label: navCta.quickQuote.label, to: path(navCta.quickQuote.route) }}
      />
    </>
  )
}
