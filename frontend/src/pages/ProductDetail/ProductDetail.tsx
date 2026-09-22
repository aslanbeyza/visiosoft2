import { useRef, useState } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import CtaBand from '../../components/CtaBand/index.ts'
import KioskExplode from '../../components/KioskExplode/index.ts'
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
  const prefersReducedMotion = Boolean(useReducedMotion())
  const product = productDetails[slug]
  const { copy } = product
  const hasPinnedZoom = product.zoom?.kind === 'drawing' || Boolean(product.explode)
  const hasExplode = Boolean(product.explode)
  const hasPhotoZoom = Boolean(product.zoom)

  // Sabitlenmiş yakınlaşma veya patlatma ekranı kaplarken ürün çubuğu yukarı kayar (üst üste binmesin).
  const zoomRef = useRef<HTMLDivElement>(null)
  const explodeRef = useRef<HTMLDivElement>(null)
  const zoomActiveRef = useRef(false)
  const explodeActiveRef = useRef(false)
  const [zoomActive, setZoomActive] = useState(false)
  const [explodeActive, setExplodeActive] = useState(false)
  const { scrollYProgress } = useScroll({ target: zoomRef, offset: ['start 160px', 'end start'] })
  const { scrollYProgress: explodeProgress } = useScroll({ target: explodeRef, offset: ['start 160px', 'end start'] })
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const isZoomPinned = progress > 0 && progress < 1
    if (isZoomPinned !== zoomActiveRef.current) {
      zoomActiveRef.current = isZoomPinned
      setZoomActive(isZoomPinned)
    }
  })
  useMotionValueEvent(explodeProgress, 'change', (progress) => {
    const isExplodePinned = progress > 0 && progress < 1
    if (isExplodePinned !== explodeActiveRef.current) {
      explodeActiveRef.current = isExplodePinned
      setExplodeActive(isExplodePinned)
    }
  })
  const isSwitcherHidden = !prefersReducedMotion && hasPinnedZoom && (zoomActive || explodeActive)

  return (
    <>
      <Seo title={product.seo.title} description={product.seo.description} />

      <div className={styles.page}>
        <DetailHero data={product} />
        <ProductSwitcher current={slug} hidden={isSwitcherHidden} />

        <KeyFigures
          label={product.figures.label}
          items={product.figures.items}
          drawingLink={product.drawing ? detailCopy.figures.drawingLink : undefined}
          drawingId={product.drawing ? detailCopy.drawing.id : undefined}
        />

        {hasPhotoZoom && product.zoom ? (
          <div ref={zoomRef} id="yakindan" className={styles.zoom}>
            <DetailZoom zoom={product.zoom} />
          </div>
        ) : (
          <div ref={zoomRef} />
        )}

        {hasExplode ? (
          <div ref={explodeRef} className={styles.zoom}>
            <KioskExplode />
          </div>
        ) : (
          <div ref={explodeRef} />
        )}

        {hasExplode ? null : <DetailFeatures copy={copy} />}
        {product.process ? <DetailProcess process={product.process} /> : null}
        {product.placement ? <DetailPlacement placement={product.placement} /> : null}
        {product.drawing ? <DetailDrawing drawing={product.drawing} name={copy.name} /> : null}
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
