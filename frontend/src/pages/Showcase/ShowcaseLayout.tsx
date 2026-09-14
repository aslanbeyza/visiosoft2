import type { ReactNode } from 'react'
import Button from '../../components/Button/index.ts'
import CtaBand from '../../components/CtaBand/index.ts'
import Magnetic from '../../components/Magnetic/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import Seo from '../../components/Seo/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import ShowcaseRelated from './ShowcaseRelated.tsx'
import { showcaseCopy, showcaseShared } from './showcaseCopy.ts'
import type { ShowcaseRoute } from './showcaseCopy.ts'

type ShowcaseLayoutProps = {
  route: ShowcaseRoute
  /** CtaBand'dan önceki "diğer vitrinler" bölümünün zemini; bir önceki bölümle ton ritmini korur. */
  relatedTone: 'paper' | 'surface'
  children: ReactNode
}

/** Vitrin sayfalarının ortak iskeleti: SEO, ortalanmış hero, sayfaya özel bölümler, diğer vitrinler ve dönüşüm bandı. */
export default function ShowcaseLayout({ route, relatedTone, children }: ShowcaseLayoutProps) {
  const path = usePath()
  const copy = showcaseCopy[route]
  const band = copy.ctaBand

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} ogImage={copy.ogImage} />
      <PageHero
        variant="centered"
        tone="paper"
        eyebrow={copy.eyebrow}
        title={copy.title}
        lead={copy.lead}
        breadcrumbs={[
          { label: showcaseShared.home, to: path('home') },
          { label: showcaseShared.software, to: path('software-products') },
          { label: copy.title },
        ]}
        actions={
          <>
            <Magnetic>
              <Button to={path(copy.ctaRoute)} size="lg" arrow>
                {copy.cta}
              </Button>
            </Magnetic>
            <Button href={`#${copy.jump.id}`} variant="secondary" size="lg">
              {copy.jump.label}
            </Button>
          </>
        }
      />
      {children}
      <ShowcaseRelated current={route} tone={relatedTone} />
      <CtaBand
        eyebrow={band.eyebrow}
        title={band.title}
        description={band.description}
        primary={{ label: copy.cta, to: path(copy.ctaRoute) }}
        secondary={{ label: band.secondary.label, to: path(band.secondary.route) }}
      />
    </>
  )
}
