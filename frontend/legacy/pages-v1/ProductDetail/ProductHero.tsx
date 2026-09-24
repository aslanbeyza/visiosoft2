import { useId, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Button from '../../components/Button/index.ts'
import Picture from '../../components/Picture/index.ts'
import { RevealGroup, RevealItem, revealEase } from '../../components/Reveal/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import type { HeroDimensions, ProductDetailData } from './productDetailCopy.ts'
import styles from './ProductHero.module.css'

type ProductHeroProps = {
  data: ProductDetailData
}

export default function ProductHero({ data }: ProductHeroProps) {
  const path = usePath()
  const reduce = Boolean(useReducedMotion())
  const titleId = useId()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '6%'])
  const { copy, hero, breadcrumb } = data
  const { image } = hero

  return (
    <section ref={sectionRef} className={styles.hero} aria-labelledby={titleId}>
      <div className={styles.inner}>
        <RevealGroup className={styles.copy} stagger={0.08} amount={0.05}>
          <RevealItem y={16}>
            <nav aria-label="Sayfa konumu" className={styles.breadcrumb}>
              <ol>
                <li>
                  <Link to={path('home')}>{breadcrumb.home}</Link>
                  <Chevron />
                </li>
                <li>
                  <Link to={path(breadcrumb.categoryRoute)}>{breadcrumb.category}</Link>
                  <Chevron />
                </li>
                <li>
                  <span aria-current="page">{data.navLabel}</span>
                </li>
              </ol>
            </nav>
          </RevealItem>

          <RevealItem as="p" className={styles.eyebrow}>
            <motion.span
              className={styles.rule}
              aria-hidden="true"
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.35, ease: revealEase }}
            />
            {copy.eyebrow}
          </RevealItem>

          <RevealItem y={32}>
            <h1 id={titleId} className={styles.title}>
              {copy.name}
            </h1>
          </RevealItem>

          <RevealItem as="p" className={styles.lead}>
            {copy.lead}
          </RevealItem>

          <RevealItem>
            <dl className={styles.meta}>
              {copy.meta.map((item) => (
                <div key={item.label} className={styles.metaItem}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </RevealItem>

          <RevealItem className={styles.actions}>
            <Button to={path('discovery.show')} size="lg" arrow>
              {data.actions.discovery}
            </Button>
            <Button to={path('quote.index')} variant="secondary" size="lg">
              {data.actions.quote}
            </Button>
          </RevealItem>
        </RevealGroup>

        <div className={styles.visual}>
          <div className={styles.stage}>
            <motion.div className={styles.parallax} style={reduce ? undefined : { y: parallaxY }}>
              <div className={styles.box} style={{ aspectRatio: `${image.width} / ${image.height}` }}>
                <motion.span
                  className={styles.floor}
                  aria-hidden="true"
                  initial={reduce ? false : { opacity: 0, scaleX: 0.55 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 1.3, delay: 0.5, ease: revealEase }}
                />
                <motion.div
                  className={styles.product}
                  initial={reduce ? false : { y: 60, clipPath: 'inset(0% 0% 100% 0%)' }}
                  animate={{ y: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
                  transition={{ duration: 1.2, delay: 0.2, ease: revealEase }}
                >
                  <Picture
                    src={image.src}
                    avif={image.avif}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    loading="eager"
                    fetchPriority="high"
                    className={styles.image}
                    pictureClassName={styles.picture}
                  />
                </motion.div>
                {hero.dimensions ? <DimensionLines dimensions={hero.dimensions} reduce={reduce} /> : null}
              </div>
            </motion.div>
          </div>
          {hero.note ? <p className={styles.note}>{hero.note}</p> : null}
        </div>
      </div>
    </section>
  )
}

function Chevron() {
  return (
    <svg className={styles.chevron} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type Coord = number | string

type StrokeProps = {
  x1: Coord
  y1: Coord
  x2: Coord
  y2: Coord
  className: string
  reduce: boolean
  delay: number
  duration?: number
}

function Stroke({ reduce, delay, duration = 0.8, ...line }: StrokeProps) {
  return (
    <motion.line
      {...line}
      initial={reduce ? false : { pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ pathLength: { duration, delay, ease: revealEase }, opacity: { duration: 0.15, delay } }}
    />
  )
}

function Extension({ reduce, delay, ...line }: Omit<StrokeProps, 'duration'>) {
  return (
    <motion.line
      {...line}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay, ease: revealEase }}
    />
  )
}

const H_LINE = -26
const W_LINE = -22
const TICK = 7

function DimensionLines({ dimensions, reduce }: { dimensions: HeroDimensions; reduce: boolean }) {
  const { height, width } = dimensions
  const base = 1.25
  const pct = (value: number) => `${value}%`

  return (
    <>
      <svg className={styles.dims} aria-hidden="true" focusable="false">
        {}
        <Extension className={styles.extension} x1={H_LINE + TICK} y1={pct(height.span.from)} x2={pct(height.edges[0])} y2={pct(height.span.from)} reduce={reduce} delay={base} />
        <Extension className={styles.extension} x1={H_LINE + TICK} y1={pct(height.span.to)} x2={pct(height.edges[1])} y2={pct(height.span.to)} reduce={reduce} delay={base} />
        <Stroke className={styles.tick} x1={H_LINE - TICK} y1={pct(height.span.from)} x2={H_LINE + TICK} y2={pct(height.span.from)} reduce={reduce} delay={base + 0.1} duration={0.3} />
        <Stroke className={styles.line} x1={H_LINE} y1={pct(height.span.to)} x2={H_LINE} y2={pct(height.span.from)} reduce={reduce} delay={base + 0.15} duration={1} />
        <Stroke className={styles.tick} x1={H_LINE - TICK} y1={pct(height.span.to)} x2={H_LINE + TICK} y2={pct(height.span.to)} reduce={reduce} delay={base + 0.1} duration={0.3} />

        {}
        <Extension className={styles.extension} x1={pct(width.span.from)} y1={W_LINE + TICK} x2={pct(width.span.from)} y2={pct(width.edges[0])} reduce={reduce} delay={base + 0.55} />
        <Extension className={styles.extension} x1={pct(width.span.to)} y1={W_LINE + TICK} x2={pct(width.span.to)} y2={pct(width.edges[1])} reduce={reduce} delay={base + 0.55} />
        <Stroke className={styles.tick} x1={pct(width.span.from)} y1={W_LINE - TICK} x2={pct(width.span.from)} y2={W_LINE + TICK} reduce={reduce} delay={base + 0.6} duration={0.3} />
        <Stroke className={styles.line} x1={pct(width.span.from)} y1={W_LINE} x2={pct(width.span.to)} y2={W_LINE} reduce={reduce} delay={base + 0.65} duration={0.7} />
        <Stroke className={styles.tick} x1={pct(width.span.to)} y1={W_LINE - TICK} x2={pct(width.span.to)} y2={W_LINE + TICK} reduce={reduce} delay={base + 0.6} duration={0.3} />
      </svg>

      <motion.span
        className={styles.labelHeight}
        style={{ top: pct((height.span.from + height.span.to) / 2) }}
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: base + 0.9, ease: revealEase }}
      >
        {height.label}
      </motion.span>
      <motion.span
        className={styles.labelWidth}
        style={{ left: pct((width.span.from + width.span.to) / 2) }}
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: base + 1.2, ease: revealEase }}
      >
        {width.label}
      </motion.span>
    </>
  )
}
