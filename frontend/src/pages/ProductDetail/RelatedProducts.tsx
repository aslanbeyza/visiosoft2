import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Button from '../../components/Button/index.ts'
import Picture from '../../components/Picture/index.ts'
import { RevealGroup, RevealItem, revealEase } from '../../components/Reveal/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import type { HardwareSlug } from '../HardwareProduct/products.ts'
import LedPanelFigure from './LedPanelFigure.tsx'
import { detailCopy, relatedProductsFor } from './detailShared.ts'
import styles from './RelatedProducts.module.css'

type RelatedProductsProps = {
  current: HardwareSlug
  copy?: typeof detailCopy.related
}

type Edges = { atStart: boolean; atEnd: boolean }

export default function RelatedProducts({ current, copy = detailCopy.related }: RelatedProductsProps) {
  const path = usePath()
  const reduce = Boolean(useReducedMotion())
  const titleId = useId()
  const railId = useId()
  const railRef = useRef<HTMLDivElement>(null)
  const edgesRef = useRef<Edges>({ atStart: true, atEnd: false })
  const [edges, setEdges] = useState<Edges>({ atStart: true, atEnd: false })
  const items = relatedProductsFor(current)

  const updateEdges = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    const max = rail.scrollWidth - rail.clientWidth
    const next = { atStart: rail.scrollLeft <= 4, atEnd: max - rail.scrollLeft <= 4 }
    if (next.atStart !== edgesRef.current.atStart || next.atEnd !== edgesRef.current.atEnd) {
      edgesRef.current = next
      setEdges(next)
    }
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    const observer = new ResizeObserver(updateEdges)
    observer.observe(rail)
    return () => observer.disconnect()
  }, [updateEdges])

  const scrollByPage = (direction: -1 | 1) => {

    if ((direction < 0 && edgesRef.current.atStart) || (direction > 0 && edgesRef.current.atEnd)) return
    const rail = railRef.current
    const card = rail?.querySelector<HTMLElement>('li')
    if (!rail || !card) return
    const gap = Number.parseFloat(getComputedStyle(card.parentElement ?? rail).columnGap) || 0
    const step = card.offsetWidth + gap
    const perPage = Math.max(1, Math.floor((rail.clientWidth + gap) / step))
    rail.scrollBy({ left: direction * step * perPage, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <div className={styles.header}>
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} id={titleId} />
        <div className={styles.controls}>
          <div className={styles.arrows}>
            <button
              type="button"
              className={styles.arrowButton}
              onClick={() => scrollByPage(-1)}
              aria-disabled={edges.atStart}
              aria-controls={railId}
              aria-label={copy.prevLabel}
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              type="button"
              className={styles.arrowButton}
              onClick={() => scrollByPage(1)}
              aria-disabled={edges.atEnd}
              aria-controls={railId}
              aria-label={copy.nextLabel}
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
          <Button to={path(copy.allRoute)} variant="secondary" arrow>
            {copy.allLabel}
          </Button>
        </div>
      </div>

      <div ref={railRef} id={railId} className={styles.rail} onScroll={updateEdges}>
        <RevealGroup as="ul" className={styles.track} stagger={0.08} amount={0.15}>
          {items.map((item) => (
            <RevealItem as="li" key={item.slug} className={styles.item}>
              <Link to={path(item.route)} className={styles.card}>
                <span className={styles.stage}>
                  <motion.span
                    className={styles.reveal}
                    variants={{
                      hidden: { clipPath: 'inset(0% 0% 100% 0%)' },
                      show: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1, ease: revealEase } },
                    }}
                  >
                    {item.image ? (
                      <Picture
                        src={item.image.src}
                        avif={item.image.avif}
                        alt=""
                        width={item.image.width}
                        height={item.image.height}
                        className={styles.image}
                        pictureClassName={styles.picture}
                      />
                    ) : (
                      <LedPanelFigure alt="" reduce decorative className={styles.illustration} />
                    )}
                  </motion.span>
                </span>
                <span className={styles.body}>
                  <span className={styles.tag}>{item.tag}</span>
                  <h3 className={styles.name}>{item.label}</h3>
                  <span className={styles.desc}>{item.description}</span>
                  <span className={styles.more} aria-hidden="true">
                    {copy.cardAction}
                    <ArrowIcon direction="right" />
                  </span>
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" className={styles.arrowIcon} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={direction === 'right' ? 'M5 12h14M13 6l6 6-6 6' : 'M19 12H5M11 6l-6 6 6 6'} />
    </svg>
  )
}
