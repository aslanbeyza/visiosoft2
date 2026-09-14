import PageHero from '../../components/PageHero/index.ts'
import Seo from '../../components/Seo/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import SitemapGroups from './SitemapGroups.tsx'
import SitemapTree from './SitemapTree.tsx'
import { sitemapCopy as copy, sitemapGroups } from './sitemapCopy.ts'

/**
 * /site-haritasi — ortalanmış hero + site ağacı (kökten dallar çizilir, düğümlerde gerçek sayfa sayıları) →
 * grup kartları (satırlar süpürme çizgisiyle belirir). Etiketler siteNav ve sayfaların kendi başlıklarından gelir.
 */
export default function SitemapPage() {
  const path = usePath()

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} />
      <PageHero
        variant="centered"
        eyebrow={copy.eyebrow}
        title={copy.title}
        lead={copy.lead}
        aside={<SitemapTree groups={sitemapGroups} homeTo={path('home')} />}
      />
      <SitemapGroups groups={sitemapGroups} />
    </>
  )
}
