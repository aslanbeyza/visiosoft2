import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Button from '../../components/Button/index.ts'
import Picture from '../../components/Picture/index.ts'
import { RevealGroup, RevealItem } from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { categoryLabel, formatDimensions, hardwareItems } from './data.ts'
import type { HardwareItem } from './data.ts'
import { catalogTeaserCopy } from './listingCopy.ts'
import styles from './CatalogTeaser.module.css'

const HEADING_ID = 'katalog-baslik'
const pad = (value: number) => String(value).padStart(2, '0')
const sheetSlugs = ['visiobox', 'kiosk', 'kamera-muhafaza'] as const
const sheets = sheetSlugs.map((slug) => hardwareItems.find((item) => item.slug === slug)).filter((item): item is HardwareItem => Boolean(item))

function Sheet({ item }: { item: HardwareItem }) {
  const page = hardwareItems.indexOf(item) + 1
  return (
    <>
      <span className={styles.sheetHead}>
        <span>{catalogTeaserCopy.eyebrow}</span>
        <span>
          {pad(page)} / {pad(hardwareItems.length)}
        </span>
      </span>
      <span className={styles.sheetStage}>
        <Picture src={item.image.src} avif={item.image.avif} width={item.image.width} height={item.image.height} alt="" className={styles.sheetImage} />
      </span>
      <span className={styles.sheetEyebrow}>{categoryLabel(item.category)}</span>
      <span className={styles.sheetName}>{item.name}</span>
      {item.dimensions ? <span className={styles.sheetDims}>{formatDimensions(item.dimensions)}</span> : null}
      <span className={styles.sheetRows}>
        {item.features.map((feature) => (
          <span key={feature.title} className={styles.sheetRow}>
            {feature.title}
          </span>
        ))}
      </span>
    </>
  )
}

/** Katalog tanıtımı: gerçek katalog sayfalarından üçü kaydırdıkça yelpaze gibi açılır. */
export default function CatalogTeaser() {
  const reduce = useReducedMotion()
  const path = usePath()
  const stackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ['start end', 'center center'] })
  const fan = useTransform(scrollYProgress, [0.15, 1], [0, 1], { clamp: true })
  const leftRotate = useTransform(fan, [0, 1], [-1, -8])
  const leftX = useTransform(fan, [0, 1], ['-4%', '-34%'])
  const rightRotate = useTransform(fan, [0, 1], [1, 8])
  const rightX = useTransform(fan, [0, 1], ['4%', '34%'])
  const centerY = useTransform(fan, [0, 1], ['4%', '-3%'])

  const transforms = reduce
    ? [{ rotate: -8, x: '-34%' }, { y: '-3%' }, { rotate: 8, x: '34%' }]
    : [{ rotate: leftRotate, x: leftX }, { y: centerY }, { rotate: rightRotate, x: rightX }]

  return (
    <Section id="katalog" tone="surface" labelledBy={HEADING_ID}>
      <div className={styles.layout}>
        <RevealGroup className={styles.copy}>
          <SectionHeading id={HEADING_ID} eyebrow={catalogTeaserCopy.eyebrow} title={catalogTeaserCopy.title} lead={catalogTeaserCopy.description} />
          <RevealItem className={styles.actions}>
            <Button to={path('hardware-products.catalog')} size="lg" arrow>
              {catalogTeaserCopy.open}
            </Button>
            <span className={styles.pages}>
              {hardwareItems.length} {catalogTeaserCopy.pages} · A4
            </span>
          </RevealItem>
        </RevealGroup>

        <div ref={stackRef} className={styles.stack} aria-hidden="true">
          {sheets.map((item, index) => (
            <motion.div key={item.slug} className={styles.sheet} data-position={index} style={transforms[index]}>
              <Sheet item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}
