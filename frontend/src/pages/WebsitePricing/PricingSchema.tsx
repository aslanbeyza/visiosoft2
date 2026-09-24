import { useLocation } from 'react-router-dom'
import JsonLd from '../../components/JsonLd/index.ts'
import { SITE_URL } from '../../components/Seo/index.ts'
import { price, pricingCopy } from './pricingCopy.ts'

const copy = pricingCopy.schema

export default function PricingSchema() {
  const { pathname } = useLocation()
  const url = `${SITE_URL}${pathname.replace(/\/$/, '')}`

  return (
    <JsonLd
      id="pricing-service"
      data={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: copy.name,
        serviceType: copy.serviceType,
        provider: { '@type': 'Organization', name: 'Visiosoft', url: SITE_URL },
        areaServed: 'TR',
        description: copy.description,
        offers: {
          '@type': 'Offer',
          price: price.amount,
          priceCurrency: price.currency,
          availability: 'https://schema.org/InStock',
          url,
        },
      }}
    />
  )
}
