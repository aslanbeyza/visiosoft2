import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import Button from '../../components/Button/index.ts'
import Reveal, { revealEase } from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import { company, whatsappUrl } from '../../data/company.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { alprCopy } from './alprCopy.ts'
import styles from './ContactFinale.module.css'

// 24 saatlik kadran: her saat bir çentik
const ticks = Array.from({ length: 24 }, (_, hour) => hour)

/** Kapanış: iletişim kanalları ve bir kez çizilen 24 saatlik kadran. */
export default function ContactFinale() {
  const path = usePath()
  const { config } = useLocale()
  const reduce = Boolean(useReducedMotion())
  const dialRef = useRef<HTMLDivElement>(null)
  const inView = useInView(dialRef, { once: true, amount: 0.4 })
  const run = !reduce && inView
  const { finale } = alprCopy
  const waUrl = whatsappUrl(config?.whatsapp_wa_id || company.whatsapp.waId, finale.whatsappMessage)

  return (
    <Section id="iletisim" tone="navy" spacing="lg" labelledBy="finale-baslik">
      <div className={styles.grid}>
        <div className={styles.copy}>
          <SectionHeading id="finale-baslik" tone="dark" eyebrow={finale.eyebrow} title={finale.title} lead={finale.desc} />
          <Reveal as="p" className={styles.text} delay={0.2}>
            {finale.text}
          </Reveal>
          <Reveal className={styles.actions} delay={0.3}>
            <Button to={path('contact')} variant="light" size="lg" arrow className={styles.primary}>
              {alprCopy.contact}
            </Button>
            <Button href={`mailto:${company.email}`} variant="outlineLight" size="lg" external>
              {finale.email}
              <span className={styles.srOnly}>{finale.newTab}</span>
            </Button>
            <Button href={waUrl} variant="outlineLight" size="lg" external>
              {finale.whatsapp}
              <span className={styles.srOnly}>{finale.newTab}</span>
            </Button>
          </Reveal>
        </div>

        <div ref={dialRef} className={styles.dial} aria-hidden="true">
          <svg viewBox="-120 -120 240 240" className={styles.svg}>
            <circle r="96" className={styles.track} />
            {ticks.map((hour) => (
              <motion.line
                key={hour}
                x1="0"
                y1={hour % 6 === 0 ? -80 : -86}
                x2="0"
                y2="-104"
                transform={`rotate(${hour * 15})`}
                className={hour % 6 === 0 ? styles.tickMajor : styles.tick}
                initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                animate={run ? { pathLength: 1, opacity: 1 } : undefined}
                transition={{ duration: 0.4, delay: 0.2 + hour * 0.04, ease: revealEase }}
              />
            ))}
            <motion.circle
              r="96"
              className={styles.sweep}
              transform="rotate(-90)"
              initial={reduce ? false : { pathLength: 0 }}
              animate={run ? { pathLength: 1 } : undefined}
              transition={{ duration: 1.8, delay: 0.3, ease: revealEase }}
            />
          </svg>
          <motion.span
            className={styles.dialLabel}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={run ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: 1.2, ease: revealEase }}
          >
            {finale.dialLabel}
          </motion.span>
        </div>
      </div>
    </Section>
  )
}
