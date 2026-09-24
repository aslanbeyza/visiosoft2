import { motion, useReducedMotion } from 'framer-motion'
import Button from '../../components/Button/index.ts'
import ParkingFlow from '../../components/ParkingFlow/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import TextReveal from '../../components/TextReveal/index.ts'
import { useMediaQuery } from '../../hooks/useMediaQuery/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { plakaCopy } from './plakaCopy.ts'
import styles from './PlakaHero.module.css'

const copy = plakaCopy.hero
export const PLAKA_TITLE_ID = 'plaka-tanima-baslik'

export default function PlakaHero() {
  const reduce = Boolean(useReducedMotion())
  const wide = useMediaQuery('(min-width: 1024px)')
  const path = usePath()
  const pinned = wide && !reduce

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: revealEase },
  })

  return (
    <section className={styles.hero} aria-labelledby={PLAKA_TITLE_ID} data-pin={pinned}>
      <div className={styles.inner}>
        <div className={styles.copyCell}>
          <div className={styles.copy}>
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
            <TextReveal as="h1" id={PLAKA_TITLE_ID} lines={copy.title} className={styles.title} delay={0.15} amount={0.1} />
            <motion.p className={styles.lead} {...rise(0.45)}>
              {copy.lead}
            </motion.p>
            <motion.div className={styles.actions} {...rise(0.6)}>
              <Button to={path('quote.index')} size="lg" arrow>
                {copy.primary}
              </Button>
              <Button to={path('discovery.show')} variant="secondary" size="lg">
                {copy.secondary}
              </Button>
            </motion.div>
          </div>
        </div>
        <motion.div className={styles.flowCell} {...rise(0.3)}>
          <ParkingFlow steps={plakaCopy.flowSteps} mode="scroll" label={copy.flowLabel} scrollLength={2.2} />
        </motion.div>
      </div>
    </section>
  )
}
