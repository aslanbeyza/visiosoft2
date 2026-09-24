import PageHero from '../../components/PageHero/index.ts'
import Seo from '../../components/Seo/index.ts'
import LegalBody from './LegalBody.tsx'
import LegalIndex from './LegalIndex.tsx'
import { legalPages } from './legalCopy.ts'
import { legalPageCopy as copy } from './legalPageCopy.ts'

export default function LegalPage({ routeName }: { routeName: string }) {
  const page = legalPages[routeName]
  if (!page) return null

  const lead = copy.leads[routeName] ?? page.description
  const headingCount = page.blocks.filter((block) => block.type === 'h2').length

  return (
    <>
      <Seo title={`${page.title} - Visiosoft`} description={lead} />
      <PageHero
        variant="centered"
        tone="surface"
        eyebrow={copy.eyebrow}
        title={page.title}
        lead={lead}
        aside={<LegalIndex active={routeName} headingCount={headingCount} />}
      />
      <LegalBody page={page} />
    </>
  )
}
