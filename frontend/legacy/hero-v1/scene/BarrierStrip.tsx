import { motion } from 'framer-motion'

type BarrierStripProps = {
  open: boolean
  loopActive: boolean
  labels: {
    barrier: string
    closed: string
    opening: string
    open: string
    loop: string
    loopBusy: string
    loopFree: string
    cycle: string
    cycleValue: string
  }
  reduce: boolean | null
}

export default function BarrierStrip({ open, loopActive, labels, reduce }: BarrierStripProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/12 bg-[#0d0d12]/90 px-3 py-2.5 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.9)]">
      <div className="relative h-10 w-[4.5rem] shrink-0">
        <span className="absolute bottom-0 left-0 h-2 w-6 rounded-sm bg-[#2c3037]" />
        <span className="absolute bottom-1 left-1 h-7 w-4 rounded-[3px] bg-gradient-to-b from-[#e6e9ed] to-[#b7bdc5]" />
        <span className="absolute bottom-[1.85rem] left-1 h-[0.55rem] w-4 rounded-t-[3px] bg-[#d9232e]" />
        <motion.span
          className="absolute bottom-[1.35rem] left-[0.55rem] h-1.5 w-1.5 rounded-full"
          animate={{ backgroundColor: open ? '#34d399' : '#f87171' }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute bottom-[1.55rem] left-[1.15rem] h-[0.3rem] w-[3.1rem] origin-left"
          initial={false}
          animate={{ rotate: open ? -74 : 0 }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 46, damping: 12 }}
        >
          <span className="absolute inset-0 rounded-r-full bg-[repeating-linear-gradient(108deg,#d9232e_0_6px,#f7f8fa_6px_12px)]" />
          <motion.span
            className="absolute inset-x-[3%] bottom-0 h-[30%] rounded-full"
            animate={{
              backgroundColor: open ? '#22c55e' : '#ef4444',
              boxShadow: open ? '0 0 8px 1px rgba(34,197,94,0.9)' : '0 0 8px 1px rgba(239,68,68,0.85)',
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </div>

      <dl className="grid min-w-0 flex-1 grid-cols-3 gap-2">
        <div className="min-w-0">
          <dt className="truncate text-[0.52rem] uppercase tracking-wide text-white/35 sm:text-[0.58rem]">{labels.barrier}</dt>
          <motion.dd
            animate={{ color: open ? '#6ee7b7' : '#fca5a5' }}
            transition={{ duration: 0.3 }}
            className="truncate text-[0.68rem] font-bold uppercase sm:text-[0.74rem]"
          >
            {open ? labels.open : labels.closed}
          </motion.dd>
        </div>
        <div className="min-w-0">
          <dt className="truncate text-[0.52rem] uppercase tracking-wide text-white/35 sm:text-[0.58rem]">{labels.loop}</dt>
          <dd className="flex items-center gap-1.5 text-[0.68rem] font-semibold text-white/80 sm:text-[0.74rem]">
            <motion.span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              animate={
                reduce
                  ? { backgroundColor: loopActive ? '#22d3ee' : '#4b5563' }
                  : { backgroundColor: loopActive ? '#22d3ee' : '#4b5563', opacity: loopActive ? [1, 0.35, 1] : 1 }
              }
              transition={{ duration: 1.2, repeat: loopActive ? Infinity : 0, ease: 'easeInOut' }}
            />
            <span className="truncate">{loopActive ? labels.loopBusy : labels.loopFree}</span>
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="truncate text-[0.52rem] uppercase tracking-wide text-white/35 sm:text-[0.58rem]">{labels.cycle}</dt>
          <dd className="truncate font-mono text-[0.68rem] font-semibold text-white/80 sm:text-[0.74rem]">{labels.cycleValue}</dd>
        </div>
      </dl>
    </div>
  )
}
