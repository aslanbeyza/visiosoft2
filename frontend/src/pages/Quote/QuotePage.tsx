import LeadForm, { LeadAside, LeadHero, LeadLayout, leadPageCopy } from '../../components/LeadForm/index.ts'
import Seo from '../../components/Seo/index.ts'
import { quoteCopy as copy } from './quoteCopy.ts'

/** /teklif-al — ortalanmış hero (talep rotası), form + sonraki adımlar paneli. */
export default function QuotePage() {
  return (
    <>
      <Seo title={copy.seo.title} description={copy.seo.description} />
      <LeadHero
        variant="quote"
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        lead={copy.hero.lead}
        route={{ label: copy.route.label, steps: [...copy.route.steps] }}
        jump={{ href: `#${copy.form.id}`, label: leadPageCopy.jumpLabel }}
      />
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
