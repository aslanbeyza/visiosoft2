import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import Section from '../Section/index.ts'
import SectionHeading from '../SectionHeading/index.ts'
import { flagshipInfo, flagships } from '../HomeFlagships/flagships.ts'
import type { Flagship } from '../HomeFlagships/flagships.ts'
import { useMediaQuery } from '../../hooks/useMediaQuery/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import FieldStack from './FieldStack.tsx'
import { homeFieldCopy as text } from './homeFieldCopy.ts'
import styles from './HomeField.module.css'

const ITEMS = [
  ...flagships.filter((item) => item.slug === 'kamera-muhafaza'),
  ...flagships.filter((item) => item.slug !== 'kamera-muhafaza'),
]
const COUNT = ITEMS.length
const LOOPS = 2
const SPAN = COUNT * LOOPS
const STORY = 96
const SPRING = { stiffness: 92, damping: 26, mass: 0.4 }

function wrapOff(index: number, fly: number, count: number) {
  const wrapped = ((fly % count) + count) % count
  let delta = index - wrapped
  const half = count / 2
  if (delta > half) delta -= count
  if (delta < -half) delta += count
  return delta
}

function ProductImage({ item, eager }: { item: Flagship; eager?: boolean }) {
  const fit = 'height' in item.fit ? 'tall' : 'wide'
  return (
    <picture data-fit={fit}>
      <source type="image/avif" srcSet={item.image.avif} />
      <img
        src={item.image.src}
        alt=""
        width={item.image.width}
        height={item.image.height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
      />
    </picture>
  )
}

function CatalogLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className={styles.catalog}>
      {label}
      <svg viewBox="0 0 24 24" className={styles.arrow} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  )
}

function scrollToStep(story: HTMLElement, index: number, progress: number) {
  const top = story.getBoundingClientRect().top + window.scrollY
  const distance = story.offsetHeight - window.innerHeight
  const flyNow = progress * SPAN
  const base = Math.floor(flyNow / COUNT) * COUNT
  let target = base + index
  if (target <= flyNow + 0.08) target += COUNT
  if (target > SPAN) target = SPAN
  window.scrollTo({ top: top + distance * (target / SPAN), behavior: 'smooth' })
}

export default function HomeField() {
  const path = usePath()
  const reduce = Boolean(useReducedMotion())
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const desktopRef = useRef(isDesktop)
  desktopRef.current = isDesktop
  const storyRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLParagraphElement>(null)
  const slotRefs = useRef<(HTMLDivElement | null)[]>([])
  const progressRef = useRef(0)
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ['start start', 'end end'] })
  const raw = useTransform(scrollYProgress, [0, 1], [0, SPAN])
  const fly = useSpring(raw, SPRING)
  const [active, setActive] = useState(0)
  const [stepLocal, setStepLocal] = useState(0)
  const [hasScrolled, setHasScrolled] = useState(false)

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (!desktopRef.current) return
    progressRef.current = value
    setHasScrolled(value > 0.02)
  })

  useMotionValueEvent(fly, 'change', (value) => {
    if (!desktopRef.current) return
    slotRefs.current.forEach((slot, index) => {
      slot?.style.setProperty('--off', String(wrapOff(index, value, COUNT)))
    })
    const wrapped = ((value % COUNT) + COUNT) % COUNT
    const next = Math.min(COUNT - 1, Math.max(0, Math.floor(wrapped)))
    setActive((prev) => (prev === next ? prev : next))
    setStepLocal(Math.max(0, Math.min(1, wrapped - next)))
  })

  useLayoutEffect(() => {
    const stage = stageRef.current
    const hint = hintRef.current
    if (!stage || !hint || !isDesktop) return
    const align = () => {
      const label = stage.querySelector<HTMLElement>(`[data-state="active"] .${styles.label}`)
      if (!label) return
      const stageBox = stage.getBoundingClientRect()
      const labelBox = label.getBoundingClientRect()
      const top = labelBox.top - stageBox.top + (labelBox.height - hint.offsetHeight) / 2
      hint.style.top = `${top}px`
    }
    align()
    const observer = new ResizeObserver(align)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [active, isDesktop])

  const prevIndex = (active - 1 + COUNT) % COUNT
  const tickFill = Math.max(stepLocal, 0.08)
  const catalogHref = path('hardware-products')

  return (
    <Section id="saha" tone="surface" spacing="none" labelledBy={text.titleId} className={styles.section}>
      {reduce ? (
        <>
          <SectionHeading eyebrow={text.eyebrow} title={text.title} lead={text.lead} id={text.titleId} />
          <p className={styles.more}>
            <CatalogLink to={catalogHref} label={text.all} />
          </p>
          <ul className={styles.grid} aria-label={text.galleryLabel}>
            {ITEMS.map((item, index) => {
              const card = flagshipInfo(item.slug)
              return (
                <li key={item.slug} className={styles.bay}>
                  <Link to={path(card.route)} className={styles.card}>
                    <span className={styles.stageCard}>
                      <ProductImage item={item} eager={index === 0} />
                    </span>
                    <span className={styles.cardCopy}>
                      <span className={styles.cat}>{card.category}</span>
                      <span className={styles.cardName}>{card.name}</span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </>
      ) : !isDesktop ? (
        <FieldStack items={ITEMS} catalogHref={catalogHref} />
      ) : (
        <div
          ref={storyRef}
          className={styles.story}
          data-scroll="track"
          style={{ '--story': STORY } as CSSProperties}
        >
          <div className={styles.sticky}>
            <div ref={stageRef} className={styles.stage}>
              <p className={styles.kicker}>{text.eyebrow}</p>
              <h2 id={text.titleId} className={styles.headline}>{text.title}</h2>
              <p ref={hintRef} className={styles.hint} data-hidden={hasScrolled ? 'true' : 'false'}>
                <span className={styles.chevrons} aria-hidden="true">
                  {[0, 1, 2].map((index) => (
                    <svg key={index} className={styles.chevron} viewBox="0 0 16 8">
                      <path d="M1.6 1.4 L8 6.1 L14.4 1.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ))}
                </span>
                <span className="sr-only">{text.hint}. {text.hintDetail}</span>
              </p>
              <CatalogLink to={catalogHref} label={text.all} />
              <div className={styles.floor} aria-hidden="true" />
              {ITEMS.map((item, index) => (
                <div
                  key={item.slug}
                  ref={(node) => {
                    slotRefs.current[index] = node
                  }}
                  className={styles.slot}
                  data-fit={'height' in item.fit ? 'tall' : 'wide'}
                  style={{ '--off': wrapOff(index, 0, COUNT) } as CSSProperties}
                  aria-hidden="true"
                >
                  <ProductImage item={item} eager />
                </div>
              ))}

              <div className={styles.steps} aria-live="polite">
                {ITEMS.map((item, index) => {
                  const info = flagshipInfo(item.slug)
                  const state = index === active ? 'active' : index === prevIndex ? 'prev' : 'idle'
                  return (
                    <article key={item.slug} className={styles.step} data-state={state} aria-hidden={state !== 'active'}>
                      <div className={styles.stepHead}>
                        <p className={styles.counter}>
                          <span className="sr-only">
                            {String(index + 1).padStart(2, '0')} / {String(COUNT).padStart(2, '0')}
                          </span>
                          <span aria-hidden="true">
                            <strong>{String(index + 1).padStart(2, '0')}</strong> / {String(COUNT).padStart(2, '0')}
                          </span>
                        </p>
                      </div>
                      <h3 className={styles.name}>{info.name}</h3>
                      <p className={styles.summary}>{info.summary}</p>
                      <ul className={styles.tags}>
                        {info.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                      <Link to={path(info.route)} className={styles.inspect} tabIndex={state === 'active' ? 0 : -1}>
                        {text.inspect}
                        <svg viewBox="0 0 24 24" className={styles.arrow} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </Link>
                      <div className={styles.foot}>
                        <div className={styles.ticks} role="tablist" aria-label={text.galleryLabel}>
                          {ITEMS.map((tick, tickIndex) => {
                            const current = tickIndex === active
                            return (
                              <button
                                key={tick.slug}
                                type="button"
                                role="tab"
                                aria-selected={current}
                                aria-label={flagshipInfo(tick.slug).name}
                                className={styles.tick}
                                tabIndex={state === 'active' ? 0 : -1}
                                onClick={() => {
                                  const story = storyRef.current
                                  if (story) scrollToStep(story, tickIndex, progressRef.current)
                                }}
                              >
                                <span
                                  className={styles.tickFill}
                                  style={{ transform: `scaleX(${current ? tickFill : 0})` }}
                                />
                              </button>
                            )
                          })}
                        </div>
                        <span className={styles.label}>{info.category}</span>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  )
}
