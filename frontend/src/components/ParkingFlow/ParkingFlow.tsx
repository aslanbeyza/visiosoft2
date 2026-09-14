import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import type { AnimationPlaybackControls } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import { useMediaQuery } from '../../hooks/useMediaQuery/index.ts'
import { usePageVisible } from '../../hooks/usePageVisible/index.ts'
import { leaders } from './leaders.ts'
import ParkingFlowScene from './ParkingFlowScene.tsx'
import { parkingFlowCopy as text } from './parkingFlowCopy.ts'
import type { ParkingFlowDevice } from './parkingFlowCopy.ts'
import {
  CAR_START,
  COMPACT_BELOW,
  COMPACT_VIEW,
  SCENE_HEIGHT,
  SCENE_WIDTH,
  activeIndexAt,
  progressForStep,
  sceneAt,
} from './scene.ts'
import type { ParkingFlowStepId } from './scene.ts'
import styles from './ParkingFlow.module.css'

/**
 * Kullanım:
 * `<ParkingFlow steps={parkingFlowSteps} mode="scroll" />` — kaydırdıkça ilerleyen, sabitlenen sahne
 * `<ParkingFlow steps={steps} mode="auto" tone="dark" />` — görünürken kendi kendine dönen, duraklatılabilir döngü
 * `<ParkingFlow steps={steps} mode="manual" active="pay" highlight="kiosk" />` — ebeveynin yönettiği adım + cihaz vurgusu
 * `<ParkingFlow steps={steps} mode="manual" active="detect" barrier="closed" />` — 404: bariyer kapalı, araç bekler
 * Sahne (M8): şeritte ilerleyen araç, direkteki kamera konisi plakayı okur, ayraç çizilir, kontrol kutusuna darbe iner,
 * kiosk ekranı lacivertten (işlem) yeşile (ödeme tamam) döner, bariyer kolu −80° kalkar ve araç geçer.
 * Adım etiketleri gerçek DOM'dur (<ol>), aria-current ile eşitlenir. Hareket azaltma: son kare, tüm cihazlar görünür.
 */
export type ParkingFlowStep = { id: ParkingFlowStepId; title: string; description: string }

export type ParkingFlowProps = {
  steps: ParkingFlowStep[]
  mode?: 'scroll' | 'auto' | 'manual'
  highlight?: ParkingFlowDevice
  tone?: 'light' | 'dark'
  showLabels?: boolean
  className?: string
  /** manual: etkin adım (sıra ya da kimlik). Verilmezse bileşen kendi durumunu tutar. */
  active?: number | ParkingFlowStepId
  /** manual: kullanıcı bir adım etiketine tıkladığında. */
  onActiveChange?: (index: number, id: ParkingFlowStepId) => void
  /** Vurgu etiketi metni; varsayılan cihaz adı. */
  highlightLabel?: string
  /** Sahnenin erişilebilir adı. */
  label?: string
  caption?: string
  /** scroll: sahne bir kaydırma boyu sabitlenir (≥1024px). */
  pin?: boolean
  /** scroll+pin: sarmalayıcı yüksekliği (görünüm alanı katı). */
  scrollLength?: number
  /** auto: adım başına saniye. */
  autoDuration?: number
  /** closed: bariyer hiç açılmaz, araç direğin önünde bekler. */
  barrier?: 'auto' | 'closed'
}

const TAIL_SECONDS = 1.2
const REPEAT_DELAY_MS = 900
const pad = (value: number) => String(value).padStart(2, '0')

const colors = {
  light: { screen: ['#eef0fb', '#9aa1e3', '#12805c'], ledOff: '#c9cee0' },
  dark: { screen: ['#1a1f6b', '#9aa1e3', '#1fa06f'], ledOff: 'rgb(255 255 255 / 0.28)' },
}
const SUCCESS = '#12805c'

type Loop = { controls: AnimationPlaybackControls | null; timer: number | undefined }

export default function ParkingFlow({
  steps,
  mode = 'scroll',
  highlight,
  tone = 'light',
  showLabels = true,
  className = '',
  active,
  onActiveChange,
  highlightLabel,
  label,
  caption,
  pin = true,
  scrollLength = 1.6,
  autoDuration = 2.2,
  barrier = 'auto',
}: ParkingFlowProps) {
  const reduce = Boolean(useReducedMotion())
  const wide = useMediaQuery('(min-width: 1024px)')
  const pageVisible = usePageVisible()
  const baseId = useId()

  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { amount: 0.3 })
  const revealed = useInView(rootRef, { once: true, amount: 0.2 })

  // Dar sahne (sayfa sütunu < COMPACT_BELOW px): vurgu etiketi şeridin altına iner, görünüm kırpılır.
  // Ölçüm düzen efektinde bağlanır; ResizeObserver ilk bildirimi boyamadan önce verdiği için geniş kare görünmez.
  const [compact, setCompact] = useState(false)
  useLayoutEffect(() => {
    const node = stageRef.current
    if (!node || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      setCompact(width > 0 && width < COMPACT_BELOW)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const count = steps.length
  // Kimlik listesi içeriğe göre sabitlenir; ebeveyn her render'da yeni dizi verse de yeniden abone olunmaz.
  const idsKey = steps.map((step) => step.id).join('|')
  const ids = useMemo(() => (idsKey ? (idsKey.split('|') as ParkingFlowStepId[]) : []), [idsKey])
  const pinned = mode === 'scroll' && pin && wide && !reduce && count > 0
  const barrierClosed = barrier === 'closed'
  const tail = count > 0 ? TAIL_SECONDS / (count * autoDuration) : 0

  // Tek ilerleme değeri (0–1; otomatik döngüde kuyrukla 1+tail) sahnedeki tüm değişkenleri sürer.
  const progress = useMotionValue(0)
  const car = useMotionValue(CAR_START)
  const cone = useMotionValue(0.16)
  const bracket = useMotionValue(0)
  const plate = useMotionValue(0)
  const pulse = useMotionValue(0)
  const led = useMotionValue(0)
  const screen = useMotionValue(0)
  const arm = useMotionValue(0)
  const gate = useMotionValue(0)

  const palette = colors[tone]
  const screenColor = useTransform(screen, [0, 1, 2], palette.screen)
  const ledColor = useTransform(led, [0, 1], [palette.ledOff, SUCCESS])
  const gateColor = useTransform(gate, [0, 1], [palette.ledOff, SUCCESS])
  const displayProgress = useTransform(progress, (value) => Math.min(1, Math.max(0, value)))

  const [sceneActive, setSceneActive] = useState(-1)
  const sceneActiveRef = useRef(-1)

  const apply = useCallback(
    (value: number) => {
      const state = sceneAt(value, ids, { barrierClosed, tail })
      car.set(state.car)
      cone.set(state.cone)
      bracket.set(state.bracket)
      plate.set(state.plate)
      pulse.set(state.pulse)
      led.set(state.led)
      screen.set(state.screen)
      arm.set(state.arm)
      gate.set(state.gate)
      const next = activeIndexAt(value, count)
      if (next !== sceneActiveRef.current) {
        sceneActiveRef.current = next
        setSceneActive(next)
      }
    },
    [ids, barrierClosed, tail, count, car, cone, bracket, plate, pulse, led, screen, arm, gate],
  )

  useMotionValueEvent(progress, 'change', apply)

  /* Kaydırma modu */
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: pinned ? ['start start', 'end end'] : ['start 80%', 'end 45%'],
  })
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (mode === 'scroll' && !reduce) progress.set(value)
  })

  /* Elle mod */
  const [internalActive, setInternalActive] = useState(0)
  const manualIndex = useMemo(() => {
    if (mode !== 'manual' || count === 0) return -1
    if (typeof active === 'number') return Math.min(count - 1, Math.max(0, active))
    if (typeof active === 'string') return Math.max(0, ids.indexOf(active))
    return Math.min(count - 1, internalActive)
  }, [mode, active, ids, count, internalActive])

  /* Otomatik mod */
  const [paused, setPaused] = useState(false)
  const running = mode === 'auto' && !reduce && inView && pageVisible && !paused && count > 0
  const loop = useRef<Loop>({ controls: null, timer: undefined })

  const stopLoop = useCallback(() => {
    loop.current.controls?.stop()
    loop.current.controls = null
    window.clearTimeout(loop.current.timer)
    loop.current.timer = undefined
  }, [])

  // Döngü: kaldığı ilerlemeden sona kadar doğrusal akar, kısa bir beklemeyle başa döner.
  const startLoop = useCallback(
    (from: number) => {
      const end = 1 + tail
      const total = count * autoDuration + TAIL_SECONDS
      const run = function segment(start: number) {
        const remaining = (Math.max(0, end - start) / end) * total
        loop.current.controls = animate(progress, end, {
          duration: remaining,
          ease: 'linear',
          onComplete: () => {
            loop.current.timer = window.setTimeout(() => {
              progress.set(0)
              segment(0)
            }, REPEAT_DELAY_MS)
          },
        })
      }
      run(from)
    },
    [autoDuration, count, progress, tail],
  )

  useEffect(() => {
    if (!running) return
    const current = progress.get()
    startLoop(current >= 1 + tail - 0.001 ? 0 : current)
    return stopLoop
  }, [running, startLoop, stopLoop, progress, tail])

  // Elle modda hedef adıma yumuşak geçiş; hareket azaltmada doğrudan atlama.
  useEffect(() => {
    if (mode !== 'manual' || manualIndex < 0) return
    const target = progressForStep(manualIndex, count, ids[manualIndex])
    if (reduce) {
      progress.set(target)
      return
    }
    const controls = animate(progress, target, { duration: 1.1, ease: revealEase })
    return () => controls.stop()
  }, [mode, manualIndex, count, ids, reduce, progress])

  // İlk kare. Hareket azaltmada sahne tamamlanmış hâlde durur: araç açık bariyerin altından geçerken.
  useEffect(() => {
    if (reduce && mode !== 'manual' && count > 0) progress.set(progressForStep(count - 1, count, ids[count - 1]))
    apply(progress.get())
  }, [apply, reduce, mode, count, ids, progress])

  const jumpTo = (index: number) => {
    const id = ids[index]
    if (mode === 'manual') {
      onActiveChange?.(index, id)
      if (active === undefined) setInternalActive(index)
      return
    }
    const target = progressForStep(index, count, id)
    if (mode === 'auto') {
      stopLoop()
      setPaused(true)
      if (reduce) progress.set(target)
      else animate(progress, target, { duration: 0.9, ease: revealEase })
      return
    }
    // Kaydırma modu (sabit): pencere o adımın ilerleme noktasına gider.
    const root = rootRef.current
    if (!root) return
    const top = root.getBoundingClientRect().top + window.scrollY
    const distance = root.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + distance * target, behavior: reduce ? 'instant' : 'smooth' })
  }

  // Vurgu sonradan değişirse (ör. elle modda cihaz seçimi) dirsekli çizgi ve etiket kısa bir çizimle yeniden gelir;
  // ilk görünüşteki uzun gecikme yalnızca bir kez uygulanır. Değişim render sırasında türetilir (effect içinde setState yok).
  const [seenHighlight, setSeenHighlight] = useState(highlight)
  const [replay, setReplay] = useState(false)
  if (seenHighlight !== highlight) {
    setSeenHighlight(highlight)
    setReplay(true)
  }

  const labelActive = mode === 'manual' ? manualIndex : reduce ? -1 : sceneActive
  // showLabels=false: liste yalnızca ekran okuyucu içindir; görünmez odaklanabilir düğme bırakılmaz, düz öğeler çizilir.
  const clickable = showLabels && (mode === 'manual' || mode === 'auto' || pinned)
  const leader = highlight ? leaders[highlight] : null
  const deviceName = highlight ? (highlightLabel ?? text.devices[highlight]) : null
  const values = { car, cone, bracket, plate, pulse, arm, screenColor, ledColor, gateColor }

  return (
    <figure
      ref={rootRef}
      className={`${styles.root} ${className}`.trim()}
      data-tone={tone}
      data-pinned={pinned}
      data-mode={mode}
      style={{ '--pf-length': scrollLength } as CSSProperties}
      aria-label={label ?? text.sceneLabel}
    >
      <div ref={stageRef} className={styles.stage}>
        <div
          className={styles.scene}
          style={{
            aspectRatio: compact ? `${COMPACT_VIEW.width} / ${COMPACT_VIEW.height}` : `${SCENE_WIDTH} / ${SCENE_HEIGHT}`,
          }}
        >
          <ParkingFlowScene
            values={values}
            highlight={highlight}
            revealed={revealed}
            reduce={reduce}
            replay={replay}
            compact={compact}
          />
          {leader && deviceName && !compact ? (
            // Konum ve çapa ötelemesi statik dış span'dedir; framer-motion yalnız iç kapsülün opacity/y değerini yazar,
            // böylece satır içi transform çapanın translate'ini ezmez (dikey ortalama ve anchor='end' korunur).
            <span
              key={highlight}
              className={styles.deviceLabel}
              data-anchor={leader.anchor}
              style={{ left: `${(leader.x / SCENE_WIDTH) * 100}%`, top: `${(leader.y / SCENE_HEIGHT) * 100}%` }}
            >
              <motion.span
                className={styles.labelPill}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={revealed ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: replay ? 0.4 : 0.5, delay: replay ? 0.5 : 1.05, ease: revealEase }}
              >
                <span className={styles.srOnly}>{text.highlightPrefix}: </span>
                {deviceName}
              </motion.span>
            </span>
          ) : null}
        </div>
        {leader && deviceName && compact ? (
          // Dar sahne: etiket cihazların üstüne binmesin diye şeridin altında, sahnedeki halkalı işaretle eşleşir.
          <div key={highlight} className={styles.labelBelow} data-placement="below">
            <motion.span
              className={styles.labelPill}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={revealed ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: replay ? 0.4 : 0.5, delay: replay ? 0.3 : 0.75, ease: revealEase }}
            >
              <span className={styles.labelDot} aria-hidden="true" />
              <span className={styles.srOnly}>{text.highlightPrefix}: </span>
              {deviceName}
            </motion.span>
          </div>
        ) : null}
        <p className={styles.srOnly}>{text.sceneDescription}</p>

        <div className={styles.footer}>
          {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : <span />}
          {mode === 'auto' && !reduce ? (
            <button
              type="button"
              className={styles.toggle}
              aria-label={paused ? text.play : text.pause}
              onClick={() => setPaused((value) => !value)}
            >
              <svg viewBox="0 0 16 16" className={styles.toggleIcon} fill="currentColor" aria-hidden="true">
                {paused ? <path d="M5 3.2v9.6L12.6 8z" /> : <path d="M4.5 3h2.2v10H4.5zM9.3 3h2.2v10H9.3z" />}
              </svg>
              <span aria-hidden="true">{paused ? text.playShort : text.pauseShort}</span>
            </button>
          ) : null}
        </div>

        <div className={showLabels ? styles.stepsWrap : styles.srOnly}>
          {showLabels && !reduce && mode !== 'manual' ? (
            <span className={styles.track} aria-hidden="true">
              <motion.span className={styles.trackFill} style={{ scaleX: displayProgress }} />
            </span>
          ) : null}
          <ol className={styles.steps} aria-label={text.stepsLabel}>
            {steps.map((step, index) => {
              const state = index < labelActive ? 'done' : index === labelActive ? 'active' : 'idle'
              const content = (
                <>
                  <span className={styles.stepIndex}>{pad(index + 1)}</span>
                  <span className={styles.stepTitle}>{step.title}</span>
                  <span className={styles.stepText}>{step.description}</span>
                </>
              )
              return (
                <li
                  key={step.id}
                  id={`${baseId}-${step.id}`}
                  className={styles.step}
                  data-state={state}
                  aria-current={state === 'active' ? 'step' : undefined}
                >
                  {clickable ? (
                    <button type="button" className={styles.stepButton} onClick={() => jumpTo(index)}>
                      {content}
                    </button>
                  ) : (
                    <div className={styles.stepStatic}>{content}</div>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </figure>
  )
}
