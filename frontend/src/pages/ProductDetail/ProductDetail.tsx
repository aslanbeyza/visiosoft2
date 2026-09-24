import Seo from '../../components/Seo/index.ts'
import { explodeVariantFor } from '../../components/KioskExplode/explodeVariants.ts'
import DetailDrawing from './DetailDrawing.tsx'
import DetailFeatures from './DetailFeatures.tsx'
import DetailHero from './DetailHero.tsx'
import DetailPlacement from './DetailPlacement.tsx'
import DetailProcess from './DetailProcess.tsx'
import DetailSpecs from './DetailSpecs.tsx'
import DetailZoom from './DetailZoom.tsx'
import KeyFigures from './KeyFigures.tsx'
import RelatedProducts from './RelatedProducts.tsx'
import { detailCopy } from './detailShared.ts'
import { productDetails } from './details/index.ts'
import type { ProductDetailSlug } from './details/index.ts'
import styles from './DetailPage.module.css'

export type ProductDetailProps = {
  slug: ProductDetailSlug
}

export default function ProductDetail({ slug }: ProductDetailProps) {
  const product = productDetails[slug]
  const { copy } = product
  const hasExplode = Boolean(explodeVariantFor(slug) ?? product.explode)
  const hasPhotoZoom = Boolean(product.zoom)

  return (
    <>
      <Seo title={product.seo.title} description={product.seo.description} />

      <div className={styles.page}>
        <DetailHero data={product} />

        <KeyFigures
          label={product.figures.label}
          items={product.figures.items}
          drawingLink={product.drawing ? detailCopy.figures.drawingLink : undefined}
          drawingId={product.drawing ? detailCopy.drawing.id : undefined}
        />

        {hasPhotoZoom && product.zoom ? (
          <div id="yakindan" className={styles.zoom}>
            <DetailZoom zoom={product.zoom} />
          </div>
        ) : null}

        {hasExplode ? null : <DetailFeatures copy={copy} />}
        {product.process ? <DetailProcess process={product.process} /> : null}
        {product.placement ? <DetailPlacement placement={product.placement} /> : null}
        {product.drawing ? <DetailDrawing drawing={product.drawing} name={copy.name} /> : null}
        <DetailSpecs copy={copy} />
        <RelatedProducts current={slug} />
      </div>
    </>
  )
}
