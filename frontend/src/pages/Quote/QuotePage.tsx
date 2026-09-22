import LeadForm, { LeadAside, LeadLayout } from '../../components/LeadForm/index.ts'
import Seo from '../../components/Seo/index.ts'
import { quoteCopy as copy } from './quoteCopy.ts'

/** /teklif-al — form + sonraki adımlar paneli. */
export default function QuotePage() {
  return (
    <>
      <Seo title={copy.seo.title} description={copy.seo.description} />
      <LeadLayout
        id={copy.form.id}
        eyebrow={copy.form.eyebrow}
        title={copy.form.title}
        lead={copy.form.lead}
        aside={<LeadAside steps={[...copy.steps]} />}
      >
        <LeadForm
          kind="quote"
          label={copy.form.title}
          submitLabel={copy.form.submit}
          successTitle={copy.form.successTitle}
          messageExample={copy.form.messageExample}
        />
      </LeadLayout>
    </>
  )
}
