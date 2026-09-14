import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import { usePageVisible } from '../../hooks/usePageVisible/index.ts'
import BayDiagram from './BayDiagram.tsx'
import BoardLegend from './BoardLegend.tsx'
import { ViolationIcon } from './violationIcons.tsx'
import { violationsCopy } from './violationsCopy.ts'
import type { ViolationId } from './violationsCopy.ts'
import styles from './ViolationBoard.module.css'
import tileStyles from './ViolationTiles.module.css'

const copy = violationsCopy.board
const list = violationsCopy.violations
const CYCLE_MS = 2800
const pad = (n: number) => String(n).padStart(2, '0')

const tileList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
}
// Kartlar hafif eğik ve aşağıdan gelip park eder gibi yerine oturur.
const tileItem: Variants = {
  hidden: (i: number = 0) => ({ opacity: 0, y: 28, rotate: i % 2 === 0 ? -2.5 : 2.5 }),
  show: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.8, ease: revealEase } },
}

/**
 * İhlal panosu (sayfanın imza anı): sekiz ihlal kartı çizgi ikonlarıyla yerine oturur; kartın üzerine gelmek,
 * odaklanmak ya da seçmek park planındaki ilgili bölgeyi vurgular. Etkileşim yokken görünümdeyken sırayla gezinir
 * (duraklat düğmesi var); hareket azaltmada döngü yok, ilk durum sabit gösterilir.
 */
export default function ViolationBoard() {
  const reduce = Boolean(useReducedMotion())
  const rootRef = useRef<HTMLDivElement>(null)
  const played = useInView(rootRef, { once: true, amount: 0.2 })
  const inView = useInView(rootRef, { amount: 0.3 })
  const visible = usePageVisible()
  const [hovered, setHovered] = useState<ViolationId | null>(null)
  const [selected, setSelected] = useState<ViolationId | null>(null)
  const [autoIndex, setAutoIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const running = !reduce && !paused && played && inView && visible && hovered === null && selected === null

  useEffect(() => {
    if (!running) return undefined
    const timer = window.setInterval(() => setAutoIndex((i) => (i + 1) % list.length), CYCLE_MS)
    return () => window.clearInterval(timer)
  }, [running])

  const active: ViolationId | null = hovered ?? selected ?? (played || reduce ? list[autoIndex].id : null)
  const activeLabel = list.find((v) => v.id === active)?.label ?? list[0].label

  const onEnter = (id: ViolationId) => (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse') setHovered(id)
  }

  const toggleAuto = () => {
    if (paused || selected !== null) {
      setSelected(null)
      setPaused(false)
    } else {
      setPaused(true)
    }
  }
  const autoOn = !paused && selected === null

  return (
    <div ref={rootRef} className={styles.board}>
      <figure className={styles.stage}>
        <div className={styles.plan}>
          <BayDiagram active={active} play={played} reduce={reduce} label={copy.diagramLabel} />
        </div>
        <figcaption className={styles.caption}>
          <span className={styles.captionText}>
            <span className={styles.captionLabel}>{copy.selected}</span>
            <strong className={styles.captionValue}>{activeLabel}</strong>
          </span>
          {reduce ? null : (
            <button type="button" className={styles.pause} onClick={toggleAuto} aria-label={autoOn ? copy.pause : copy.play}>
              <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                {autoOn ? <path d="M5.5 3.5v9M10.5 3.5v9" /> : <path d="M5 3.2v9.6L12.6 8z" />}
              </svg>
            </button>
          )}
        </figcaption>
        <BoardLegend items={copy.legend} />
      </figure>

      <motion.ul
        className={tileStyles.tiles}
        aria-label={copy.listLabel}
        variants={tileList}
        initial={reduce ? false : 'hidden'}
        animate={played || reduce ? 'show' : 'hidden'}
      >
        {list.map((v, i) => (
          <motion.li key={v.id} className={tileStyles.item} variants={reduce ? undefined : tileItem} custom={i}>
            <button
              type="button"
              className={tileStyles.tile}
              data-active={active === v.id}
              aria-pressed={selected === v.id}
              onPointerEnter={onEnter(v.id)}
              onPointerLeave={() => setHovered(null)}
              onFocus={() => setHovered(v.id)}
              onBlur={() => setHovered(null)}
              onClick={() => setSelected((s) => (s === v.id ? null : v.id))}
            >
              <span className={tileStyles.index} aria-hidden="true">
                {pad(i + 1)}
              </span>
              <span className={tileStyles.iconTile}>
                <ViolationIcon id={v.id} reduce={reduce} className={tileStyles.icon} />
              </span>
              <span className={tileStyles.label}>{v.label}</span>
              <span className={tileStyles.hint}>{v.hint}</span>
              {running && active === v.id ? (
                <motion.span
                  key={autoIndex}
                  className={tileStyles.timer}
                  aria-hidden="true"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: CYCLE_MS / 1000, ease: 'linear' }}
                />
              ) : null}
            </button>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}
