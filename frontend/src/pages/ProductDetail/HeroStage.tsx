import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Picture from '../../components/Picture/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import HeroDimensions from './HeroDimensions.tsx'
import LedPanelFigure from './LedPanelFigure.tsx'
import type { HeroDimensions as Dimensions, ProductDetailData } from './detailTypes.ts'
import styles from './HeroStage.module.css'

// LED görünüşü milimetre ölçekli çizildiği için ölçü çizgileri doğrudan kutu kenarlarına oturur.
const LED_DIMENSIONS: Dimensions = {
  height: { label: '1900 mm', span: { from: 0, to: 100 }, edges: [8, 30.8] },
  width: { label: '715 mm', span: { from: 0, to: 100 }, edges: [3, 3] },
}

const V_LINES = [1, 2, 3, 4, 5]
const H_LINES = [1, 2, 3]
const CORNERS = ['tl', 'tr', 'bl', 'br'] as const

const formatMm = (value: number) => value.toLocaleString('tr-TR', { useGrouping: false, maximumFractionDigits: 1 })

/** Paftadaki antet gibi: ürün adı ve ölçüler (yoksa kategori). */
function plateFor(data: ProductDetailData) {
  const pick = (id: string) => data.figures.items.find((item) => item.id === id)?.value
  const values = [pick('width'), pick('height'), pick('depth')].filter((value): value is number => value !== undefined)
  if (values.length === 3) return { label: 'Ölçüler (mm)', value: values.map(formatMm).join(' × ') }
  return { label: data.copy.meta[0]?.label ?? 'Kategori', value: data.copy.meta[0]?.value ?? data.copy.eyebrow }
}

type HeroStageProps = {
  data: ProductDetailData
  reduce: boolean
}

/**
 * Kahraman sahnesi: teknik pafta ızgarası çizilir, köşe işaretleri belirir, ürün zeminden yükselir,
 * ardından ölçü çizgileri ve antet gelir. Kaydırmada ürün ve ızgara farklı hızlarda kayar.
 */
export default function HeroStage({ data, reduce }: HeroStageProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start start', 'end start'] })
  const productY = useTransform(scrollYProgress, [0, 1], ['0%', '6%'])
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '-3%'])
  const { hero } = data
  const ratio = hero.kind === 'image' ? hero.image.width / hero.image.height : 715 / 1900
  const dimensions = hero.kind === 'image' ? hero.dimensions : LED_DIMENSIONS
  const plate = plateFor(data)
  const shape = ratio > 1.15 ? 'wide' : ratio > 0.8 ? 'square' : 'tall'
  const dimsMode = dimensions ? (dimensions.width ? 'both' : 'height') : 'none'

  return (
    <div className={styles.visual}>
      <div ref={stageRef} className={styles.stage} data-dims={dimsMode} data-shape={shape}>
        <motion.div className={styles.grid} style={reduce ? undefined : { y: gridY }} aria-hidden="true">
          {V_LINES.map((n) => (
            <motion.span
              key={`v${n}`}
              className={styles.vLine}
              style={{ left: `${(n * 100) / 6}%` }}
              initial={reduce ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.1, delay: 0.06 * n, ease: revealEase }}
            />
          ))}
          {H_LINES.map((n) => (
            <motion.span
              key={`h${n}`}
              className={styles.hLine}
              style={{ top: `${n * 25}%` }}
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, delay: 0.2 + 0.08 * n, ease: revealEase }}
            />
          ))}
          {CORNERS.map((corner, index) => (
            <motion.span
              key={corner}
              className={styles.corner}
              data-corner={corner}
              initial={reduce ? false : { opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.45 + index * 0.06, ease: revealEase }}
            />
          ))}
        </motion.div>

        <motion.div className={styles.parallax} style={reduce ? undefined : { y: productY }}>
          <div
            className={styles.box}
            style={{ '--ratio': ratio, '--base-gap': `${hero.kind === 'image' ? (hero.baseGap ?? 0) : 0}%` } as CSSProperties}
          >
            <motion.span
              className={styles.floor}
              aria-hidden="true"
              initial={reduce ? false : { opacity: 0, scaleX: 0.55 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1.3, delay: 0.5, ease: revealEase }}
            />
            <motion.span
              className={styles.floorLine}
              aria-hidden="true"
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: revealEase }}
            />
            <motion.div
              className={styles.product}
              initial={reduce ? false : { y: 60, clipPath: 'inset(0% 0% 100% 0%)' }}
              animate={{ y: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
              transition={{ duration: 1.2, delay: 0.2, ease: revealEase }}
            >
              {hero.kind === 'image' ? (
                <Picture
                  src={hero.image.src}
                  avif={hero.image.avif}
                  alt={hero.image.alt}
                  width={hero.image.width}
                  height={hero.image.height}
                  loading="eager"
                  fetchPriority="high"
                  className={styles.image}
                  pictureClassName={styles.picture}
                />
              ) : (
                <LedPanelFigure alt={hero.alt} reduce={reduce} className={styles.led} />
              )}
            </motion.div>
            {dimensions ? <HeroDimensions dimensions={dimensions} reduce={reduce} /> : null}
          </div>
        </motion.div>

        <motion.dl
          className={styles.plate}
          aria-hidden="true"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: revealEase }}
        >
          <div>
            <dt>Ürün</dt>
            <dd>{data.navLabel}</dd>
          </div>
          <div>
            <dt>{plate.label}</dt>
            <dd>{plate.value}</dd>
          </div>
        </motion.dl>
      </div>
      {hero.note ? <p className={styles.note}>{hero.note}</p> : null}
    </div>
  )
}
