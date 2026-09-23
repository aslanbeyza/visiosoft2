import { useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import BayDiagram from './BayDiagram.tsx'
import { violationsCopy } from './violationsCopy.ts'
import type { ViolationId } from './violationsCopy.ts'
import styles from './ViolationBoard.module.css'

const copy = violationsCopy.board
const list = violationsCopy.violations

/** Plan (numaralı rozetler) + aynı numaralı liste; seçim planda slotu vurgular. */
export default function ViolationBoard() {
  const reduce = Boolean(useReducedMotion())
  const rootRef = useRef<HTMLDivElement>(null)
  const played = useInView(rootRef, { once: true, amount: 0.2 })
  const [hovered, setHovered] = useState<ViolationId | null>(null)
  const [selected, setSelected] = useState<ViolationId>(list[0].id)
  /** Hover veya tıklamada rozet nabzını yeniden oynatmak için. */
  const [pulseKey, setPulseKey] = useState(0)

  const activeId = hovered ?? selected

  const bumpPulse = () => setPulseKey((k) => k + 1)

  const handlePreview = (id: ViolationId | null) => {
    setHovered(id)
    if (id !== null) bumpPulse()
  }

  const handleSelect = (id: ViolationId) => {
    setSelected(id)
    bumpPulse()
  }

  const bindHover = (id: ViolationId) => ({
    onPointerEnter: (event: PointerEvent<HTMLButtonElement>) => {
      if (event.pointerType === 'mouse') handlePreview(id)
    },
    onPointerLeave: () => setHovered(null),
    onFocus: () => handlePreview(id),
    onBlur: () => setHovered(null),
  })

  return (
    <div ref={rootRef} className={styles.board}>
      <figure className={styles.stage}>
        <div className={styles.plan}>
          <BayDiagram
            active={activeId}
            play={played}
            reduce={reduce}
            label={copy.diagramLabel}
            pulseKey={pulseKey}
            onSelect={handleSelect}
            onPreview={handlePreview}
          />
        </div>
      </figure>

      <ul className={styles.list} aria-label={copy.listLabel}>
        {list.map((v, i) => (
          <li key={v.id} className={styles.item}>
            <button
              type="button"
              className={styles.row}
              data-active={selected === v.id}
              data-preview={hovered === v.id}
              aria-pressed={selected === v.id}
              onClick={() => handleSelect(v.id)}
              {...bindHover(v.id)}
            >
              <motion.span
                key={activeId === v.id ? `${v.id}-${pulseKey}` : v.id}
                className={styles.badge}
                initial={{ scale: 1 }}
                animate={activeId === v.id && !reduce ? { scale: [1, 1.16, 1] } : { scale: 1 }}
                transition={reduce ? { duration: 0 } : { duration: 0.55, ease: revealEase }}
              >
                {i + 1}
              </motion.span>
              <span className={styles.label}>{v.label}</span>
              <span className={styles.hint}>{v.hint}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
