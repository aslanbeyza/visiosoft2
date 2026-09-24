
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, RefObject } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'
import { codeBlockCopy as copy } from './codeBlockCopy.ts'
import { tokenizeLine } from './tokenize.ts'
import type { Token } from './tokenize.ts'
import styles from './CodeBlock.module.css'

export type CodeBlockProps = {
  code: string
  language?: string
  title?: string

  typing?: boolean
  lineNumbers?: boolean

  highlight?: boolean
  copyLabel?: string
  copiedLabel?: string
  className?: string

  delay?: number

  onComplete?: () => void
}

type Span = Token & { index: number; start: number; end: number; line: number }

const CLIPPED = 'inset(0 100% 0 0)'
const clipFor = (chars: number) => (chars <= 0 ? CLIPPED : `inset(0 calc(100% - ${chars}ch) 0 0)`)

function buildSpans(lines: string[], language: string, highlight: boolean) {
  const spans: Span[] = []
  let offset = 0
  lines.forEach((line, lineIndex) => {
    const tokens = highlight ? tokenizeLine(line, language) : [{ type: 'text' as const, value: line }]
    for (const token of tokens) {
      if (token.value.length === 0) continue
      spans.push({ ...token, index: spans.length, line: lineIndex, start: offset, end: offset + token.value.length })
      offset += token.value.length
    }

    offset += 1
  })
  return { spans, total: offset }
}

type LinesProps = {
  lines: string[]
  spans: Span[]
  lineNumbers: boolean
  typingActive: boolean
  spanRefs: RefObject<(HTMLElement | null)[]>
  lineRefs: RefObject<(HTMLElement | null)[]>
}

const Lines = memo(function Lines({ lines, spans, lineNumbers, typingActive, spanRefs, lineRefs }: LinesProps) {
  const digits = String(lines.length).length
  const clipped: CSSProperties | undefined = typingActive ? { clipPath: CLIPPED } : undefined
  let spanIndex = 0

  return (
    <code className={styles.code} style={{ '--digits': digits } as CSSProperties}>
      {lines.map((line, lineIndex) => {
        const lineSpans: Span[] = []
        while (spanIndex < spans.length && spans[spanIndex].line === lineIndex) lineSpans.push(spans[spanIndex++])
        return (
          <span
            key={`${lineIndex}-${line}`}
            ref={(node) => {
              lineRefs.current[lineIndex] = node
            }}
            className={styles.line}
          >
            {lineNumbers ? (
              <span className={styles.num} aria-hidden="true">
                {lineIndex + 1}
              </span>
            ) : null}
            <span className={styles.text}>
              {lineSpans.map((span) => (
                <span
                  key={span.start}
                  ref={(node) => {
                    spanRefs.current[span.index] = node
                  }}
                  className={span.type === 'text' ? undefined : styles[span.type]}
                  style={clipped}
                >
                  {span.value}
                </span>
              ))}
            </span>
          </span>
        )
      })}
    </code>
  )
})

export default function CodeBlock({
  code,
  language = '',
  title,
  typing = false,
  lineNumbers = true,
  highlight = true,
  copyLabel = copy.copy,
  copiedLabel = copy.copied,
  className = '',
  delay = 0,
  onComplete,
}: CodeBlockProps) {
  const reduce = useReducedMotion()

  const onCompleteRef = useRef(onComplete)
  const completedRef = useRef(false)
  useEffect(() => {
    onCompleteRef.current = onComplete
  })
  const rootRef = useRef<HTMLDivElement>(null)
  const codeRef = useRef<HTMLDivElement>(null)
  const spanRefs = useRef<(HTMLElement | null)[]>([])
  const lineRefs = useRef<(HTMLElement | null)[]>([])
  const timer = useRef<number | undefined>(undefined)
  const inView = useInView(rootRef, { once: true, amount: 0.35 })
  const [done, setDone] = useState(false)
  const [feedback, setFeedback] = useState<'' | 'copied' | 'selected'>('')

  const lines = useMemo(() => code.replace(/\r\n?/g, '\n').replace(/\t/g, '  ').replace(/\n$/, '').split('\n'), [code])
  const { spans, total } = useMemo(() => buildSpans(lines, language, highlight), [lines, language, highlight])

  const typingActive = typing && !reduce && !done

  useEffect(() => {
    if (!typingActive || !inView) return
    const duration = Math.min(4.5, 0.4 + total * 0.02)
    let cursor = 0
    let currentLine = -1

    const render = (value: number) => {
      const chars = Math.floor(value)
      while (cursor < spans.length && spans[cursor].end <= chars) {
        spanRefs.current[cursor]?.style.setProperty('clip-path', 'none')
        cursor++
      }
      const span = spans[cursor]
      if (span && span.start < chars) spanRefs.current[cursor]?.style.setProperty('clip-path', clipFor(chars - span.start))
      const line = span ? span.line : lines.length - 1
      if (line !== currentLine) {
        lineRefs.current[currentLine]?.removeAttribute('data-caret')
        lineRefs.current[line]?.setAttribute('data-caret', 'true')
        currentLine = line
      }
    }

    const controls = animate(0, total, {
      duration,
      delay: Math.max(0, delay),
      ease: 'linear',
      onUpdate: render,
      onComplete: () => {
        lineRefs.current[currentLine]?.removeAttribute('data-caret')
        setDone(true)
        if (!completedRef.current) {
          completedRef.current = true
          onCompleteRef.current?.()
        }
      },
    })
    return () => controls.stop()
  }, [typingActive, inView, spans, total, lines.length, delay])

  const staticReveal = !typing || Boolean(reduce)
  useEffect(() => {
    if (!staticReveal || !inView || completedRef.current) return
    completedRef.current = true
    onCompleteRef.current?.()
  }, [staticReveal, inView])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const onCopy = async () => {
    let next: 'copied' | 'selected' = 'copied'
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      next = 'selected'
      const selection = window.getSelection()
      if (selection && codeRef.current) selection.selectAllChildren(codeRef.current)
    }
    setFeedback(next)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setFeedback(''), 2200)
  }

  const feedbackText = feedback === 'copied' ? copiedLabel : feedback === 'selected' ? copy.selected : ''
  const heading = title ?? copy.title

  return (
    <div ref={rootRef} className={`${styles.block} ${className}`.trim()} data-typing={typingActive ? 'true' : 'false'}>
      <div className={styles.bar}>
        <span className={styles.dots} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className={styles.title}>{heading}</span>
        {language ? (
          <span className={styles.lang} aria-hidden="true">
            {language}
          </span>
        ) : null}
        <button type="button" className={styles.copy} onClick={onCopy} data-state={feedback || undefined}>
          <svg viewBox="0 0 16 16" className={styles.copyIcon} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            {feedback === 'copied' ? <path d="m3.5 8.4 2.9 2.9 6.1-6.3" /> : <path d="M5.5 5.5V3.2c0-.4.3-.7.7-.7h6.6c.4 0 .7.3.7.7v6.6c0 .4-.3.7-.7.7h-2.3M3.2 5.5h6.6c.4 0 .7.3.7.7v6.6c0 .4-.3.7-.7.7H3.2a.7.7 0 0 1-.7-.7V6.2c0-.4.3-.7.7-.7Z" />}
          </svg>
          <span>{feedback === 'copied' ? copiedLabel : copyLabel}</span>
        </button>
        <span className={styles.srOnly} aria-live="polite">
          {feedbackText}
        </span>
      </div>

      <div ref={codeRef} className={styles.scroller} tabIndex={0} role="region" aria-label={heading}>
        <pre className={styles.pre}>
          <Lines lines={lines} spans={spans} lineNumbers={lineNumbers} typingActive={typingActive} spanRefs={spanRefs} lineRefs={lineRefs} />
        </pre>
      </div>
    </div>
  )
}
