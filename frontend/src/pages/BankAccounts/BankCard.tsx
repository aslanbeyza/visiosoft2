import { useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import CopyField from '../../components/CopyField/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import { bankAccountsCopy } from './bankAccountsCopy.ts'
import type { BankAccount } from './bankAccountsCopy.ts'
import styles from './BankCard.module.css'

const copy = bankAccountsCopy

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: index * 0.12, ease: revealEase, staggerChildren: 0.08, delayChildren: 0.2 + index * 0.12 },
  }),
}

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: revealEase } },
}

const sweepVariants: Variants = {
  hidden: { scaleX: 0, opacity: 1 },
  show: { scaleX: [0, 1, 1], opacity: [1, 1, 0], transition: { duration: 1.1, times: [0, 0.6, 1], ease: 'easeOut' } },
}

/** Tek banka kartı: başlık, hesap sahibi, kopyalanabilir IBAN/kod alanları ve salt okunur ayrıntılar. Satırlar süpürme çizgisiyle belirir (M12). */
export default function BankCard({ bank, index }: { bank: BankAccount; index: number }) {
  const reduce = Boolean(useReducedMotion())
  const titleId = useId()
  const fields = [...bank.ibans, ...bank.codes]

  return (
    <motion.article
      className={styles.card}
      aria-labelledby={titleId}
      variants={cardVariants}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      custom={index}
    >
      <header className={styles.head}>
        <span className={styles.badge} data-index={index} aria-hidden="true">
          {bank.code}
        </span>
        <div className={styles.titles}>
          <h2 id={titleId} className={styles.name}>
            {bank.name}
          </h2>
          <p className={styles.holder}>
            <span className={styles.holderLabel}>{copy.holderLabel}</span>
            {bank.holder}
          </p>
        </div>
      </header>

      <div className={styles.fields} role="group" aria-label={`${bank.name} — ${copy.ibanGroupLabel}`}>
        {fields.map((field) => (
          <motion.div key={field.value} className={styles.row} variants={rowVariants}>
            <motion.span className={styles.sweep} variants={sweepVariants} aria-hidden="true" />
            <CopyField
              label={field.label}
              value={field.value}
              display={field.display}
              mono={field.mono}
              copyLabel={copy.copyLabel}
              copiedLabel={copy.copiedLabel}
            />
          </motion.div>
        ))}
      </div>

      {bank.details.length ? (
        <motion.dl className={styles.details} variants={rowVariants}>
          {bank.details.map((detail) => (
            <div key={detail.label} className={styles.detail}>
              <dt>{detail.label}</dt>
              <dd>{detail.value}</dd>
            </div>
          ))}
        </motion.dl>
      ) : null}
    </motion.article>
  )
}
