import { motion, useReducedMotion } from 'framer-motion'
import Button from '../Button/index.ts'
import { revealEase } from '../Reveal/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { flagshipInfo } from './flagships.ts'
import type { Flagship } from './flagships.ts'
import { homeFlagshipsCopy as text } from './homeFlagshipsCopy.ts'
import styles from './FlagshipDetails.module.css'

type FlagshipDetailsProps = {
  items: Flagship[]
  active: number
}

const pad = (value: number) => String(value).padStart(2, '0')

/**
 * Ürün metinleri aynı ızgara hücresinde üst üste durur; hücre en uzun metin kadar yer ayırır, sayfa zıplamaz.
 * Etkin olmayan paneller görünmez, erişilebilirlik ağacından ve odak sırasından çıkar (inert).
 */
export default function FlagshipDetails({ items, active }: FlagshipDetailsProps) {
  const reduce = useReducedMotion()
  const path = usePath()

  return (
    <div className={styles.stack}>
      {items.map((item, index) => {
        const on = index === active
        const info = flagshipInfo(item.slug)
        return (
          <motion.div
            key={item.slug}
            className={styles.panel}
            data-active={on}
            aria-hidden={!on}
            inert={!on}
            initial={false}
            animate={{ opacity: on ? 1 : 0, y: on ? 0 : 8 }}
            transition={reduce ? { duration: 0 } : { duration: on ? 0.5 : 0.2, delay: on ? 0.08 : 0, ease: revealEase }}
          >
            <p className={styles.eyebrow}>{info.eyebrow}</p>
            <h3 className={styles.name}>{info.name}</h3>
            <p className={styles.lead}>{info.lead}</p>

            <ul className={styles.features} aria-label={text.featuresLabel}>
              {info.features.map((feature) => (
                <li key={feature}>
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M5 10.5l3.2 3L15 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <dl className={styles.meta}>
              {info.dimensions ? (
                <div>
                  <dt>{text.dimensionsLabel}</dt>
                  <dd className={styles.numbers}>{info.dimensions} mm</dd>
                </div>
              ) : null}
              <div>
                <dt>{text.systemLabel}</dt>
                <dd>
                  <ul className={styles.steps}>
                    {item.steps.map((step) => (
                      <li key={step}>
                        <span className={styles.stepIndex}>
                          <span className="sr-only">{text.systemStepLabel} </span>
                          {pad(step)}
                        </span>
                        {text.steps[step - 1]}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>

            <Button to={path(info.route)} variant="secondary" arrow className={styles.more}>
              {text.more}
              <span className="sr-only">: {info.name}</span>
            </Button>
          </motion.div>
        )
      })}
    </div>
  )
}
