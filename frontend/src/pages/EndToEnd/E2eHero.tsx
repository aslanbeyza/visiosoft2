import { useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Button from '../../components/Button/index.ts'
import Reveal, { revealEase } from '../../components/Reveal/index.ts'
import TextReveal from '../../components/TextReveal/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { endToEndCopy } from './endToEndCopy.ts'
import HubSpoke from './HubSpoke.tsx'
import styles from './E2eHero.module.css'

export default function E2eHero() {
  const { hero } = endToEndCopy
  const reduce = Boolean(useReducedMotion())
  const path = usePath()
  const titleId = useId()

  return (
    <section className={styles.hero} aria-labelledby={titleId}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <Reveal as="p" className={styles.eyebrow} delay={0.05} y={14} amount={0.1}>
            <motion.span
              className={styles.rule}
              aria-hidden="true"
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.25, ease: revealEase }}
            />
            {hero.eyebrow}
          </Reveal>

          <TextReveal as="h1" id={titleId} className={styles.title} text={hero.title} delay={0.15} />

          <Reveal as="p" className={styles.lead} delay={0.45} y={20} amount={0.1}>
            {hero.lead}
          </Reveal>

          <Reveal className={styles.actions} delay={0.6} y={16} amount={0.1}>
            <Button to={path('quote.index')} size="lg" arrow>
              {hero.quote}
            </Button>
            <Button to={path('contact')} size="lg" variant="secondary">
              {hero.contact}
            </Button>
          </Reveal>
        </div>

        <div className={styles.media}>
          <HubSpoke />
        </div>
      </div>
    </section>
  )
}
