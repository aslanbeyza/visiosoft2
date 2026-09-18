import CtaBand from '../../components/CtaBand/index.ts'
import LeadForm, { LeadAside, LeadLayout } from '../../components/LeadForm/index.ts'
import Seo from '../../components/Seo/index.ts'
import SubNav from '../../components/SubNav/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import CompanyFacts from './CompanyFacts.tsx'
import MeetingSection from './MeetingSection.tsx'
import { contactCopy as copy } from './contactCopy.ts'

const [formId, factsId, meetingId] = copy.subNav.map((item) => item.id)

/**
 * /iletisim — form ilk ekranda → yan panelde WhatsApp/e-posta →
 * şirket bilgileri → online görüşme → CtaBand.
 */
export default function ContactPage() {
  const { config } = useLocale()
  const path = usePath()
  const calendlyUrl = config?.calendly_url || copy.meeting.fallbackUrl

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} />

      <LeadLayout
        id={formId}
        eyebrow={copy.form.eyebrow}
        title={copy.form.title}
        lead={copy.form.lead}
        headingAs="h1"
        spacing="md"
        aside={<LeadAside steps={[...copy.steps]} showContactLink={false} whatsappValue="WhatsApp" />}
      >
        <LeadForm
          kind="contact"
          label={copy.form.title}
          submitLabel={copy.form.submit}
          successTitle={copy.form.successTitle}
          successBody={copy.form.successBody}
          messageExample={copy.form.messageExample}
        />
      </LeadLayout>

      <SubNav items={copy.subNav} />

      <CompanyFacts id={factsId} />

      <MeetingSection id={meetingId} calendlyUrl={calendlyUrl} />

      <CtaBand
        title={copy.cta.title}
        description={copy.cta.description}
        primary={{ label: copy.cta.primary, to: path('discovery.show') }}
        secondary={{ label: copy.cta.secondary, to: path('quote.index') }}
      />
    </>
  )
}
