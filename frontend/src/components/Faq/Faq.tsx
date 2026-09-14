/**
 * Kullanım:
 * <Faq
 *   label="Sık sorulan sorular"
 *   schema                       // FAQPage JSON-LD üretir
 *   items={[{ question: 'Kurulum ne kadar sürer?', answer: 'Keşif sonrası planlanan takvimde…' }]}
 * />
 * Akordeon: <h3><button aria-expanded aria-controls> + role="region". Yukarı/Aşağı/Home/End tuşları sorular arasında gezer.
 * Açılış CSS grid (0fr → 1fr) ile; yanıt metnindeki boş satırlar paragraf olur.
 */
import { useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import JsonLd from '../JsonLd/index.ts'
import { revealEase } from '../Reveal/index.ts'
import styles from './Faq.module.css'

export type FaqItem = {
  question: string
  answer: string
}

export type FaqProps = {
  items: FaqItem[]
  /** Grubun erişilebilir adı. */
  label?: string
  /** true ise FAQPage JSON-LD eklenir. */
  schema?: boolean
  tone?: 'light' | 'dark'
  /** Başlık düzeyi; bölüm başlığı h2 ise h3 (varsayılan). */
  headingAs?: 'h3' | 'h4'
  /** Başlangıçta açık olan sorunun sırası (0 tabanlı). */
  defaultOpen?: number
  /** true ise aynı anda yalnızca bir soru açık kalır. */
  single?: boolean
  className?: string
}

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: revealEase } },
}

const hairlineVariants: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1, ease: revealEase } },
}

/** Boş satırla ayrılan bloklar paragraf, tek satır sonları satır kesmesi olur. */
function renderAnswer(answer: string) {
  return answer
    .replace(/\r\n?/g, '\n')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => (
      <p key={block}>
        {block.split('\n').map((line, index) => (
          <span key={`${index}-${line}`}>
            {index > 0 ? <br /> : null}
            {line}
          </span>
        ))}
      </p>
    ))
}

function faqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

export default function Faq({
  items,
  label,
  schema = false,
  tone = 'light',
  headingAs: Heading = 'h3',
  defaultOpen,
  single = false,
  className = '',
}: FaqProps) {
  const reduce = useReducedMotion()
  const baseId = useId()
  const triggers = useRef<(HTMLButtonElement | null)[]>([])
  const [open, setOpen] = useState<number[]>(defaultOpen === undefined ? [] : [defaultOpen])

  const toggle = (index: number) => {
    setOpen((current) => {
      const isOpen = current.includes(index)
      if (single) return isOpen ? [] : [index]
      return isOpen ? current.filter((value) => value !== index) : [...current, index]
    })
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const count = items.length
    let next: number | null = null
    if (event.key === 'ArrowDown') next = (index + 1) % count
    else if (event.key === 'ArrowUp') next = (index - 1 + count) % count
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = count - 1
    if (next === null) return
    event.preventDefault()
    triggers.current[next]?.focus()
  }

  return (
    <>
      {schema ? <JsonLd data={faqSchema(items)} /> : null}
      <motion.div
        className={`${styles.faq} ${className}`.trim()}
        data-tone={tone}
        role="group"
        aria-label={label}
        variants={listVariants}
        initial={reduce ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        {items.map((item, index) => {
          const isOpen = open.includes(index)
          const buttonId = `${baseId}-q-${index}`
          const panelId = `${baseId}-a-${index}`

          return (
            <motion.div key={item.question} className={styles.item} variants={itemVariants}>
              <motion.span className={styles.hairline} aria-hidden="true" variants={hairlineVariants} />
              <Heading className={styles.heading}>
                <button
                  ref={(node) => {
                    triggers.current[index] = node
                  }}
                  id={buttonId}
                  type="button"
                  className={styles.trigger}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                >
                  <span className={styles.question}>{item.question}</span>
                  <span className={styles.icon} aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" focusable="false">
                      <path d="M8 3.5v9" className={styles.iconV} />
                      <path d="M3.5 8h9" className={styles.iconH} />
                    </svg>
                  </span>
                </button>
              </Heading>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={styles.panel}
                data-open={isOpen ? 'true' : 'false'}
                inert={!isOpen}
              >
                <div className={styles.panelInner}>
                  <div className={styles.answer}>{renderAnswer(item.answer)}</div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </>
  )
}
