import { Component, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useProgress } from '@react-three/drei'
import { useReducedMotion } from 'framer-motion'
import Dialog from '../../components/Dialog/index.ts'
import type { HardwareSlug } from '../HardwareProduct/products.ts'
import { productModelSrc } from './productModels.ts'
import { productViewerCopy as copy } from './productViewerCopy.ts'
import ProductViewerStage, { preloadProductModel } from './ProductViewerStage.tsx'
import styles from './ProductViewer.module.css'

type ProductViewerProps = {
  slug: HardwareSlug
  name: string

  fallback: ReactNode

  mode?: 'hero' | 'card'
}

type BoundaryProps = { children: ReactNode; fallback: ReactNode }
type BoundaryState = { failed: boolean }

class StageBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false }

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function LoadNote() {
  const { progress, active } = useProgress()
  if (!active || progress >= 100) return null
  return (
    <p className={styles.loading} role="status">
      {copy.loading}
    </p>
  )
}

function ViewerFrame({
  src,
  name,
  frameClass,
}: {
  src: string
  name: string
  frameClass: string
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const reduce = Boolean(useReducedMotion())
  const [onScreen, setOnScreen] = useState(true)

  useEffect(() => {
    const node = frameRef.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      rootMargin: '128px',
      threshold: 0.15,
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={frameRef} className={frameClass}>
      <p className="sr-only">{name}</p>
      <StageBoundary fallback={null}>
        <ProductViewerStage src={src} playing={onScreen} reduceMotion={reduce} />
        <LoadNote />
      </StageBoundary>
    </div>
  )
}

export default function ProductViewer({ slug, name, fallback, mode = 'card' }: ProductViewerProps) {
  const src = productModelSrc(slug)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    if (src) preloadProductModel(src)
  }, [src])

  if (!src) return fallback

  if (mode === 'hero') {
    return (
      <StageBoundary fallback={fallback}>
        <section className={styles.heroSection} aria-label={name}>
          <div className={styles.heroStage} aria-hidden="true">
            <ViewerFrame src={src} name={name} frameClass={styles.heroFrame} />
            <div className={styles.heroVignette} />
          </div>
          <div className={styles.heroFoot}>
            <p className={styles.heroName}>{name}</p>
            <p className={styles.heroHint}>{copy.hint}</p>
            <button type="button" className={styles.heroFullscreen} onClick={() => setFullscreen(true)}>
              {copy.fullscreen}
            </button>
          </div>
        </section>

        <Dialog
          open={fullscreen}
          onClose={() => setFullscreen(false)}
          title={copy.fullscreenTitle}
          description={copy.hint}
          size="full"
          flush
          hideHeader
          closeLabel={copy.close}
          bodyClassName={styles.modalBody}
        >
          <ViewerFrame src={src} name={name} frameClass={styles.frameTall} />
        </Dialog>
      </StageBoundary>
    )
  }

  return (
    <StageBoundary fallback={fallback}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <p className={styles.kicker}>{copy.kicker}</p>
            <p className={styles.title}>{copy.title}</p>
          </div>
          <button type="button" className={styles.fullscreen} onClick={() => setFullscreen(true)}>
            {copy.fullscreen}
          </button>
        </div>
        <ViewerFrame src={src} name={name} frameClass={styles.frame} />
        <p className={styles.hint}>{copy.hint}</p>
      </div>

      <Dialog
        open={fullscreen}
        onClose={() => setFullscreen(false)}
        title={copy.fullscreenTitle}
        description={copy.hint}
        size="full"
        flush
        hideHeader
        closeLabel={copy.close}
        bodyClassName={styles.modalBody}
      >
        <ViewerFrame src={src} name={name} frameClass={styles.frameTall} />
      </Dialog>
    </StageBoundary>
  )
}
