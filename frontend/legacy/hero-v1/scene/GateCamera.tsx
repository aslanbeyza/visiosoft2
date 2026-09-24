import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { ScenePhase } from './timeline.ts'

type GateCameraProps = {
  phase: ScenePhase
  plate: string
  ledLines: [string, string, string]
  plateLocked: boolean
  scanning: boolean
  kioskActive: boolean
  kioskPaid: boolean
  cameraId: string
  timestamp: string
  reduce: boolean | null
  children?: ReactNode
}

const PLATE_BOX = { left: '14.44%', top: '78.33%', width: '9.81%', height: '5.11%' }
const PLATE_BOX_OUTER = { left: '13.19%', top: '75.84%', width: '12.30%', height: '10.20%' }
const LED_BOX = { left: '59.69%', top: '42.56%', width: '11.06%', height: '17.33%' }

const KIOSK_SCREEN_BOX = { left: '76.19%', top: '53.44%', width: '2.63%', height: '3.78%' }

const CAMERA_HEAD = { left: '44.6%', top: '33.0%' }

function PlateOverlay({ plate }: { plate: string }) {
  return (
    <svg viewBox="0 0 156 45" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="plateSheen" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.14" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="156" height="45" rx="3" fill="#20242a" />
      <rect x="1.5" y="1.5" width="153" height="42" rx="2" fill="#e9ebe9" />
      <rect x="2.5" y="2.5" width="12" height="40" rx="1" fill="#1140c4" />
      <text x="8.5" y="31" textAnchor="middle" fontSize="7" fontWeight="700" fill="#ffffff" fontFamily="Inter, sans-serif">
        TR
      </text>
      <text
        x="86"
        y="34"
        textAnchor="middle"
        fontSize="27"
        fontWeight="700"
        fill="#141618"
        fontFamily="ui-monospace, SFMono-Regular, monospace"
        textLength="128"
        lengthAdjust="spacingAndGlyphs"
      >
        {plate}
      </text>
      <rect x="1.5" y="1.5" width="153" height="42" rx="2" fill="url(#plateSheen)" />
    </svg>
  )
}

function LedSignOverlay({ lines }: { lines: [string, string, string] }) {
  return (
    <svg viewBox="0 0 171 145" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id="ledGrid" width="2.4" height="2.4" patternUnits="userSpaceOnUse">
          <rect width="2.4" height="2.4" fill="none" />
          <rect width="2.4" height="0.9" fill="#000000" opacity="0.5" />
          <rect width="0.9" height="2.4" fill="#000000" opacity="0.5" />
        </pattern>
        <filter id="ledGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="0" y="0" width="171" height="145" fill="#08120c" />
      <g filter="url(#ledGlow)" fill="#79f5ae" fontFamily="Inter, Arial, sans-serif" fontWeight="700" textAnchor="middle">
        {lines.map((line, index) => {
          const size = Math.min(15, 152 / Math.max(line.length * 0.62, 1))
          return (
            <text key={`${index}-${line}`} x="85.5" y={45 + index * 36} fontSize={size}>
              {line}
            </text>
          )
        })}
      </g>
      <rect x="0" y="0" width="171" height="145" fill="url(#ledGrid)" />
    </svg>
  )
}

export default function GateCamera({
  phase,
  plate,
  ledLines,
  plateLocked,
  scanning,
  kioskActive,
  kioskPaid,
  cameraId,
  timestamp,
  reduce,
  children,
}: GateCameraProps) {
  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-[1.35rem] border border-white/10 bg-black">
      <motion.div
        className="absolute inset-0"
        animate={reduce ? undefined : { scale: [1, 1.05] }}
        transition={{ duration: 22, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      >
        <img
          src="/img/hero/exit-gate-cam.jpg"
          alt=""
          width={1600}
          height={900}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute rotate-[3.8deg]" style={PLATE_BOX}>
          <PlateOverlay plate={plate} />
        </div>

        <div className="absolute -rotate-[1deg] overflow-hidden" style={LED_BOX}>
          <LedSignOverlay lines={ledLines} />
        </div>

        <motion.div
          className="absolute rounded-[1px]"
          style={KIOSK_SCREEN_BOX}
          animate={{
            backgroundColor: kioskPaid ? 'rgba(34,197,94,0.75)' : kioskActive ? 'rgba(56,189,248,0.6)' : 'rgba(226,232,240,0.35)',
            boxShadow: kioskActive || kioskPaid ? '0 0 10px 2px rgba(56,189,248,0.5)' : '0 0 0 0 rgba(0,0,0,0)',
          }}
          transition={{ duration: 0.4 }}
        />

        <motion.svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
          initial={false}
          animate={{ opacity: scanning || plateLocked ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          aria-hidden="true"
        >
          <line
            x1="43.8"
            y1="35.5"
            x2="21.5"
            y2="79.5"
            stroke="#67e8f9"
            strokeWidth="1.2"
            strokeDasharray="5 4"
            strokeOpacity="0.75"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx="21.5" cy="79.5" r="1.1" fill="#67e8f9" fillOpacity="0.9" />
        </motion.svg>

        <motion.div
          initial={false}
          animate={{ opacity: plateLocked ? 1 : 0, scale: plateLocked ? 1 : 1.35 }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          className="absolute rotate-[3.8deg]"
          style={PLATE_BOX_OUTER}
        >
          {[
            'left-0 top-0 border-l-2 border-t-2',
            'right-0 top-0 border-r-2 border-t-2',
            'left-0 bottom-0 border-b-2 border-l-2',
            'right-0 bottom-0 border-b-2 border-r-2',
          ].map((position) => (
            <span key={position} className={`absolute h-2 w-2 border-cyan-300 sm:h-2.5 sm:w-2.5 ${position}`} />
          ))}
          <span className="absolute inset-0 bg-cyan-300/10 shadow-[0_0_22px_rgba(34,211,238,0.55)]" />
        </motion.div>
      </motion.div>

      {!reduce && scanning ? (
        <motion.div
          key={`scan-${phase}`}
          initial={{ top: '4%', opacity: 0 }}
          animate={{ top: ['4%', '88%'], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
          className="pointer-events-none absolute inset-x-0 h-14 bg-[linear-gradient(180deg,transparent,rgba(56,189,248,0.16),rgba(125,211,252,0.55))]"
        >
          <span className="absolute inset-x-0 bottom-0 h-px bg-cyan-100 shadow-[0_0_18px_4px_rgba(103,232,249,0.8)]" />
        </motion.div>
      ) : null}

      <span
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.14)_0px,rgba(0,0,0,0.14)_1px,transparent_1px,transparent_3px)] opacity-45"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(0,0,0,0.55)_100%)]"
        aria-hidden="true"
      />

      <motion.span
        className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border border-cyan-300/50 bg-black/60 px-1.5 py-[2px] text-[0.45rem] font-bold uppercase tracking-wider text-cyan-200 backdrop-blur-sm sm:text-[0.55rem]"
        style={CAMERA_HEAD}
        initial={false}
        animate={{ opacity: plateLocked || scanning ? 1 : 0.45 }}
        transition={{ duration: 0.35 }}
      >
        <motion.span
          className="h-1 w-1 rounded-full bg-cyan-300"
          animate={reduce ? undefined : { opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        ALPR
      </motion.span>

      <span className="pointer-events-none absolute right-1.5 top-1 font-mono text-[0.55rem] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.95)] sm:right-2 sm:text-[0.7rem]">
        {timestamp}
      </span>
      <span className="pointer-events-none absolute bottom-1.5 left-1.5 bg-black/85 px-1.5 py-0.5 font-mono text-[0.5rem] text-white sm:bottom-2 sm:left-2 sm:text-[0.62rem]">
        {cameraId}
      </span>

      {children}
    </div>
  )
}
