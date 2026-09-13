import { useRef, useState } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import CtaBand from '../../components/CtaBand/index.ts'
import KioskZoom from '../../components/KioskZoom/index.ts'
import Seo from '../../components/Seo/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import FeatureList from './FeatureList.tsx'
import HowItWorks from './HowItWorks.tsx'
import KeyFigures from './KeyFigures.tsx'
import ProductHero from './ProductHero.tsx'
import ProductSwitcher from './ProductSwitcher.tsx'
import RelatedProducts from './RelatedProducts.tsx'
import SpecLists from './SpecLists.tsx'
import TechnicalDrawing from './TechnicalDrawing.tsx'
import { productDetails } from './productDetailCopy.ts'
import type { ProductDetailSlug } from './productDetailCopy.ts'
import styles from './ProductDetail.module.css'

export type ProductDetailProps = {
  slug: ProductDetailSlug
}

/** Kurumsal ürün detay sayfası. Bölümler ürün verisine göre çizilir; faz 2'de diğer donanımlar da buraya taşınır. */
export default function ProductDetail({ slug }: ProductDetailProps) {
  const path = usePath()
  const reduce = Boolean(useReducedMotion())
  const data = productDetails[slug]
  const { copy } = data

  // Sabitlenmiş yakınlaşma bölümü ekranın üst kısmını kaplarken ürün çubuğu gizlenir (üst üste binmesin).
  const zoomRef = useRef<HTMLDivElement>(null)
  const zoomActiveRef = useRef(false)
  const [zoomActive, setZoomActive] = useState(false)
  const { scrollYProgress } = useScroll({ target: zoomRef, offset: ['start 160px', 'end start'] })
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const next = latest > 0 && latest < 1
    if (next !== zoomActiveRef.current) {
      zoomActiveRef.current = next
      setZoomActive(next)
    }
  })

  return (
    <>
      <Seo title={data.seo.title} description={data.seo.description} />

      <div className={styles.page}>
        <ProductHero data={data} />
        <ProductSwitcher current={data.slug} hidden={!reduce && Boolean(data.zoom) && zoomActive} />

        <KeyFigures
          label={data.figures.label}
          items={data.figures.items}
          drawingLink={data.drawing ? data.figures.drawingLink : undefined}
          drawingId={data.drawing?.id}
        />

        <div ref={zoomRef} className={styles.zoom}>
          {data.zoom === 'kiosk' ? <KioskZoom tone="light" /> : null}
        </div>

        <FeatureList eyebrow={data.features.eyebrow} title={data.features.title} features={copy.features} />

        {data.process ? <HowItWorks process={data.process} /> : null}

        {data.drawing ? <TechnicalDrawing drawing={data.drawing} /> : null}

        <SpecLists
          summaryTitle={data.specs.summaryTitle}
          summary={copy.summary}
          useCasesTitle={data.specs.useCasesTitle}
          useCases={copy.use_cases}
        />

        <RelatedProducts current={data.slug} copy={data.related} />
      </div>

      <CtaBand
        title={data.cta.title}
        description={data.cta.description}
        primary={{ label: data.cta.primary, to: path('quote.index') }}
        secondary={{ label: data.cta.secondary, to: path('discovery.show') }}
      />
    </>
  )
}
