import LeadForm, { LeadAside, LeadLayout } from '../../components/LeadForm/index.ts'
import Seo from '../../components/Seo/index.ts'
import { discoveryCopy as copy } from './discoveryCopy.ts'

/** /ucretsiz-kesif — adres alanlı form + sonraki adımlar. */
export default function DiscoveryPage() {
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
          kind="discovery"
          extraFields="address"
          label={copy.form.title}
          submitLabel={copy.form.submit}
          successTitle={copy.form.successTitle}
          successBody={copy.form.successBody}
          messageExample={copy.form.messageExample}
        />
      </LeadLayout>
    </>
  )
}
