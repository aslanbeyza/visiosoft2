import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import type { StackGroup } from './stackCopy.ts'
import styles from './StackTiles.module.css'

type StackTilesProps = { groups: StackGroup[]; label: string }

const tile: Variants = {
  hidden: { opacity: 0, y: 28 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.8, ease: revealEase, staggerChildren: 0.07, delayChildren: 0.2 } },
}
const row: Variants = {
  hidden: { opacity: 0, x: -10 },
  shown: { opacity: 1, x: 0, transition: { duration: 0.55, ease: revealEase } },
}
const rule: Variants = {
  hidden: { scaleX: 0 },
  shown: { scaleX: 1, transition: { duration: 0.9, ease: revealEase } },
}

/** Teknoloji omurgası kutuları: kutu yükselir, satırlar sırayla gelir, ayırıcı çizgiler çizilir. */
export default function StackTiles({ groups, label }: StackTilesProps) {
  const reduce = Boolean(useReducedMotion())

  return (
    <ul className={styles.grid} aria-label={label}>
      {groups.map((group, index) => (
        <motion.li
          key={group.title}
          className={styles.tile}
          variants={tile}
          initial={reduce ? false : 'hidden'}
          whileInView="shown"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: (index % 2) * 0.08 }}
        >
          <div className={styles.head}>
            <span className={styles.mark} aria-hidden="true">
              {group.mark}
            </span>
            <div>
              <h3 className={styles.title}>{group.title}</h3>
              <p className={styles.subtitle}>{group.subtitle}</p>
            </div>
          </div>
          <dl className={styles.rows} data-count={group.rows.length}>
            {group.rows.map((item) => (
              <motion.div key={item.name} className={styles.row} variants={row}>
                <dt className={styles.name}>
                  <motion.span className={styles.rule} variants={rule} aria-hidden="true" />
                  {item.name}
                </dt>
                <dd className={styles.note}>{item.note}</dd>
              </motion.div>
            ))}
          </dl>
        </motion.li>
      ))}
    </ul>
  )
}
