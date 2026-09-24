import { useId, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import { usePageVisible } from '../../hooks/usePageVisible/index.ts'
import { endToEndCopy } from './endToEndCopy.ts'
import HubSpokeArt from './HubSpokeArt.tsx'
import { spokes, spokeTop } from './hubGeometry.ts'
import styles from './HubSpoke.module.css'

const pad = (value: number) => String(value).padStart(2, '0')

export default function HubSpoke() {
  const { hub, modules } = endToEndCopy
  const reduce = Boolean(useReducedMotion())
  const rootRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const drawn = useInView(rootRef, { once: true, amount: 0.25 })
  const inView = useInView(rootRef, { amount: 0.1 })
  const pageVisible = usePageVisible()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const baseId = useId()

  const show = drawn || reduce
  const running = !reduce && drawn && inView && pageVisible && !paused
  const current = modules[active]
  const panelId = `${baseId}-panel`
  const tabId = (index: number) => `${baseId}-tab-${index}`

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = modules.length - 1
    const targets: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowDown: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }
    const target = targets[event.key]
    if (target === undefined) return
    event.preventDefault()
    setActive(target)
    tabRefs.current[target]?.focus()
  }

  return (
    <div ref={rootRef} className={styles.root} data-running={running}>
      <div className={styles.box}>
        <HubSpokeArt drawn={show} reduce={reduce} active={active} />

        <motion.p
          className={styles.hub}
          initial={reduce ? false : { opacity: 0, scale: 0.86 }}
          animate={show ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.9, delay: 0.1, ease: revealEase }}
        >
          <span className={styles.kicker}>{hub.kicker}</span>
          <strong className={styles.name}>{hub.name}</strong>
          <span className={styles.sub}>{hub.sub}</span>
        </motion.p>

        <div className={styles.spokes}>
          <span className={styles.trunk} aria-hidden="true">
            <motion.span
              className={styles.trunkLine}
              initial={reduce ? false : { scaleY: 0 }}
              animate={show ? { scaleY: 1 } : undefined}
              transition={{ duration: 1, delay: 0.35, ease: revealEase }}
            />
            {reduce ? null : <span className={styles.pulse} />}
          </span>

          <div role="tablist" aria-label={hub.label} className={styles.tabs}>
            {modules.map((module, index) => {
              const spoke = spokes[index]
              const selected = index === active
              return (
                <motion.button
                  key={module.id}
                  ref={(node) => {
                    tabRefs.current[index] = node
                  }}
                  type="button"
                  role="tab"
                  id={tabId(index)}
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  className={styles.tab}
                  data-side={spoke.side}
                  style={{ '--top': spokeTop(spoke) } as CSSProperties}
                  onClick={() => setActive(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  initial={reduce ? false : { opacity: 0, x: spoke.side === 'left' ? -18 : 18 }}
                  animate={show ? { opacity: 1, x: 0 } : undefined}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.07, ease: revealEase }}
                >
                  <span className={styles.mark} aria-hidden="true">
                    {module.mark}
                  </span>
                  <span className={styles.tabText}>
                    <span className={styles.tabTitle}>{module.title}</span>
                    <span className={styles.tabDesc}>{module.desc}</span>
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div id={panelId} role="tabpanel" aria-labelledby={tabId(active)} tabIndex={0} className={styles.panel}>
          <motion.span
            className={styles.panelRule}
            aria-hidden="true"
            initial={reduce ? false : { scaleX: 0 }}
            animate={show ? { scaleX: 1 } : undefined}
            transition={{ duration: 1.1, delay: 0.9, ease: revealEase }}
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              className={styles.panelBody}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: reduce ? 0 : 0.35, ease: revealEase }}
            >
              <p className={styles.panelMeta}>
                <span className={styles.panelIndex}>
                  {pad(active + 1)} / {pad(modules.length)}
                </span>
                <span>{current.desc}</span>
              </p>
              <p className={styles.panelTitle}>{current.title}</p>
              <p className={styles.panelText}>{current.detail}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={styles.controls}>
          <p className={styles.hint}>{hub.hint}</p>
          {reduce ? null : (
            <button
              type="button"
              className={styles.pause}
              aria-label={paused ? hub.play : hub.pause}
              onClick={() => setPaused((value) => !value)}
            >
              <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                {paused ? <path d="M5 3.5v9l7-4.5z" /> : <path d="M5 3.5h2v9H5zM9 3.5h2v9H9z" />}
              </svg>
              <span>{paused ? hub.playShort : hub.pauseShort}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
