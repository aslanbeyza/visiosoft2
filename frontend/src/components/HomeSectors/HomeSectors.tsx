import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import Section from '../Section/index.ts'
import SectionHeading from '../SectionHeading/index.ts'
import { useMediaQuery } from '../../hooks/useMediaQuery/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import SectorIcon from './SectorIcon.tsx'
import { homeSectorsCopy as text } from './homeSectorsCopy.ts'
import styles from './HomeSectors.module.css'

/** Hücre beyaz kalır (çizgi zemini görünmesin); yalnızca içerik yükselir, ikon çizgileri ardından çizilir. */
const cell: Variants = { hidden: {}, show: {} }

const content: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, delayChildren: delay, ease: revealEase },
  }),
}

/** Ana sayfa 4.5 — Kullanım alanları: saç çizgisi ızgarada altı sektör; çizgi ikonlar bir kez çizilir. */
export default function HomeSectors() {
  const path = usePath()
  const reduce = useReducedMotion()
  const wide = useMediaQuery('(min-width: 1024px)')
  const medium = useMediaQuery('(min-width: 640px)')
  const columns = wide ? 3 : medium ? 2 : 1

  return (
    <Section id="kullanim-alanlari" tone="surface" spacing="md" labelledBy="home-sectors-title" className={styles.section}>
      <SectionHeading eyebrow={text.eyebrow} title={text.title} id="home-sectors-title" />

      <ul className={styles.grid} role="list">
        {text.items.map((item, index) => (
          <motion.li
            key={item.route}
            className={styles.item}
            variants={cell}
            initial={reduce ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
          >
            <motion.article
              className={styles.tile}
              variants={content}
              custom={columns === 1 ? 0 : (index % columns) * 0.09}
            >
              <span className={styles.accent} aria-hidden="true" />
              <span className={styles.media} aria-hidden="true">
                <img
                  src={item.image.src}
                  alt=""
                  width={item.image.width}
                  height={item.image.height}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </span>
              <div className={styles.inner}>
                <SectorIcon id={item.icon} className={styles.icon} />

                <div className={styles.body}>
                  <h3 className={styles.title}>
                    <Link to={path(item.route)} className={styles.link}>
                      {item.title}
                      <span className="sr-only">
                        {' — '}
                        {item.destination} {text.destinationSuffix}
                      </span>
                    </Link>
                  </h3>
                  <p className={styles.text}>{item.description}</p>

                  {'refs' in item && item.refs ? (
                    <p className={styles.refs}>
                      <span className={styles.refsLabel}>{text.refsLabel}</span>
                      {item.refs}
                    </p>
                  ) : null}
                </div>

                <span className={styles.more} aria-hidden="true">
                  <span className={styles.moreText}>{text.more}</span>
                  <svg viewBox="0 0 24 24" className={styles.arrow} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
            </motion.article>
          </motion.li>
        ))}
      </ul>
    </Section>
  )
}
