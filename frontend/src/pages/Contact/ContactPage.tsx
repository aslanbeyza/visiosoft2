import LeadForm, { LeadAside, LeadLayout } from '../../components/LeadForm/index.ts'
import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import CompanyFacts from './CompanyFacts.tsx'
import MeetingSection from './MeetingSection.tsx'
import { contactCopy as copy } from './contactCopy.ts'

export default function ContactPage() {
  const { config } = useLocale()
  const calendlyUrl = config?.calendly_url || copy.meeting.fallbackUrl

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} />

      <LeadLayout
        id={copy.form.id}
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

      <CompanyFacts id={copy.corporate.id} />

      <MeetingSection id={copy.meeting.id} calendlyUrl={calendlyUrl} />
    </>
  )
}
