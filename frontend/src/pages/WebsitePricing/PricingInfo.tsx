import { motion, useReducedMotion } from 'framer-motion'
import Prose from '../../components/Prose/index.ts'
import Reveal, { revealEase } from '../../components/Reveal/index.ts'
import { pricingCopy } from './pricingCopy.ts'
import styles from './PricingInfo.module.css'

const copy = pricingCopy.info
const pad = (n: number) => String(n).padStart(2, '0')

export default function PricingInfo() {
  const reduce = Boolean(useReducedMotion())

  return (
    <div className={styles.wrap}>
      <Reveal as="p" className={styles.eyebrow} y={14}>
        <motion.span
          className={styles.eyebrowRule}
          aria-hidden="true"
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: revealEase }}
        />
        {copy.eyebrow}
      </Reveal>
      <Prose tone="dark" size="lg" className={styles.prose}>
        <div className={styles.grid}>
          {copy.items.map((item, i) => (
            <Reveal key={item.title} as="article" className={styles.item} delay={i * 0.12} y={30}>
              <span className={styles.head} aria-hidden="true">
                <span className={styles.index}>{pad(i + 1)}</span>
                <motion.span
                  className={styles.rule}
                  initial={reduce ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease: revealEase }}
                />
              </span>
              <h2>{item.title}</h2>
              <p>{item.copy}</p>
            </Reveal>
          ))}
        </div>
      </Prose>
    </div>
  )
}
