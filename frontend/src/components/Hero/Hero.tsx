import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { usePath } from '../../hooks/usePath/index.ts'
import { heroCopy } from './heroCopy.ts'
import { cueAt, cues, heroVideo } from './heroTimeline.ts'
import type { Cue, CueId, Tone } from './heroTimeline.ts'
import styles from './Hero.module.css'

const easeApple = [0.25, 1, 0.5, 1] as const
const PLATE = '34 PBB 261'

const tones: Record<Tone, { dot: string; text: string }> = {
  sky: { dot: 'bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.9)]', text: 'text-sky-100' },
  emerald: { dot: 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]', text: 'text-emerald-100' },
  amber: { dot: 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]', text: 'text-amber-100' },
  neutral: { dot: 'bg-white/80', text: 'text-white/85' },
}

type Detail = 'scan' | 'plate' | 'pay' | 'gate'

function detailOf(id: CueId): Detail {
  if (id === 'locked') return 'plate'
  if (id === 'kioskWait' || id === 'paid') return 'pay'
  if (id === 'open') return 'gate'
  return 'scan'
}

/** Kamera OSD saati (HH:MM:SS). */
function useClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const pad = (value: number) => String(value).padStart(2, '0')
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

function Arrow({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <span className="flex flex-col leading-tight">
      <span className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-white/40">{label}</span>
      <span className={`mt-0.5 text-sm font-bold ${accent ? 'text-emerald-300' : 'text-white'}`}>{value}</span>
    </span>
  )
}

const swap = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
}

export default function Hero() {
  const path = usePath()
  const reduce = useReducedMotion()
  const text = heroCopy
  const clock = useClock()

  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const inView = useInView(sectionRef, { amount: 0.15 })
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ['polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', 'polygon(12% 0%, 78% 0%, 92% 88%, 0% 96%)'],
  )

  const [cue, setCue] = useState<Cue>(cues[0])
  const [playing, setPlaying] = useState(false)
  const [mobile] = useState(() => window.matchMedia('(max-width: 640px)').matches)
  const [wide, setWide] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)')
    const apply = () => setWide(query.matches)
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])

  // Video zamanını durum satırına eşle.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let frame = 0
    let lastCue: CueId | null = null

    const tick = () => {
      const next = cueAt(video.currentTime)
      if (next.id !== lastCue) {
        lastCue = next.id
        setCue(next)
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  // Görünürken oynat, görünmezken duraklat; hareket azaltma tercihinde otomatik oynatma yok.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (reduce || !inView) {
      video.pause()
      return
    }
    video.muted = true
    video.play().catch(() => undefined)
  }, [inView, reduce])

  const tone = tones[cue.tone]
  const detail = detailOf(cue.id)
  const sources = mobile ? heroVideo.mobile : heroVideo.desktop

  const rise = {
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section ref={sectionRef} className={styles.shell}>
      <h1 className={styles.echo} aria-hidden="true">
        {text.title[0]}
      </h1>
      <motion.div className={styles.frame} style={reduce || !wide ? undefined : { clipPath }}>
        <div className="relative isolate overflow-hidden bg-[#06070b] text-white">
      <div className="absolute inset-0" aria-hidden="true">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          poster={heroVideo.poster}
          muted
          playsInline
          loop
          autoPlay={!reduce}
          preload={mobile ? 'metadata' : 'auto'}
          disablePictureInPicture
          tabIndex={-1}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          {sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,7,11,0.9)_0%,rgba(6,7,11,0.6)_38%,rgba(6,7,11,0.3)_62%,rgba(6,7,11,0.85)_100%)] lg:hidden" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(6,7,11,0.94)_0%,rgba(6,7,11,0.72)_30%,rgba(6,7,11,0.28)_58%,rgba(6,7,11,0.06)_100%)] lg:block" />
        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#06070b] via-[#06070b]/70 to-transparent lg:h-[58%] lg:via-[#06070b]/75" />
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/60 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] w-[min(80rem,calc(100%-2rem))] flex-col pb-8 pt-28 sm:pt-32 lg:pb-10 lg:pt-36">
        <div className="grid flex-1 items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }}
            className="max-w-2xl"
          >
            <motion.h1
              variants={rise}
              transition={{ duration: 0.7, ease: easeApple }}
              className="mt-6 font-bold leading-[1.02] tracking-[-0.035em] text-[clamp(2.4rem,5.8vw,4.4rem)]"
            >
              {text.title.map((line, index) => (
                <span key={line} className={`block ${index > 0 ? 'mt-2 text-[clamp(1.35rem,3vw,2.15rem)] font-semibold tracking-[-0.03em] text-white/90' : ''}`}>
                  {line}
                </span>
              ))}
            </motion.h1>

            <motion.p
              variants={rise}
              transition={{ duration: 0.7, ease: easeApple }}
              className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-white/60 sm:text-lg"
            >
              {text.description}
            </motion.p>

            <motion.div variants={rise} transition={{ duration: 0.7, ease: easeApple }} className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to={path('quote.index')}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#0071e3] px-6 py-3.5 text-[0.95rem] font-semibold text-white shadow-[0_18px_40px_-14px_rgba(0,113,227,0.9)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0077ed] focus-visible:ring-2 focus-visible:ring-sky-300 sm:px-7"
              >
                {text.primary}
                <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to={path('hardware-products')}
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-6 py-3.5 text-[0.95rem] font-semibold text-white/85 backdrop-blur-md outline-none transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.1] hover:text-white focus-visible:ring-2 focus-visible:ring-sky-400/70 sm:px-7"
              >
                {text.secondary}
                <Arrow className="h-4 w-4 opacity-60 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.ul variants={rise} transition={{ duration: 0.7, ease: easeApple }} className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-[0.95rem] font-medium leading-snug text-white/90">
              {text.proof.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.7)]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeApple, delay: 0.5 }}
            className="flex justify-start lg:justify-end"
          >
            <div
              className="w-full max-w-[22rem] rounded-2xl border border-white/12 bg-[#0b0c12]/70 p-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.95)] backdrop-blur-xl"
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center justify-between gap-3 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white/45">
                <span className="flex shrink-0 items-center gap-1.5 text-emerald-300">
                  <span className="relative flex h-1.5 w-1.5">
                    {reduce || !playing ? null : <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />}
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  {text.hud.live}
                </span>
                <span className="truncate">{text.hud.camera}</span>
                <span className="shrink-0 font-mono tabular-nums text-white/35">{clock}</span>
              </div>

              <div className="mt-3 flex min-h-[2.5rem] items-center">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={cue.id}
                    {...swap}
                    transition={{ duration: 0.25, ease: easeApple }}
                    className="flex items-center gap-2.5"
                  >
                    <span className={`h-2 w-2 shrink-0 rounded-full ${tone.dot}`} />
                    <span className={`text-[0.95rem] font-semibold leading-snug ${tone.text}`}>{text.cues[cue.id]}</span>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-3 flex min-h-[3.1rem] items-center border-t border-white/10 pt-3">
                <AnimatePresence mode="wait" initial={false}>
                  {detail === 'scan' ? (
                    <motion.div key="scan" {...swap} transition={{ duration: 0.25 }} className="flex w-full items-center gap-3">
                      <span className="relative flex items-center overflow-hidden rounded-[5px] bg-white/90 shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
                        <span className="bg-[#1140c4] px-1.5 py-1.5 text-[0.55rem] font-bold text-white">TR</span>
                        <span className="relative px-2 py-1 font-mono text-[0.95rem] font-bold tracking-[0.18em] text-slate-400">
                          {cue.id === 'scan' ? '34 ··· ···' : '·· ··· ···'}
                        </span>
                        {reduce ? null : (
                          <motion.span
                            className="pointer-events-none absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-sky-300/55 to-transparent"
                            animate={{ x: ['-120%', '280%'] }}
                            transition={{ duration: 1.4, ease: 'easeInOut', repeat: Infinity }}
                          />
                        )}
                      </span>
                      <span className="text-[0.7rem] leading-tight text-white/55">
                        <span className="block text-sm font-bold text-sky-300">{cue.id === 'scan' ? '…' : '—'}</span>
                        {cue.id === 'scan' ? text.hud.scanning : text.hud.waiting}
                      </span>
                    </motion.div>
                  ) : detail === 'plate' ? (
                    <motion.div key="plate" {...swap} transition={{ duration: 0.25 }} className="flex items-center gap-3">
                      <span className="flex items-center overflow-hidden rounded-[5px] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
                        <span className="bg-[#1140c4] px-1.5 py-1.5 text-[0.55rem] font-bold text-white">TR</span>
                        <span className="px-2 py-1 font-mono text-[0.95rem] font-bold tracking-wider text-slate-900">{PLATE}</span>
                      </span>
                      <span className="text-[0.7rem] leading-tight text-white/55">
                        <span className="block text-sm font-bold text-emerald-300">{text.hud.confidenceValue}</span>
                        {text.hud.confidence}
                      </span>
                    </motion.div>
                  ) : detail === 'pay' ? (
                    <motion.div key="pay" {...swap} transition={{ duration: 0.25 }} className="flex w-full items-center gap-5">
                      <Stat label={text.hud.duration} value={text.hud.durationValue} />
                      <Stat label={text.hud.amount} value={text.hud.amountValue} />
                      <span
                        className={`ml-auto rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider ${
                          cue.id === 'paid' ? 'bg-emerald-400/15 text-emerald-300' : 'bg-amber-400/15 text-amber-200'
                        }`}
                      >
                        {cue.id === 'paid' ? text.hud.paid : text.hud.tapCard}
                      </span>
                    </motion.div>
                  ) : detail === 'gate' ? (
                    <motion.div key="gate" {...swap} transition={{ duration: 0.25 }} className="flex w-full items-center gap-5">
                      <Stat label={text.hud.barrier} value={text.hud.barrierOpen} accent />
                      <Stat label={text.hud.amount} value={text.hud.amountValue} />
                      <span className="ml-auto rounded-full bg-emerald-400/15 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-emerald-300">
                        {text.hud.paid} · {text.hud.openTime}
                      </span>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
        </div>
      </motion.div>
    </section>
  )
}
