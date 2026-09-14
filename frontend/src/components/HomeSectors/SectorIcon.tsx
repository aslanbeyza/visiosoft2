import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import type { SectorIconId } from './homeSectorsCopy.ts'

/**
 * Kullanım alanı çizgi ikonları (32px ızgara, 1.5 kontur). Çizgiler üst öğenin "show" durumunda
 * pathLength ile bir kez çizilir; hareket azaltmada üst öğe initial={false} verdiği için tam görünür.
 */
const icons: Record<SectorIconId, string[]> = {
  street: [
    'M3 27h26',
    'M12 27v-4.5M19 27v-4.5M26 27v-4.5',
    'M7 27V13',
    'M4 4.5h6a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 11V6A1.5 1.5 0 0 1 4 4.5Z',
    'M5.6 10.5v-4h1.9a1.25 1.25 0 0 1 0 2.5H5.6',
    'M14 19.5l1.3-3h5.4l1.3 3M13.5 19.5h9v2.2h-9Z',
  ],
  mall: [
    'M3 27h26',
    'M5 13.5V27M27 13.5V27',
    'M4 13l2.4-6h19.2L28 13',
    'M4 13c1.8 1.8 4.2 1.8 6 0 1.8 1.8 4.2 1.8 6 0 1.8 1.8 4.2 1.8 6 0 1.8 1.8 4.2 1.8 6 0',
    'M12.5 27v-7h7v7M16 20v7',
    'M8 19.5h1.5M22.5 19.5H24',
  ],
  hospital: [
    'M3 27h26',
    'M6 27V9.5h20V27',
    'M11 9.5V5h10v4.5',
    'M16 12v6.5M12.75 15.25h6.5',
    'M13.5 27v-5h5v5',
    'M9 22h1.5M21.5 22H23',
  ],
  campus: [
    'M3 27h26',
    'M4 12.5 16 5l12 7.5Z',
    'M5.5 15.5h21',
    'M8.5 15.5v8M13.5 15.5v8M18.5 15.5v8M23.5 15.5v8',
    'M5 23.5h22',
  ],
  residence: [
    'M3 27h26',
    'M6 27V6.5h10.5V27',
    'M16.5 27V13h9.5v14',
    'M9 10.5h1M12.5 10.5h1M9 14.5h1M12.5 14.5h1M9 18.5h1M12.5 18.5h1',
    'M19.75 17h1M22.25 17h1M19.75 21h1M22.25 21h1',
    'M10.25 27v-4h2v4',
  ],
  truck: [
    'M2.5 21.5v-13h17v13',
    'M19.5 12.5h5.2l3.8 4.5v4.5',
    'M2.5 21.5h2.2M9.3 21.5h12.9M26.8 21.5h1.7',
    'M21.5 14.5h2.6l2.1 2.5h-4.7Z',
    'M7 19.2a2.3 2.3 0 1 1 0 4.6 2.3 2.3 0 1 1 0-4.6ZM24.5 19.2a2.3 2.3 0 1 1 0 4.6 2.3 2.3 0 1 1 0-4.6Z',
    'M3 27h26',
  ],
}

const stroke: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (order: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.9, delay: 0.25 + order * 0.09, ease: revealEase },
      opacity: { duration: 0.01, delay: 0.25 + order * 0.09 },
    },
  }),
}

type SectorIconProps = { id: SectorIconId; className?: string }

export default function SectorIcon({ id, className }: SectorIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      width="32"
      height="32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {icons[id].map((d, order) => (
        <motion.path key={d} d={d} variants={stroke} custom={order} />
      ))}
    </svg>
  )
}
