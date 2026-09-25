import { useReducedMotion } from 'framer-motion'
import { useState, useTransition } from 'react'
import Seo from '../../components/Seo/index.ts'
import GalleryStage from './GalleryStage.tsx'
import { PointList, ProductList } from './ProductPicker.tsx'
import { galleryProducts, productGalleryCopy as copy, type GalleryProductId } from './productGalleryCopy.ts'
import styles from './ProductGallery.module.css'

const VIDEO = {
  desktop: '/video/gallery/gallery.mp4',
  mobile: '/video/gallery/gallery-mobile.mp4',
  poster: '/video/gallery/gallery-poster.webp',
}

export default function ProductGalleryPage() {
  const reduceMotion = Boolean(useReducedMotion())
  const [selectedId, setSelectedId] = useState<GalleryProductId>(galleryProducts[0].id)
  const [activePointId, setActivePointId] = useState<string | null>(null)
  // a transition keeps the current model on screen while the next one loads
  const [isSwitching, startSwitch] = useTransition()

  const selectedProduct = galleryProducts.find((product) => product.id === selectedId) ?? galleryProducts[0]

  const handleSelectProduct = (id: GalleryProductId) => {
    if (id === selectedId) return
    startSwitch(() => {
      setSelectedId(id)
      setActivePointId(null)
    })
  }

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} />
      <section className={styles.gallery} aria-labelledby="product-gallery-title">
        <video
          className={styles.video}
          autoPlay={!reduceMotion}
          muted
          loop
          playsInline
          preload={reduceMotion ? 'none' : 'auto'}
          poster={VIDEO.poster}
          aria-hidden="true"
        >
          <source src={VIDEO.mobile} type="video/mp4" media="(max-width: 767px)" />
          <source src={VIDEO.desktop} type="video/mp4" />
        </video>
        <div className={styles.shade} aria-hidden="true" />

        <h1 id="product-gallery-title" className="sr-only">
          {copy.heading}
        </h1>

        <div className={styles.layout}>
          <ProductList
            className={styles.products}
            products={galleryProducts}
            selectedId={selectedProduct.id}
            isLoading={isSwitching}
            onSelect={handleSelectProduct}
          />
          <div className={styles.stage}>
            <GalleryStage
              productId={selectedProduct.id}
              points={selectedProduct.points}
              activePointId={activePointId}
              reduceMotion={reduceMotion}
            />
          </div>
          <PointList className={styles.points} product={selectedProduct} activePointId={activePointId} onSelect={setActivePointId} />
        </div>
      </section>
    </>
  )
}
