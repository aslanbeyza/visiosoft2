import { AnimatePresence, motion } from 'framer-motion'
import type { ScenePhase } from './timeline.ts'

type KioskPanelProps = {
  phase: ScenePhase
  plate: string
  labels: {
    title: string
    plateRead: string
    statusLabel: string
    farewell: string
    entry: string
    exit: string
    duration: string
    total: string
    tapCard: string
    processing: string
    approved: string
    receipt: string
    waiting: string
    inCar: string
    methods: string
  }
  values: { entry: string; exit: string; duration: string; amount: string }
  reduce: boolean | null
}

const easeApple = [0.25, 1, 0.5, 1] as const

export default function KioskPanel({ phase, plate, labels, values, reduce }: KioskPanelProps) {
  const isPaying = phase === 'paying'
  const isPaid = phase === 'paid' || phase === 'open' || phase === 'pass' || phase === 'closing'
  const isReady = phase === 'kiosk'
  const plateRead = phase !== 'approach' && phase !== 'scan'
  const status = isPaid ? labels.approved : isPaying ? labels.processing : isReady ? labels.tapCard : labels.waiting

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#08080a] p-2 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.9)]">
      <div className="flex items-center justify-between gap-2 px-0.5 pb-1.5">
        <span className="flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-wider text-white/45 sm:text-[0.66rem]">
          <span className="rounded-[3px] bg-gradient-to-b from-[#e0242f] to-[#a5141d] px-1 py-[2px] text-[0.5rem] font-bold tracking-[0.08em] text-white">
            TOGER
          </span>
          {labels.title}
        </span>
        <span className="flex items-center gap-1 text-[0.5rem] uppercase tracking-wide text-white/30 sm:text-[0.55rem]">
          <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 16V6h11v10M14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          </svg>
          {labels.inCar}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b1014]">
        <div className="border-b border-white/[0.08] px-2.5 py-1.5">
          <p className="text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-white/35 sm:text-[0.56rem]">
            {labels.plateRead}
          </p>
          <motion.span
            initial={false}
            animate={{ opacity: plateRead ? 1 : 0.25 }}
            transition={{ duration: 0.3 }}
            className="mt-1 flex w-fit items-center overflow-hidden rounded-[4px] bg-white"
          >
            <span className="bg-[#1140c4] px-1 py-1 text-[0.5rem] font-bold text-white">TR</span>
            <span className="px-1.5 py-0.5 font-mono text-[0.78rem] font-bold tracking-wide text-slate-900 sm:text-[0.9rem]">
              {plate}
            </span>
          </motion.span>
        </div>

        <div className="px-2.5 py-1.5">
          <p className="text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-white/35 sm:text-[0.56rem]">
            {labels.statusLabel}
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={status}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: easeApple }}
              className={`mt-0.5 text-[0.78rem] font-bold uppercase tracking-wide sm:text-[0.86rem] ${
                isPaid ? 'text-emerald-400 [text-shadow:0_0_10px_rgba(52,211,153,0.55)]' : isPaying ? 'text-sky-300' : 'text-white/70'
              }`}
            >
              {status}
            </motion.p>
          </AnimatePresence>
          <motion.p
            initial={false}
            animate={{ opacity: isPaid ? 1 : 0 }}
            transition={{ duration: 0.35 }}
            className="mt-0.5 text-[0.68rem] font-bold uppercase tracking-wide text-emerald-400 [text-shadow:0_0_10px_rgba(52,211,153,0.5)] sm:text-[0.76rem]"
          >
            {labels.farewell}
          </motion.p>
        </div>
      </div>

      <dl className="mt-1.5 grid grid-cols-3 gap-1.5">
        {[
          { k: labels.entry, v: values.entry },
          { k: labels.exit, v: values.exit },
          { k: labels.duration, v: values.duration },
        ].map((item) => (
          <div key={item.k} className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-1.5 py-1">
            <dt className="truncate text-[0.52rem] uppercase tracking-wide text-white/35 sm:text-[0.58rem]">{item.k}</dt>
            <dd className="mt-0.5 font-mono text-[0.68rem] font-semibold text-white/85 sm:text-[0.75rem]">{item.v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-1.5 flex items-end justify-between gap-2 rounded-xl bg-white px-2.5 py-1.5">
        <span className="text-[0.55rem] font-semibold uppercase tracking-wide text-slate-500 sm:text-[0.62rem]">{labels.total}</span>
        <span className="font-mono text-lg font-bold leading-none text-slate-900 sm:text-xl">{values.amount}</span>
      </div>

      <div className="relative mt-1.5 flex items-center gap-2 overflow-hidden rounded-xl border border-white/[0.07] bg-black/40 px-2.5 py-1.5">
        <span className="relative flex h-7 w-9 shrink-0 items-center justify-center rounded-md border border-white/15 bg-[#151a22]">
          <span className="h-[3px] w-5 rounded-full bg-white/25" />
          <motion.span
            className="absolute inset-0 rounded-md"
            animate={
              reduce
                ? { boxShadow: 'none' }
                : {
                    boxShadow: isPaying
                      ? ['0 0 0 0 rgba(56,189,248,0.5)', '0 0 0 8px rgba(56,189,248,0)']
                      : '0 0 0 0 rgba(56,189,248,0)',
                  }
            }
            transition={{ duration: 1.1, repeat: isPaying ? Infinity : 0, ease: 'easeOut' }}
          />
        </span>

        <span className={`min-w-0 truncate text-[0.62rem] font-semibold sm:text-[0.7rem] ${isPaid ? 'text-emerald-300' : 'text-white/60'}`}>
          {isPaid ? labels.receipt : isReady || isPaying ? labels.tapCard : labels.methods}
        </span>

        {isPaid ? (
          <motion.svg
            viewBox="0 0 24 24"
            className="ml-auto h-4 w-4 shrink-0 text-emerald-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M20 6L9 17l-5-5"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, ease: easeApple }}
            />
          </motion.svg>
        ) : null}

        {!reduce && (isReady || isPaying) ? (
          <motion.span
            className="pointer-events-none absolute left-1.5 top-1/2 h-5 w-8 -translate-y-1/2 rounded-[3px] border border-white/25 bg-gradient-to-br from-[#3b82f6] to-[#1e3a8a] shadow-lg"
            initial={{ x: 120, opacity: 0, rotate: -8 }}
            animate={isPaying ? { x: 0, opacity: 1, rotate: 0 } : { x: 120, opacity: 0, rotate: -8 }}
            transition={{ duration: 0.55, ease: easeApple }}
          >
            <span className="absolute left-1 top-1 h-1.5 w-2 rounded-[1px] bg-amber-300/90" />
          </motion.span>
        ) : null}
      </div>

    </div>
  )
}
