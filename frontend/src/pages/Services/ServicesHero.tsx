import { motion, useReducedMotion } from 'framer-motion'
import Button from '../../components/Button/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import TextReveal from '../../components/TextReveal/index.ts'
import { navCta } from '../../data/siteNav.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import EkgStrip from './EkgStrip.tsx'
import { servicesCopy } from './servicesCopy.ts'
import styles from './ServicesHero.module.css'

const copy = servicesCopy.hero
const TITLE_ID = 'hizmetlerimiz-baslik'

export default function ServicesHero() {
  const reduce = Boolean(useReducedMotion())
  const path = usePath()

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: revealEase },
  })

  return (
    <section className={styles.hero} aria-labelledby={TITLE_ID}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <div className={styles.titleCell}>
            <motion.p className={styles.eyebrow} {...rise(0)}>
              <motion.span
                className={styles.rule}
                aria-hidden="true"
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, delay: 0.1, ease: revealEase }}
              />
              {copy.eyebrow}
            </motion.p>
            <TextReveal as="h1" id={TITLE_ID} lines={copy.title} className={styles.title} delay={0.15} amount={0.1} />
          </div>
          <div className={styles.side}>
            <motion.p className={styles.lead} {...rise(0.45)}>
              {copy.lead}
            </motion.p>
            <motion.div className={styles.actions} {...rise(0.6)}>
              <Button to={path(navCta.primary.route)} size="lg" arrow>
                {navCta.primary.label}
              </Button>
              <Button to={path(navCta.quickQuote.route)} variant="secondary" size="lg">
                {navCta.quickQuote.label}
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.div className={styles.strip} {...rise(0.35)}>
          <EkgStrip beats={servicesCopy.subNav} label={copy.pulseLabel} pauseLabel={copy.pause} playLabel={copy.play} />
        </motion.div>
      </div>
    </section>
  )
}
