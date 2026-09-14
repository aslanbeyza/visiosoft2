import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import type { ViolationId } from './violationsCopy.ts'

// Her ihlal için özgün çizgi ikon; yollar üst karttan gelen "show" varyantıyla çizilir.
const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 0.9, delay: 0.15 + i * 0.12, ease: revealEase }, opacity: { duration: 0.2, delay: 0.15 + i * 0.12 } },
  }),
}

const paths: Record<ViolationId, string[]> = {
  evDouble: ['M4 7h24M4 7v18M16 7v18M28 7v18', 'M11 13h10v9H11z', 'm17.5 9.5-3 4.5h3l-3 4.5'],
  doubleSlot: ['M4 7h24M4 7v18M16 7v18M28 7v18', 'M8 13h16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z', 'M11 13v6M21 13v6'],
  lineCross: ['M4 7h24M4 7v18M16 7v18M28 7v18', 'm14.5 10.5 7.2 1.9-3 11.2-7.2-1.9z', 'M12.6 14.9l7.2 1.9'],
  outside: ['M4 7h16M4 7v12M12 7v12M20 7v12', 'M20 22h7a1.5 1.5 0 0 1 1.5 1.5v2A1.5 1.5 0 0 1 27 27h-7a1.5 1.5 0 0 1-1.5-1.5v-2A1.5 1.5 0 0 1 20 22z', 'M8 24h6'],
  disabled: ['M6 5h20v22H6z', 'M15 11.2a1.3 1.3 0 1 0 0-.1', 'M15 13v5h4.5l1.5 4M14 15.5a4.5 4.5 0 1 0 5.2 5.6'],
  fossil: ['M7 25V9a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M5 25h15M9.5 11h6v4h-6z', 'M18 13h2.5a1.5 1.5 0 0 1 1.5 1.5V20a1.5 1.5 0 0 0 3 0v-7l-3-3', 'm26.5 3.5-6 6M20.5 3.5l6 6'],
  marked: ['M6 5h20v22H6z', 'M6 12 13 5M6 19 20 5M6 26 26 6M13 27l13-13M20 27l6-6'],
  rented: ['M6 5h20v22H6z', 'M13.5 16a3.5 3.5 0 1 0 0-.1', 'M17 16h7v3M21.5 16v2.5'],
}

type ViolationIconProps = { id: ViolationId; reduce: boolean; className?: string }

export function ViolationIcon({ id, reduce, className }: ViolationIconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {paths[id].map((d, i) => (
        <motion.path key={d} d={d} custom={i} variants={reduce ? undefined : draw} />
      ))}
    </svg>
  )
}
