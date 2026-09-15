import { useRef } from 'react'
import type { PointerEvent } from 'react'
import FlagshipCanvas from './FlagshipCanvas.tsx'
import type { Flagship } from './flagships.ts'
import { homeFlagshipsCopy as text } from './homeFlagshipsCopy.ts'
import styles from './FlagshipStage.module.css'

type FlagshipStageProps = {
  items: Flagship[]
  active: number
  onStep: (direction: 1 | -1) => void
}

const SWIPE_MIN = 48

/** Büyük ürün sahnesi: yatay kaydırma ile ürün değişir, dikey sayfa kaydırması korunur. */
export default function FlagshipStage({ items, active, onStep }: FlagshipStageProps) {
  const start = useRef<{ x: number; y: number } | null>(null)

  const down = (event: PointerEvent<HTMLDivElement>) => {
    start.current = { x: event.clientX, y: event.clientY }
  }
  const up = (event: PointerEvent<HTMLDivElement>) => {
    const from = start.current
    start.current = null
    if (!from) return
    const dx = event.clientX - from.x
    const dy = event.clientY - from.y
    if (Math.abs(dx) >= SWIPE_MIN && Math.abs(dx) > Math.abs(dy) * 1.2) onStep(dx < 0 ? 1 : -1)
  }

  return (
    <div
      className={styles.shell}
      onPointerDown={down}
      onPointerUp={up}
      onPointerCancel={() => (start.current = null)}
    >
      <p className="sr-only">{text.swipeHint}</p>
      <FlagshipCanvas items={items} active={active} />
      <button type="button" className={styles.prev} aria-label={text.previous} onClick={() => onStep(-1)}>
        <Arrow direction={-1} />
      </button>
      <button type="button" className={styles.next} aria-label={text.next} onClick={() => onStep(1)}>
        <Arrow direction={1} />
      </button>
    </div>
  )
}

function Arrow({ direction }: { direction: 1 | -1 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={direction === 1 ? 'M5 12h14M13 6l6 6-6 6' : 'M19 12H5M11 6l-6 6 6 6'} />
    </svg>
  )
}
