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
const DURATION = 0.38

/**
 * Vitrin metni: sayaç, kategori, ad, tam açıklama, üç etiket ve ürün sayfası CTA'sı.
 * Etkin olmayan paneller erişilebilirlik ağacından çıkar.
 */
export default function FlagshipDetails({ items, active }: FlagshipDetailsProps) {
  const reduce = Boolean(useReducedMotion())
  const path = usePath()
  const duration = reduce ? 0 : DURATION

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
            animate={{ opacity: on ? 1 : 0, y: on ? 0 : 12 }}
            transition={{ duration, ease: revealEase }}
          >
            <p className={styles.counter}>
              <span className="sr-only">{text.counterLabel(index + 1, items.length)}</span>
              <span aria-hidden="true">
                <strong>{pad(index + 1)}</strong> / {pad(items.length)}
              </span>
            </p>
            <p className={styles.category}>{info.category}</p>
            <h3 className={styles.name}>{info.name}</h3>
            <p className={styles.lead}>{info.summary}</p>
            <ul className={styles.tags} aria-label={text.featuresLabel}>
              {info.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <Button to={path(info.route)} variant="primary" arrow className={styles.more}>
              {text.more}
              <span className="sr-only">: {info.name}</span>
            </Button>
          </motion.div>
        )
      })}
    </div>
  )
}
