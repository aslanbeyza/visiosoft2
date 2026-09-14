import { useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { usePath } from '../../hooks/usePath/index.ts'
import { homeAssuranceCopy as text } from './homeAssuranceCopy.ts'
import type { AssuranceColumnId } from './homeAssuranceCopy.ts'
import { arrowPath, checkPath, columnIcons } from './icons.ts'
import { drawVariants, riseVariants, ruleVariants } from './variants.ts'
import styles from './AssuranceColumns.module.css'

/** Sütunlar arası gecikme: üst çizgiler soldan sağa tek bir çizgi gibi sırayla çizilir. */
const COLUMN_DELAY = 0.28
const pad = (value: number) => String(value).padStart(2, '0')

/** Tire veya eğik çizgi içeren kısa terimler (AES-256, SSL/TLS, 7/24) satır sonunda bölünmez; metin aynen kalır. */
const TOKEN = /(\S+[-/]\S+)/

function KeepTogether({ text }: { text: string }) {
  return text.split(TOKEN).map((part, k) =>
    k % 2 === 1 ? (
      <span key={k} className={styles.nowrap}>
        {part}
      </span>
    ) : (
      part
    ),
  )
}

type ColumnHeadProps = { id: AssuranceColumnId; index: number; title: string }

function ColumnHead({ id, index, title }: ColumnHeadProps) {
  const base = index * COLUMN_DELAY

  return (
    <>
      <span className={styles.rule} aria-hidden="true">
        <motion.span className={styles.ruleAccent} custom={base} variants={ruleVariants} />
      </span>
      <div className={styles.head}>
        <span className={styles.iconTile} aria-hidden="true">
          <svg viewBox="0 0 24 24" className={styles.icon} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {columnIcons[id].map((d, k) => (
              <motion.path key={d} d={d} custom={base + 0.35 + k * 0.08} variants={drawVariants} />
            ))}
          </svg>
        </span>
        <motion.span className={styles.index} aria-hidden="true" custom={base + 0.25} variants={riseVariants}>
          {pad(index + 1)}
        </motion.span>
      </div>
      <motion.h3 id={`home-assurance-${id}`} className={styles.title} custom={base + 0.25} variants={riseVariants}>
        {title}
      </motion.h3>
    </>
  )
}

type CheckColumnProps = { id: AssuranceColumnId; index: number; title: string; items: string[] }

function CheckColumn({ id, index, title, items }: CheckColumnProps) {
  const base = index * COLUMN_DELAY + 0.45

  return (
    <div className={styles.column} data-id={id}>
      <ColumnHead id={id} index={index} title={title} />
      <ul className={styles.list} role="list" aria-labelledby={`home-assurance-${id}`}>
        {items.map((item, j) => (
          <motion.li key={item} className={styles.item} custom={base + j * 0.07} variants={riseVariants}>
            <svg viewBox="0 0 24 24" className={styles.check} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <motion.path d={checkPath} custom={base + 0.2 + j * 0.07} variants={drawVariants} />
            </svg>
            <span>
              <KeepTogether text={item} />
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

/** Destek, güvenlik ve entegrasyon sütunları; tüm giriş sırası tek bir görünürlük tetikleyicisinden yönetilir. */
export default function AssuranceColumns() {
  const path = usePath()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  // Klavyeyle giriş başlamadan odaklanılırsa içerik gecikmesiz görünür; odak halkası boş bir öğeyi çevrelemez.
  const [focusedEarly, setFocusedEarly] = useState(false)
  const { support, security, integration } = text
  const chipBase = 2 * COLUMN_DELAY + 0.45
  const state = reduce ? 'show' : focusedEarly ? 'instant' : inView ? 'show' : 'hidden'

  return (
    <motion.div
      ref={ref}
      className={styles.grid}
      initial={reduce ? false : 'hidden'}
      animate={state}
      onFocusCapture={() => {
        if (!inView && !reduce) setFocusedEarly(true)
      }}
    >
      <CheckColumn id={support.id} index={0} title={support.title} items={support.items} />
      <CheckColumn id={security.id} index={1} title={security.title} items={security.items} />

      <div className={styles.column} data-id={integration.id}>
        <ColumnHead id={integration.id} index={2} title={integration.title} />
        <ul className={styles.groups} role="list" aria-labelledby={`home-assurance-${integration.id}`}>
          {integration.groups.map((group, j) => (
            <motion.li key={group.join('|')} className={styles.group} custom={chipBase + j * 0.07} variants={riseVariants}>
              <ul className={styles.chips} role="list">
                {group.map((chip) => (
                  <li key={chip} className={styles.chip}>
                    {chip}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ul>
        <motion.p className={styles.linkRow} custom={chipBase + integration.groups.length * 0.07} variants={riseVariants}>
          <Link to={path('developers')} className={styles.link}>
            <span className={styles.linkLabel}>{integration.link}</span>
            <svg viewBox="0 0 24 24" className={styles.arrow} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={arrowPath} />
            </svg>
          </Link>
        </motion.p>
      </div>
    </motion.div>
  )
}
