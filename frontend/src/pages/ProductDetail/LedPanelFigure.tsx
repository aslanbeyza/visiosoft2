import { motion } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'

type LedPanelFigureProps = {
  alt: string
  reduce: boolean
  className?: string

  delay?: number

  decorative?: boolean
}

const COLS = 26
const ROWS = 11
const PITCH = 24
const ORIGIN_X = 58
const ORIGIN_Y = 108

const litCells: [number, number][] = [
  ...Array.from({ length: 9 }, (_, row): [number, number] => [3, row + 1]),
  ...[4, 5, 6, 7].map((col): [number, number] => [col, 1]),
  ...[4, 5, 6, 7].map((col): [number, number] => [col, 5]),
  [8, 2],
  [8, 3],
  [8, 4],
  ...Array.from({ length: 10 }, (_, index): [number, number] => [12 + index, 5]),
  [18, 2],
  [19, 3],
  [20, 4],
  [22, 5],
  [20, 6],
  [19, 7],
  [18, 8],
]

const cellX = (col: number) => ORIGIN_X + col * PITCH
const cellY = (row: number) => ORIGIN_Y + row * PITCH

export default function LedPanelFigure({ alt, reduce, className, delay = 1.3, decorative = false }: LedPanelFigureProps) {
  const a11y = decorative ? { 'aria-hidden': true, focusable: false } : { role: 'img', 'aria-label': alt }
  return (
    <svg className={className} viewBox="0 0 715 1900" preserveAspectRatio="xMidYMid meet" {...a11y}>
      {}
      <rect x="220" y="1392" width="275" height="508" fill="#c62828" />
      <rect x="220" y="1392" width="275" height="508" fill="none" stroke="#0f1430" strokeWidth="4" />
      <rect x="238" y="1392" width="24" height="508" fill="rgb(255 255 255 / 0.14)" />

      {}
      <rect x="2" y="2" width="711" height="1396" rx="58" fill="#f3f4f7" stroke="#0f1430" strokeWidth="4" />
      <rect x="22" y="22" width="671" height="1356" rx="44" fill="none" stroke="#c3c7d4" strokeWidth="2" />

      {}
      <rect x="40" y="88" width="635" height="284" rx="12" fill="#161a2c" />
      <g>
        {Array.from({ length: COLS * ROWS }, (_, index) => (
          <circle key={index} cx={cellX(index % COLS)} cy={cellY(Math.floor(index / COLS))} r="6.5" fill="#343a52" />
        ))}
      </g>
      <g>
        {litCells.map(([col, row]) => (
          <motion.circle
            key={`${col}-${row}`}
            cx={cellX(col)}
            cy={cellY(row)}
            r="7.5"
            fill="#dfe2f7"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: delay + col * 0.045, ease: revealEase }}
          />
        ))}
      </g>

      {}
      <rect x="40" y="404" width="635" height="946" rx="40" fill="#ffffff" stroke="#9aa0b4" strokeWidth="3" />
      <path d="M92 1290 L300 460" stroke="#eef0fb" strokeWidth="26" strokeLinecap="round" />
      <path d="M170 1300 L360 540" stroke="#f5f6fb" strokeWidth="12" strokeLinecap="round" />
    </svg>
  )
}
