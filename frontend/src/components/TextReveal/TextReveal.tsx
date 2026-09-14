/**
 * Kullanım:
 *   <TextReveal as="h1" text="Tek işimiz otopark otomasyonu." className={styles.title} />
 *   <TextReveal as="h2" lines={['Sahada çalışan', 'donanım ailesi']} delay={0.2} />
 *   <TextReveal as="p" mode="words" text="Uzun bir açıklama cümlesi…" />
 *
 * Satırlar ya da kelimeler görünüm alanına girince kırpılmış kutulardan yukarı kayarak belirir (M2).
 * `lines` verilmezse satırlar yerleşimden ölçülür; aynı satırdaki kelimeler birlikte hareket eder.
 * Erişilebilir metin tek parçadır (başlıklarda aria-label, diğerlerinde ekran okuyucu metni);
 * hareket azaltma tercihinde düz metin basılır ve başlık semantiği korunur.
 */
import { Fragment, useCallback, useLayoutEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import styles from './TextReveal.module.css'

export type TextRevealProps = {
  text?: string
  /** Açık satır kırılımları; her satır kendi başına belirir. */
  lines?: string[]
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  /** lines: satırlar 0,08 s arayla · words: kelimeler 0,03 s arayla. */
  mode?: 'lines' | 'words'
  /** Başlangıç gecikmesi (s). */
  delay?: number
  className?: string
  id?: string
  /** Parçalar arası gecikme (s); varsayılan moda göre 0,08 / 0,03. */
  stagger?: number
  /** Tek parçanın süresi (s). */
  duration?: number
  /** Başlaması için görünmesi gereken oran. */
  amount?: number
}

const HEADINGS = new Set(['h1', 'h2', 'h3'])

const splitWords = (value: string) => value.split(/[ \t]+/).filter(Boolean)

type WordProps = { word: string; index?: number; last: boolean }

/** Kırpılmış kutu ve içinde kayan kelime; `--i` gecikme sırasını verir. */
function Word({ word, index, last }: WordProps) {
  return (
    <>
      <span className={styles.frag} style={index === undefined ? undefined : ({ '--i': index } as CSSProperties)}>
        <span className={styles.inner}>{word}</span>
      </span>
      {last ? null : ' '}
    </>
  )
}

export default function TextReveal({
  text,
  lines,
  as: Tag = 'p',
  mode = 'lines',
  delay = 0,
  className = '',
  id,
  stagger,
  duration = 0.9,
  amount = 0.3,
}: TextRevealProps) {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLElement | null>(null)
  const setRef = useCallback((node: HTMLElement | null) => {
    ref.current = node
  }, [])
  const inView = useInView(ref, { once: true, amount })

  const rows = lines ?? (text ? text.split('\n') : [])
  const explicit = lines !== undefined || rows.length > 1
  const full = rows.join(' ')
  const measure = !reduce && mode === 'lines' && !explicit
  const step = stagger ?? (mode === 'lines' ? 0.08 : 0.03)
  const heading = HEADINGS.has(Tag)

  // Satırlar yerleşimden ölçülür: aynı yükseklikte başlayan kelimeler aynı satır sırasını alır.
  // Değerler React state'i yerine doğrudan CSS değişkeni olarak yazılır; animasyon başlayana kadar yeniden ölçülür.
  useLayoutEffect(() => {
    if (!measure) return
    const root = ref.current
    if (!root) return
    const frags = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.frag}`))
    const assign = () => {
      let line = -1
      let lastTop = Number.NaN
      for (const frag of frags) {
        const top = frag.offsetTop
        if (Number.isNaN(lastTop) || Math.abs(top - lastTop) > 1) {
          line += 1
          lastTop = top
        }
        frag.style.setProperty('--i', String(Math.max(line, 0)))
      }
    }
    assign()
    if (inView) return
    const observer = new ResizeObserver(assign)
    observer.observe(root)
    return () => observer.disconnect()
  }, [measure, inView, full])

  if (reduce) {
    return (
      <Tag id={id} className={className}>
        {rows.map((row, index) => (
          <Fragment key={`${index}-${row}`}>
            {/* Satır sonundaki boşluk görünmez; textContent satırları "Otopark donanımları." diye birleştirir. */}
            {index > 0 ? (
              <>
                {' '}
                <br />
              </>
            ) : null}
            {row}
          </Fragment>
        ))}
      </Tag>
    )
  }

  let counter = 0
  const fragments = explicit
    ? rows.map((row, rowIndex) => {
        const words = splitWords(row)
        // Blok satırlar arasındaki boşluk düğümü yerleşimde çökertilir; textContent/innerText kelimeleri ayrı okur.
        return (
          <Fragment key={`${rowIndex}-${row}`}>
            {rowIndex > 0 ? ' ' : null}
            <span className={styles.line}>
              {words.map((word, wordIndex) => {
                const index = mode === 'words' ? counter++ : rowIndex
                return <Word key={`${wordIndex}-${word}`} word={word} index={index} last={wordIndex === words.length - 1} />
              })}
            </span>
          </Fragment>
        )
      })
    : splitWords(full).map((word, wordIndex, words) => (
        <Word
          key={`${wordIndex}-${word}`}
          word={word}
          index={mode === 'words' ? wordIndex : undefined}
          last={wordIndex === words.length - 1}
        />
      ))

  return (
    <Tag
      ref={setRef}
      id={id}
      className={`${styles.root} ${className}`.trim()}
      data-in={inView ? 'true' : 'false'}
      data-mode={mode}
      aria-label={heading && full ? full : undefined}
      style={{ '--tr-delay': `${delay}s`, '--tr-stagger': `${step}s`, '--tr-duration': `${duration}s` } as CSSProperties}
    >
      {heading ? null : <span className={styles.srOnly}>{full}</span>}
      <span className={styles.frags} aria-hidden="true">
        {fragments}
      </span>
    </Tag>
  )
}
