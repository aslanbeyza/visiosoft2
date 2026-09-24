import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import type { BankAccount } from './bankAccountsCopy.ts'
import styles from './BankHeroCards.module.css'

const POSES = [
  { rotate: -5, from: 90 },
  { rotate: 4, from: 130 },
]

const currencyOf = (label: string) => label.replace(/\s*IBAN$/i, '')

export default function BankHeroCards({ banks }: { banks: BankAccount[] }) {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const run = reduce || inView

  return (
    <div ref={ref} className={styles.stage} aria-hidden="true">
      {banks.slice(0, 2).map((bank, index) => {
        const pose = POSES[index] ?? POSES[0]
        return (
          <motion.div
            key={bank.code}
            className={styles.slot}
            data-index={index}
            initial={reduce ? false : { opacity: 0, y: pose.from, rotate: pose.rotate * 2.2 }}
            animate={run ? { opacity: 1, y: 0, rotate: pose.rotate } : undefined}
            transition={{ duration: 1.1, delay: 0.3 + index * 0.22, ease: revealEase }}
          >
            <div className={styles.card} data-tone={index === 0 ? 'navy' : 'paper'}>
              <div className={styles.cardTop}>
                <span className={styles.code}>{bank.code}</span>
                <svg viewBox="0 0 40 30" className={styles.chip} focusable="false">
                  <rect x="1" y="1" width="38" height="28" rx="5" />
                  <path d="M1 11h11M1 19h11M28 11h11M28 19h11M12 1v28M28 1v28M12 15h16" />
                </svg>
              </div>
              <div className={styles.cardBody}>
                <span className={styles.bankName}>{bank.name}</span>
                <motion.span
                  className={styles.rule}
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={run ? { scaleX: 1 } : undefined}
                  transition={{ duration: 0.9, delay: 0.9 + index * 0.22, ease: revealEase }}
                />
                <span className={styles.holder}>{bank.holder}</span>
              </div>
              <ul className={styles.currencies}>
                {bank.ibans.map((iban, i) => (
                  <motion.li
                    key={iban.value}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={run ? { opacity: 1, y: 0 } : undefined}
                    transition={{ duration: 0.5, delay: 1.1 + index * 0.22 + i * 0.08, ease: revealEase }}
                  >
                    {currencyOf(iban.label)}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
