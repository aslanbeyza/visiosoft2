import CtaBand from '../../components/CtaBand/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import Seo from '../../components/Seo/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import BlogList from './BlogList.tsx'
import BlogMasthead from './BlogMasthead.tsx'
import { blogCopy as copy } from './blogCopy.ts'
import { useBlogIndex } from './useBlogIndex.ts'

/**
 * /blog — ortalanmış hero (başlık satırları + çizilen gazete künyesi, gerçek yazı sayısı) →
 * öne çıkan son yazı (görsel açılır) + kart ızgarası; iskelet / hata / boş durumları → CtaBand.
 */
export default function BlogIndexPage() {
  const path = usePath()
  const { state, retry } = useBlogIndex()

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} />
      <PageHero
        variant="centered"
        eyebrow={copy.eyebrow}
        title={[...copy.title]}
        lead={copy.lead}
        aside={<BlogMasthead state={state} />}
      />
      <BlogList state={state} retry={retry} />
      <CtaBand
        eyebrow={copy.cta.eyebrow}
        title={copy.cta.title}
        description={copy.cta.description}
        primary={{ label: copy.cta.primary, to: path('contact') }}
        secondary={{ label: copy.cta.secondary, to: path('quote.index') }}
      />
    </>
  )
}
