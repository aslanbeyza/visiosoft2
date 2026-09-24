import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import type { FocusEvent, KeyboardEvent } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Button from '../Button/index.ts'
import Picture from '../Picture/index.ts'
import Reveal, { revealEase } from '../Reveal/index.ts'
import Section from '../Section/index.ts'
import SectionHeading from '../SectionHeading/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { AUTO_ADVANCE_MS, homeSoftwareCopy as text } from './homeSoftwareCopy.ts'
import type { SoftwareTab } from './homeSoftwareCopy.ts'
import styles from './HomeSoftware.module.css'

const pad = (value: number) => String(value).padStart(2, '0')

const subscribeVisibility = (callback: () => void) => {
  document.addEventListener('visibilitychange', callback)
  return () => document.removeEventListener('visibilitychange', callback)
}

const usePageVisible = () =>
  useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === 'visible',
    () => true,
  )

const layerVariants: Variants = {

  active: {
    clipPath: ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)'],
    opacity: [0, 1],
    zIndex: 3,
    transition: {
      clipPath: { duration: 0.9, ease: revealEase },
      opacity: { duration: 0.5, ease: revealEase },
      zIndex: { duration: 0 },
    },
  },
  previous: { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, zIndex: 2, transition: { duration: 0 } },
  idle: { clipPath: 'inset(0% 100% 0% 0%)', opacity: 0, zIndex: 1, transition: { duration: 0 } },
}

const shotVariants: Variants = {
  active: { scale: [1.05, 1], transition: { duration: 1.4, ease: revealEase } },
  previous: { scale: 1, transition: { duration: 0 } },
  idle: { scale: 1.05, transition: { duration: 0 } },
}

function ShotPicture({ tab, eager = false }: { tab: SoftwareTab; eager?: boolean }) {
  return (
    <Picture
      src={tab.image.src}
      avif={tab.image.avif}
      alt=""
      width={tab.image.width}
      height={tab.image.height}
      className={`${styles.shotImage} ${styles[tab.image.fit]}`}
      pictureClassName={styles.picture}
      loading={eager ? 'eager' : 'lazy'}
    />
  )
}

export default function HomeSoftware() {
  const path = usePath()
  const reduce = useReducedMotion()
  const baseId = useId()
  const tabs = text.tabs

  const rootRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const toggleRef = useRef<HTMLButtonElement>(null)

  const [active, setActive] = useState(0)
  const [previous, setPrevious] = useState<number | null>(null)
  const [autoplay, setAutoplay] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)

  const inView = useInView(rootRef, { amount: 0.35 })

  const mediaInView = useInView(mediaRef, { once: true, amount: 0.25 })
  const mediaNearby = useInView(mediaRef, { once: true, margin: '600px 0px' })
  const pageVisible = usePageVisible()
  const progress = useMotionValue(0)

  const { scrollYProgress } = useScroll({ target: mediaRef, offset: ['start end', 'end start'] })
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['3%', '-3%'])

  const cycling = !reduce && autoplay
  const running = cycling && inView && pageVisible && !hovered && !focused

  const select = useCallback(
    (index: number) => {
      if (index === active) return
      progress.set(0)
      setPrevious(active)
      setActive(index)
    },
    [active, progress],
  )

  useEffect(() => {
    if (!running) return
    const remaining = Math.max(0, 1 - progress.get())
    const controls = animate(progress, 1, {
      duration: (remaining * AUTO_ADVANCE_MS) / 1000,
      ease: 'linear',
      onComplete: () => select((active + 1) % tabs.length),
    })
    return () => controls.stop()
  }, [active, progress, running, select, tabs.length])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null
    if (event.key === 'ArrowRight') next = (active + 1) % tabs.length
    else if (event.key === 'ArrowLeft') next = (active - 1 + tabs.length) % tabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = tabs.length - 1
    if (next === null) return
    event.preventDefault()
    select(next)
    tabRefs.current[next]?.focus()
  }

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    const target = event.relatedTarget
    if (!(target instanceof Node) || !event.currentTarget.contains(target)) setFocused(false)
  }

  const current = tabs[active]

  return (
    <Section tone="night" spacing="lg" labelledBy="home-software-title" className={styles.section}>
      <SectionHeading eyebrow={text.eyebrow} title={text.title} lead={text.lead} tone="dark" id="home-software-title" />

      <div
        ref={rootRef}
        className={styles.root}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}

        onFocus={(event) => setFocused(!toggleRef.current?.contains(event.target))}
        onBlur={onBlur}
      >
        <Reveal className={styles.tabBar} amount={0.5}>
          <div role="tablist" aria-label={text.tablistLabel} className={styles.tablist} onKeyDown={onKeyDown}>
            {tabs.map((tab, index) => {
              const selected = index === active
              return (
                <button
                  key={tab.id}
                  ref={(node) => {
                    tabRefs.current[index] = node
                  }}
                  id={`${baseId}-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${tab.id}`}
                  tabIndex={selected ? 0 : -1}
                  className={styles.tab}
                  onClick={() => select(index)}
                >
                  <span className={styles.tabIndex} aria-hidden="true">
                    {pad(index + 1)}
                  </span>
                  <span className={styles.tabLabel}>{tab.label}</span>
                  <span className={styles.tabTrack} aria-hidden="true">
                    {selected ? (
                      <motion.span className={styles.tabProgress} style={{ scaleX: cycling ? progress : 1 }} />
                    ) : null}
                  </span>
                </button>
              )
            })}
          </div>

          {reduce ? null : (
            <button
              ref={toggleRef}
              type="button"
              className={styles.toggle}
              aria-label={autoplay ? text.pause : text.play}
              onClick={() => setAutoplay((value) => !value)}
            >
              <svg viewBox="0 0 16 16" className={styles.toggleIcon} fill="currentColor" aria-hidden="true">
                {autoplay ? <path d="M4.5 3h2.2v10H4.5zM9.3 3h2.2v10H9.3z" /> : <path d="M5 3.2v9.6L12.6 8z" />}
              </svg>
              <span className={styles.toggleText} aria-hidden="true">
                {autoplay ? text.pauseShort : text.playShort}
              </span>
            </button>
          )}
        </Reveal>

        <div className={styles.body}>
          <div className={styles.copyColumn}>
            <div className={styles.panels}>
              {tabs.map((tab, index) => {
                const selected = index === active
                return (
                  <div
                    key={tab.id}
                    id={`${baseId}-panel-${tab.id}`}
                    role="tabpanel"
                    aria-labelledby={`${baseId}-tab-${tab.id}`}
                    aria-hidden={selected ? undefined : true}
                    className={styles.panel}
                    data-active={selected}
                  >
                    <h3 className={styles.panelTitle}>{tab.title}</h3>
                    <p className={styles.panelText}>{tab.description}</p>
                    <ul className={styles.bullets}>
                      {tab.bullets.map((bullet) => (
                        <li key={bullet}>
                          <svg viewBox="0 0 16 16" className={styles.bulletIcon} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="m3.5 8.4 2.9 2.9 6.1-6.3" />
                          </svg>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    <p className={styles.srOnly}>
                      {text.screenshotPrefix} {tab.image.description}
                    </p>
                  </div>
                )
              })}
            </div>
            <Reveal className={styles.cta} delay={0.1} amount={0.6}>
              <Button to={path('software-products')} variant="light" arrow>
                {text.cta}
              </Button>
            </Reveal>
          </div>

          <div ref={mediaRef} className={styles.media}>
            <motion.div className={styles.parallax} style={reduce ? undefined : { y: parallaxY }}>
              <motion.figure
                className={styles.frame}
                initial={reduce ? false : { clipPath: 'inset(0% 0% 100% 0%)' }}
                animate={mediaInView ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
                transition={{ duration: 1.2, ease: revealEase }}
              >
                <div className={styles.frameBar} aria-hidden="true">
                  <span className={styles.dots}>
                    <span />
                    <span />
                    <span />
                  </span>
                  <span className={styles.frameTitle}>
                    {text.frameLabel} · {current.label}
                  </span>
                </div>
                <div className={styles.viewport}>
                  {reduce ? (
                    <div className={styles.layer} style={{ background: current.image.background }}>
                      <div className={styles.shot}>
                        <ShotPicture tab={current} />
                      </div>
                    </div>
                  ) : (
                    tabs.map((tab, index) => (
                      <motion.div
                        key={tab.id}
                        className={styles.layer}
                        style={{ background: tab.image.background }}
                        variants={layerVariants}
                        initial={false}
                        animate={index === active ? 'active' : index === previous ? 'previous' : 'idle'}
                      >
                        <motion.div className={styles.shot} variants={shotVariants}>
                          <ShotPicture tab={tab} eager={mediaNearby} />
                        </motion.div>
                      </motion.div>
                    ))
                  )}
                </div>
                <figcaption className={styles.caption}>{text.note}</figcaption>
              </motion.figure>
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  )
}
