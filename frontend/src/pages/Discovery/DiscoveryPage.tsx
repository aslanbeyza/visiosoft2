import LeadForm, { LeadAside, LeadHero, LeadLayout, leadPageCopy } from '../../components/LeadForm/index.ts'
import Seo from '../../components/Seo/index.ts'
import { discoveryCopy as copy } from './discoveryCopy.ts'

/** /ucretsiz-kesif — ortalanmış hero (keşif rotası + ölçü çizgisi), adres alanlı form + sonraki adımlar. */
export default function DiscoveryPage() {
  return (
    <>
      <Seo title={copy.seo.title} description={copy.seo.description} />
      <LeadHero
        variant="discovery"
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
