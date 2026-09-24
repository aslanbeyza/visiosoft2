import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Picture from '../../components/Picture/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import { SITE_URL } from '../../components/Seo/Seo.tsx'
import { company } from '../../data/company.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { catalogCopy } from './catalogCopy.ts'
import { categoryLabel, formatDimensions } from './data.ts'
import type { HardwareItem } from './data.ts'
import styles from './CatalogSheet.module.css'

type CatalogSheetProps = { item: HardwareItem; page: number; total: number }

const pad = (value: number) => String(value).padStart(2, '0')

const group: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }
const rise: Variants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: revealEase } } }
const draw: Variants = { hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.1, ease: revealEase } } }
const clip: Variants = {
  hidden: { clipPath: 'inset(0% 0% 100% 0%)' },
  show: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.1, ease: revealEase } },
}
const settle: Variants = { hidden: { scale: 1.08 }, show: { scale: 1, transition: { duration: 1.2, ease: revealEase } } }

export default function CatalogSheet({ item, page, total }: CatalogSheetProps) {
  const reduce = useReducedMotion()
  const path = usePath()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  const headingId = `katalog-${item.slug}-baslik`
  const href = path(item.route)
  const dimensions = formatDimensions(item.dimensions)

  return (
    <motion.article
      ref={ref}
      id={`katalog-${item.slug}`}
      className={styles.sheet}
      aria-labelledby={headingId}
      variants={group}
      initial={reduce ? false : 'hidden'}
      animate={reduce || inView ? 'show' : 'hidden'}
    >
      <header className={styles.head}>
        <span>{catalogCopy.documentTitle}</span>
        <span className={styles.page}>
          {catalogCopy.page} {pad(page)} / {pad(total)}
        </span>
        <motion.span className={styles.headLine} variants={draw} aria-hidden="true" />
      </header>

      <div className={styles.body}>
        <motion.div className={styles.stage} data-fit={item.image.fit} variants={clip}>
          <motion.div className={styles.stageInner} variants={settle}>
            <Picture src={item.image.src} avif={item.image.avif} width={item.image.width} height={item.image.height} alt={item.name} loading="eager" className={styles.image} />
          </motion.div>
        </motion.div>

        <div className={styles.info}>
          <motion.p className={styles.eyebrow} variants={rise}>
            {categoryLabel(item.category)}
          </motion.p>
          <motion.h2 id={headingId} className={styles.name} variants={rise}>
            {item.name}
          </motion.h2>
          <motion.p className={styles.lead} variants={rise}>
            {item.lead}
          </motion.p>
          <motion.dl className={styles.meta} variants={rise}>
            {item.meta.map((row) => (
              <div key={row.label} className={styles.metaRow}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
            {dimensions ? (
              <div className={styles.metaRow} data-emphasis="true">
                <dt>{catalogCopy.dimensions}</dt>
                <dd>{dimensions}</dd>
              </div>
            ) : null}
          </motion.dl>
        </div>
      </div>

      <section className={styles.features} aria-labelledby={`${headingId}-ozellik`}>
        <motion.h3 id={`${headingId}-ozellik`} className={styles.featuresTitle} variants={rise}>
          {catalogCopy.features}
        </motion.h3>
        <ol className={styles.featureList}>
          {item.features.map((feature, index) => (
            <motion.li key={feature.title} className={styles.feature} variants={rise}>
              <span className={styles.featureIndex} aria-hidden="true">
                {pad(index + 1)}
              </span>
              <p className={styles.featureTitle}>{feature.title}</p>
              <p className={styles.featureText}>{feature.desc}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      <footer className={styles.foot}>
        <span>
          {catalogCopy.detail}:{' '}
          <Link to={href} className={styles.link}>
            {SITE_URL.replace(/^https?:\/\//, '')}
            {href}
          </Link>
        </span>
        <span>
          {catalogCopy.contact}: {company.email}
        </span>
      </footer>
    </motion.article>
  )
}
