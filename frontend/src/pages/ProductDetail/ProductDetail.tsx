import { useRef, useState } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import CtaBand from '../../components/CtaBand/index.ts'
import Seo from '../../components/Seo/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import DetailDrawing from './DetailDrawing.tsx'
import DetailFeatures from './DetailFeatures.tsx'
import DetailHero from './DetailHero.tsx'
import DetailPlacement from './DetailPlacement.tsx'
import DetailProcess from './DetailProcess.tsx'
import DetailSpecs from './DetailSpecs.tsx'
import DetailZoom from './DetailZoom.tsx'
import KeyFigures from './KeyFigures.tsx'
import ProductSwitcher from './ProductSwitcher.tsx'
import RelatedProducts from './RelatedProducts.tsx'
import { detailCopy } from './detailShared.ts'
import { productDetails } from './details/index.ts'
import type { ProductDetailSlug } from './details/index.ts'
import styles from './DetailPage.module.css'

export type ProductDetailProps = {
  slug: ProductDetailSlug
}

/** Donanım ürün detay sayfası; sekiz ürünün tamamı aynı şablonla, ürün verisine göre çizilir. */
export default function ProductDetail({ slug }: ProductDetailProps) {
  const path = usePath()
  const reduce = Boolean(useReducedMotion())
  const data = productDetails[slug]
  const { copy } = data
  const pinned = data.zoom?.kind === 'kiosk' || data.zoom?.kind === 'drawing'

  // Sabitlenmiş yakınlaşma ekranı kaplarken ürün çubuğu yukarı kayar (üst üste binmesin).
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
        <DetailHero data={data} />
        <ProductSwitcher current={slug} hidden={!reduce && pinned && zoomActive} />

        <KeyFigures
          label={data.figures.label}
          items={data.figures.items}
          drawingLink={data.drawing ? detailCopy.figures.drawingLink : undefined}
          drawingId={data.drawing ? detailCopy.drawing.id : undefined}
        />

        <div ref={zoomRef} id="yakindan" className={styles.zoom}>
          {data.zoom ? <DetailZoom zoom={data.zoom} /> : null}
        </div>

        <DetailFeatures copy={copy} />
        {data.process ? <DetailProcess process={data.process} /> : null}
        {data.placement ? <DetailPlacement placement={data.placement} /> : null}
        {data.drawing ? <DetailDrawing drawing={data.drawing} name={copy.name} /> : null}
        <DetailSpecs copy={copy} />
        <RelatedProducts current={slug} />
      </div>

      <CtaBand
        title={copy.cta_title}
        description={copy.cta_desc}
        primary={{ label: copy.get_quote, to: path('quote.index') }}
        secondary={{ label: copy.request_discovery, to: path('discovery.show') }}
      />
    </>
  )
}
