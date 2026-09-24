import { motion, useReducedMotion } from 'framer-motion'
import Button from '../../components/Button/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import TextReveal from '../../components/TextReveal/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import LineupStage from './LineupStage.tsx'
import { heroCopy } from './listingCopy.ts'
import styles from './HeroLineup.module.css'

const TITLE_ID = 'donanim-urunleri-baslik'

export default function HeroLineup() {
  const reduce = useReducedMotion()
  const path = usePath()

  const rise = (delay: number) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: revealEase, delay },
        }

  return (
    <section className={styles.hero} aria-labelledby={TITLE_ID}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <div className={styles.heading}>
            <p className={styles.eyebrow}>
              <motion.span
                className={styles.rule}
                aria-hidden="true"
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, ease: revealEase }}
              />
              {heroCopy.eyebrow}
            </p>
            <TextReveal as="h1" id={TITLE_ID} lines={heroCopy.titleLines} className={styles.title} delay={0.15} />
          </div>

          <div className={styles.side}>
            <motion.p className={styles.lead} {...rise(0.45)}>
              {heroCopy.lead}
            </motion.p>
            <motion.div className={styles.actions} {...rise(0.6)}>
              <Button href="#urunler" size="lg" arrow>
                {heroCopy.primary}
              </Button>
              <Button to={path('hardware-products.catalog')} variant="secondary" size="lg">
                {heroCopy.secondary}
              </Button>
            </motion.div>
          </div>
        </div>

        <LineupStage />

        <motion.p className={styles.note} {...rise(1.4)}>
          {heroCopy.lineupNote}
        </motion.p>
      </div>
    </section>
  )
}
