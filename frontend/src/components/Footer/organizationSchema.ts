import { company } from '../../data/company.ts'

const SITE_URL = 'https://visiosoft.com.tr'

/** Site-wide Organization structured data with every office address (keeps local SEO once addresses leave the footer). */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: company.legalName,
  url: SITE_URL,
  logo: `${SITE_URL}/img/visiosoft_logo.svg`,
  email: company.email,
  telephone: `+${company.whatsapp.waId}`,
  foundingDate: String(company.foundedYear),
  address: company.locations.map((location) => ({
    '@type': 'PostalAddress',
    name: location.label,
    streetAddress: location.address,
    addressLocality: 'İstanbul',
    addressCountry: 'TR',
  })),
}
