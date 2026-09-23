import { motion, useReducedMotion } from 'framer-motion'
import Button from '../../components/Button/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import TextReveal from '../../components/TextReveal/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { titleIds, violationsCopy } from './violationsCopy.ts'
import styles from './ViolationHero.module.css'

const copy = violationsCopy.hero

/**
 * Açılış: sol blokta etiket ve iki satırlık başlık, sağda açıklama ve eylemler; altta ince bir çizgi
 * soldan sağa çizilerek hemen ardından gelen ihlal panosuna bağlanır.
 */
export default function ViolationHero() {
  const reduce = Boolean(useReducedMotion())
  const path = usePath()

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: revealEase },
  })

  return (
    <section className={styles.hero} aria-labelledby={titleIds.hero}>
      <div className={styles.inner}>
        <div className={styles.head}>
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
          <TextReveal as="h1" id={titleIds.hero} lines={copy.title} className={styles.title} delay={0.15} amount={0.1} />
        </div>
        <div className={styles.side}>
          <motion.p className={styles.lead} {...rise(0.45)}>
            {copy.lead}
          </motion.p>
          <motion.div className={styles.actions} {...rise(0.6)}>
            <Button to={path('quote.index')} size="lg" className={styles.primaryAction}>
              {copy.primary}
            </Button>
            <Button href={`#${violationsCopy.board.id}`} variant="secondary" size="lg" className={styles.secondaryAction}>
              {copy.secondary}
            </Button>
          </motion.div>
        </div>
        <motion.span
          className={styles.baseline}
          aria-hidden="true"
          initial={reduce ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, delay: 0.7, ease: revealEase }}
        />
      </div>
    </section>
  )
}
