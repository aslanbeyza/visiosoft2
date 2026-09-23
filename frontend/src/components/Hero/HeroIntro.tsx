import type { MouseEvent } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Button from '../Button/index.ts'
import TextReveal from '../TextReveal/index.ts'
import { revealEase } from '../Reveal/motion.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { heroCopy } from './heroCopy.ts'
import { scrollToSection } from './scrollToSection.ts'
import styles from './HeroIntro.module.css'

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.45 } },
}

const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: revealEase } },
}

const rule: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.8, ease: revealEase } },
}

/** Hero metin sütunu: üst etiket, h1, açıklama, iki eylem ve kanıt listesi. */
export default function HeroIntro({ reduce }: { reduce: boolean }) {
  const path = usePath()
  const text = heroCopy
  const initial = reduce ? false : 'hidden'

  const onSystem = (event: MouseEvent<HTMLElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (scrollToSection(text.systemTarget.section, text.systemTarget.heading, reduce)) event.preventDefault()
  }

  return (
    <div className={styles.intro}>
      <motion.p className={styles.eyebrow} initial={initial} animate="show" variants={group}>
        <motion.span className={styles.rule} variants={rule} aria-hidden="true" />
        <motion.span variants={rise}>{text.eyebrow}</motion.span>
      </motion.p>

      <TextReveal as="h1" text={text.title} className={styles.title} delay={0.1} duration={1} amount={0.1} />

      <motion.div initial={initial} animate="show" variants={group}>
        <motion.p className={styles.description} variants={rise}>
          {text.description}
        </motion.p>

        <motion.div className={styles.actions} variants={rise}>
          <Button to={path('quote.index')} variant="light" size="lg" arrow className={`${styles.button} ${styles.cta}`}>
            {text.primary}
          </Button>
          <Button
            href={`#${text.systemTarget.section}`}
            variant="outlineLight"
            size="lg"
            className={`${styles.button} ${styles.secondary}`}
            onClick={onSystem}
          >
            {text.secondary}
          </Button>
        </motion.div>

        {/* Her öğenin başında nokta var; satır başına düşen nokta sarmalayıcının kırpmasıyla gizlenir. */}
        <motion.div className={styles.proofWrap} variants={rise}>
          <ul className={styles.proof}>
            {text.proof.map((item) => (
              <li key={item} className={styles.proofItem}>
                <span className={styles.dot} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </div>
  )
}
