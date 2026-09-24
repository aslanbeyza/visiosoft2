import CtaBand from '../../components/CtaBand/index.ts'
import JsonLd from '../../components/JsonLd/index.ts'
import Seo, { SITE_URL } from '../../components/Seo/index.ts'
import { company } from '../../data/company.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import HgsParkHero from './HgsParkHero.tsx'
import { HgsParkAdvantages, HgsParkFuture, HgsParkScope } from './HgsParkSections.tsx'
import { hgsParkPageCopy as copy } from './hgsParkPageCopy.ts'

export default function HgsParkPage() {
  const path = usePath()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: copy.schema.name,
    serviceType: copy.schema.serviceType,
    areaServed: copy.schema.areaServed,
    description: copy.schema.description,
    url: `${SITE_URL}${path('hgs-park')}`,
    provider: { '@type': 'Organization', name: company.legalName, url: SITE_URL },
  }

  return (
    <>
      <Seo title={copy.seo.title} description={copy.seo.description} />
      <JsonLd id="hgs-park-schema" data={schema} />
      <HgsParkHero />
      <HgsParkFuture />
      <HgsParkScope />
      <HgsParkAdvantages />
      <CtaBand
        eyebrow={copy.cta.eyebrow}
        title={copy.cta.title}
        description={copy.cta.description}
        primary={{ label: copy.cta.primary, to: path('quote.index') }}
        secondary={{ label: copy.cta.secondary, to: path('contact') }}
      />
    </>
  )
}
