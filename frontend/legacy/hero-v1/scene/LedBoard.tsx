import { motion } from 'framer-motion'

type LedBoardProps = {
  lines: [string, string, string]
  title: string
  colTime: string
  colPrice: string
  rows: { time: string; price: string }[]
  highlight: string | null
  stand?: boolean
  reduce: boolean | null
}

/** Saha LED tarife panosu — üstte nokta matris ekran, altta ücret tarifesi. */
export default function LedBoard({ lines, title, colTime, colPrice, rows, highlight, stand = false, reduce }: LedBoardProps) {
  return (
    <div className={stand ? 'flex flex-col' : 'contents'}>
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-b from-[#f3f5f7] to-[#c9ced5] p-1.5 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.9)]">
      <div className="relative overflow-hidden rounded-xl bg-[#08080a] px-2 py-2">
        <div className="flex flex-col items-center gap-[2px] font-mono text-[0.6rem] font-bold uppercase leading-none tracking-[0.14em] text-[#ff3b30] [text-shadow:0_0_7px_rgba(255,59,48,0.85)] sm:text-[0.66rem]">
          {lines.map((line, index) => (
            <motion.span
              key={`${index}-${line}`}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.06 }}
              className="block truncate"
            >
              {line || '—'}
            </motion.span>
          ))}
        </div>
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.6)_1px,transparent_1.15px)] bg-[size:3px_3px]" />
      </div>

      <div className="mt-1.5 flex items-center justify-center gap-1 rounded-lg bg-[#1b2333] py-1.5">
        <span className="text-[0.6rem] font-extrabold uppercase tracking-tight text-white sm:text-[0.68rem]">İSTAY</span>
        <span className="relative flex h-3.5 w-3.5 items-center justify-center">
          <svg viewBox="0 0 24 24" className="absolute h-3.5 w-3.5 text-[#d9232e]" fill="currentColor" aria-hidden="true">
            <path d="M12 2c-4 0-7 3-7 6.8 0 5 7 13.2 7 13.2s7-8.2 7-13.2C19 5 16 2 12 2z" />
          </svg>
          <span className="relative -mt-[2px] text-[0.5rem] font-extrabold leading-none text-white">P</span>
        </span>
        <span className="text-[0.6rem] font-extrabold uppercase tracking-tight text-white sm:text-[0.68rem]">PARK</span>
      </div>
      <span className="sr-only">{title}</span>

      <table className="mt-1.5 w-full border-collapse text-[0.58rem] sm:text-[0.64rem]">
        <thead>
          <tr className="bg-[#1f2937] text-white">
            <th className="px-2 py-1 text-left font-semibold uppercase tracking-wide">{colTime}</th>
            <th className="px-2 py-1 text-right font-semibold uppercase tracking-wide">{colPrice}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const active = highlight === row.time
            return (
              <tr
                key={row.time}
                className={
                  active
                    ? 'bg-[#d9232e] text-white'
                    : index % 2 === 0
                      ? 'bg-white/85 text-[#1f2937]'
                      : 'bg-[#e6e9ed]/85 text-[#1f2937]'
                }
              >
                <td className="px-2 py-[3px] font-medium">{row.time}</td>
                <td className="px-2 py-[3px] text-right font-bold tabular-nums">{row.price}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <span className="mx-auto mt-1.5 h-1.5 w-1/3 rounded-b-md bg-[#d9232e]" />
    </div>
    {stand ? (
      <>
        <span className="mx-auto h-8 w-[18%] bg-gradient-to-b from-[#d9232e] to-[#9c151d] shadow-[0_10px_20px_-10px_rgba(0,0,0,0.9)]" />
        <span className="mx-auto h-2 w-[46%] rounded-[2px] bg-gradient-to-b from-[#c11c26] to-[#7d1016]" />
      </>
    ) : null}
    </div>
  )
}
