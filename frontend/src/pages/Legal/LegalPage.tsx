import PageHero from '../../components/PageHero/index.ts'
import Seo from '../../components/Seo/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import LegalBody from './LegalBody.tsx'
import { legalPages } from './legalCopy.ts'
import { legalPageCopy as copy } from './legalPageCopy.ts'

export default function LegalPage({ routeName }: { routeName: string }) {
  const path = usePath()
  const page = legalPages[routeName]
  if (!page) return null

  const lead = copy.leads[routeName] ?? page.description

  return (
    <>
      <Seo title={`${page.title} - Visiosoft`} description={lead} />
      <PageHero
        variant="centered"
        tone="surface"
        breadcrumbs={[{ label: copy.breadcrumbHome, to: path('home') }, { label: page.title }]}
        title={page.title}
        lead={lead}
      />
      <LegalBody page={page} />
    </>
  )
}
