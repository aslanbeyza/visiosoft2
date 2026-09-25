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

export type ParkingFlowStep = { id: ParkingFlowStepId; title: string; description: string }

export type ParkingFlowProps = {
  steps: ParkingFlowStep[]
  mode?: 'scroll' | 'auto' | 'manual'
  highlight?: ParkingFlowDevice
  tone?: 'light' | 'dark'

  variant?: 'default' | 'cad'
  showLabels?: boolean
  className?: string

  active?: number | ParkingFlowStepId

  onActiveChange?: (index: number, id: ParkingFlowStepId) => void

  highlightLabel?: string

  label?: string
  caption?: string

  pin?: boolean

  scrollLength?: number

  autoDuration?: number

  barrier?: 'auto' | 'closed'
}

const TAIL_SECONDS = 1.2
const REPEAT_DELAY_MS = 900
const STEP_HOLD_MS = 4000
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
  variant = 'default',
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

  const idsKey = steps.map((step) => step.id).join('|')
  const ids = useMemo(() => (idsKey ? (idsKey.split('|') as ParkingFlowStepId[]) : []), [idsKey])
  const pinned = mode === 'scroll' && pin && wide && !reduce && count > 0
  const barrierClosed = barrier === 'closed'
  const tail = count > 0 ? TAIL_SECONDS / (count * autoDuration) : 0

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

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: pinned ? ['start start', 'end end'] : ['start 80%', 'end 45%'],
  })
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (mode === 'scroll' && !reduce) progress.set(value)
  })

  const [internalActive, setInternalActive] = useState(0)
  const manualIndex = useMemo(() => {
    if (mode !== 'manual' || count === 0) return -1
    if (typeof active === 'number') return Math.min(count - 1, Math.max(0, active))
    if (typeof active === 'string') return Math.max(0, ids.indexOf(active))
    return Math.min(count - 1, internalActive)
  }, [mode, active, ids, count, internalActive])

  const running = mode === 'auto' && !reduce && inView && pageVisible && count > 0
  const loop = useRef<Loop>({ controls: null, timer: undefined })

  const stopLoop = useCallback(() => {
    loop.current.controls?.stop()
    loop.current.controls = null
    window.clearTimeout(loop.current.timer)
    loop.current.timer = undefined
  }, [])

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
      if (reduce) {
        progress.set(target)
        return
      }
      // Hold on the chosen step, then let the loop carry on from there.
      loop.current.controls = animate(progress, target, {
        duration: 0.9,
        ease: revealEase,
        onComplete: () => {
          loop.current.timer = window.setTimeout(() => startLoop(target), STEP_HOLD_MS)
        },
      })
      return
    }

    const root = rootRef.current
    if (!root) return
    const top = root.getBoundingClientRect().top + window.scrollY
    const distance = root.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + distance * target, behavior: reduce ? 'instant' : 'smooth' })
  }

  const [seenHighlight, setSeenHighlight] = useState(highlight)
  const [replay, setReplay] = useState(false)
  if (seenHighlight !== highlight) {
    setSeenHighlight(highlight)
    setReplay(true)
  }

  const labelActive = mode === 'manual' ? manualIndex : reduce ? -1 : sceneActive

  const clickable = showLabels && (mode === 'manual' || mode === 'auto' || pinned)
  const leader = highlight ? leaders[highlight] : null
  const deviceName = highlight ? (highlightLabel ?? text.devices[highlight]) : null
  const values = { car, cone, bracket, plate, pulse, arm, screenColor, ledColor, gateColor }

  return (
    <figure
      ref={rootRef}
      className={`${styles.root} ${className}`.trim()}
      data-tone={tone}
      data-variant={variant}
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
            cad={variant === 'cad'}
          />
          {leader && deviceName && !compact ? (

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

        {caption ? (
          <div className={styles.footer}>
            <figcaption className={styles.caption}>{caption}</figcaption>
          </div>
        ) : null}

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
