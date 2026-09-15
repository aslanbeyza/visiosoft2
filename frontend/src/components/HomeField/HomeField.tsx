import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import Section from '../Section/index.ts'
import SectionHeading from '../SectionHeading/index.ts'
import { flagshipInfo, flagships } from '../HomeFlagships/flagships.ts'
import type { Flagship } from '../HomeFlagships/flagships.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { homeFieldCopy as text } from './homeFieldCopy.ts'
import styles from './HomeField.module.css'

const ITEMS = [
  ...flagships.filter((item) => item.slug === 'kamera-muhafaza'),
  ...flagships.filter((item) => item.slug !== 'kamera-muhafaza'),
]
const COUNT = ITEMS.length
const LOOPS = 2
const SPAN = COUNT * LOOPS
const STORY = 180
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

function StepMark({ slug }: { slug: Flagship['slug'] }) {
  return (
    <svg viewBox="0 0 24 24" className={styles.mark} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {slug === 'kiosk' ? <><rect x="8" y="3" width="8" height="18" rx="1.5" /><path d="M10 7h4" /></> : null}
      {slug === 'kamera-muhafaza' ? <><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2.5" /></> : null}
      {slug === 'visiobox' ? <><rect x="5" y="7" width="14" height="10" rx="1.5" /><path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7" /></> : null}
      {slug === 'ledli-reklam-paneli' ? <><rect x="7" y="4" width="10" height="14" rx="1.5" /><path d="M10 21h4" /></> : null}
    </svg>
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

/** Kaydırmada ürün yukarı uçar; LED’den sonra kiosk yine gelir, hikâye bitince sayfa iner. */
export default function HomeField() {
  const path = usePath()
  const reduce = Boolean(useReducedMotion())
  const storyRef = useRef<HTMLDivElement>(null)
  const slotRefs = useRef<(HTMLDivElement | null)[]>([])
  const progressRef = useRef(0)
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ['start start', 'end end'] })
  const raw = useTransform(scrollYProgress, [0, 1], [0, SPAN])
  const fly = useSpring(raw, SPRING)
  const [active, setActive] = useState(0)
  const [stepLocal, setStepLocal] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    progressRef.current = value
  })

  useMotionValueEvent(fly, 'change', (value) => {
    slotRefs.current.forEach((slot, index) => {
      slot?.style.setProperty('--off', String(wrapOff(index, value, COUNT)))
    })
    const wrapped = ((value % COUNT) + COUNT) % COUNT
    const next = Math.min(COUNT - 1, Math.max(0, Math.floor(wrapped)))
    setActive((prev) => (prev === next ? prev : next))
    setStepLocal(Math.max(0, Math.min(1, wrapped - next)))
  })

  const prevIndex = (active - 1 + COUNT) % COUNT

  return (
    <Section id="saha" tone="surface" spacing="none" labelledBy={text.titleId} className={styles.section}>
      {reduce ? (
        <>
          <SectionHeading eyebrow={text.eyebrow} title={text.title} lead={text.lead} id={text.titleId} />
          <p className={styles.more}>
            <CatalogLink to={path('hardware-products')} label={text.all} />
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
      ) : (
        <div ref={storyRef} className={styles.story} style={{ '--story': STORY } as CSSProperties}>
          <div className={styles.sticky}>
            <div className={styles.stage}>
              <p className={styles.kicker}>{text.eyebrow}</p>
              <h2 id={text.titleId} className={styles.headline}>{text.title}</h2>
              <p className={styles.hint}>{text.hint}</p>
              <CatalogLink to={path('hardware-products')} label={text.all} />
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
                        <span className={styles.markWrap}>
                          <StepMark slug={item.slug} />
                        </span>
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
                                  style={{ transform: `scaleX(${current ? Math.max(stepLocal, 0.08) : 0})` }}
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
