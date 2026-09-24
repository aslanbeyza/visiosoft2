
import { Fragment, useCallback, useLayoutEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import styles from './TextReveal.module.css'

export type TextRevealProps = {
  text?: string

  lines?: string[]
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'

  mode?: 'lines' | 'words'

  delay?: number
  className?: string
  id?: string

  stagger?: number

  duration?: number

  amount?: number
}

const HEADINGS = new Set(['h1', 'h2', 'h3'])

const splitWords = (value: string) => value.split(/[ \t]+/).filter(Boolean)

type WordProps = { word: string; index?: number; last: boolean }

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
            {}
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
