import { useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import Picture from '../../components/Picture/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import type { ProcessStep, ProductDetailData } from './productDetailCopy.ts'
import styles from './HowItWorks.module.css'

type HowItWorksProps = {
  process: NonNullable<ProductDetailData['process']>
}

const pad = (value: number) => String(value).padStart(2, '0')

// Fotoğrafta gerçekten görünen parçalar: direkteki kamera (1. adım) ve bariyer kolu (4. adım).
const markers = [
  { step: 0, x: 20, y: 15 },
  { step: 3, x: 57, y: 42 },
]

/** Sahadaki çıkış akışı: kaydırdıkça ilerleyen adım çizgisi ve yavaş kayan saha fotoğrafı. */
export default function HowItWorks({ process }: HowItWorksProps) {
  const reduce = Boolean(useReducedMotion())
  const titleId = useId()
  const listRef = useRef<HTMLOListElement>(null)
  const mediaRef = useRef<HTMLElement>(null)
  // Kırpılmış çerçeve kendi görünürlüğünü algılayamaz; açılış kırpılmamış figure'dan tetiklenir.
  const mediaInView = useInView(mediaRef, { once: true, amount: 0.3 })
  const activeRef = useRef(-1)
  const [active, setActive] = useState(-1)
  const count = process.steps.length

  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 70%', 'end 70%'] })
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const next = latest <= 0 ? -1 : Math.min(count - 1, Math.floor(latest * count))
    if (next !== activeRef.current) {
      activeRef.current = next
      setActive(next)
    }
  })

  const { scrollYProgress: mediaProgress } = useScroll({ target: mediaRef, offset: ['start end', 'end start'] })
  const parallaxY = useTransform(mediaProgress, [0, 1], ['-4%', '4%'])

  const current = reduce ? count - 1 : active

  return (
    <Section tone="night" spacing="lg" labelledBy={titleId} className={styles.section}>
      <SectionHeading eyebrow={process.eyebrow} title={process.title} lead={process.lead} id={titleId} tone="dark" />

      <div className={styles.layout}>
        <ol ref={listRef} className={styles.steps}>
          {process.steps.map((step, index) => (
            <Step
              key={step.id}
              step={step}
              index={index}
              count={count}
              progress={scrollYProgress}
              state={index < current ? 'done' : index === current ? 'active' : 'idle'}
              reduce={reduce}
            />
          ))}
        </ol>

        <figure ref={mediaRef} className={styles.media}>
          <motion.div
            className={styles.frame}
            initial={reduce ? false : { clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={mediaInView ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
            transition={{ duration: 1.2, ease: revealEase }}
          >
            <motion.div className={styles.parallax} style={reduce ? undefined : { y: parallaxY, scale: 1.1 }}>
              <motion.div
                className={styles.zoom}
                initial={reduce ? false : { scale: 1.08 }}
                animate={mediaInView ? { scale: 1 } : undefined}
                transition={{ duration: 1.2, ease: revealEase }}
              >
                <Picture
                  src={process.image.src}
                  avif={process.image.avifSet}
                  webp={process.image.webpSet}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  alt={process.image.alt}
                  width={process.image.width}
                  height={process.image.height}
                  className={styles.image}
                  pictureClassName={styles.picture}
                />
                {markers.map((marker) => (
                  <span
                    key={marker.step}
                    className={styles.marker}
                    data-active={current >= marker.step}
                    style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                    aria-hidden="true"
                  >
                    {pad(marker.step + 1)}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
          <figcaption className={styles.caption}>{process.caption}</figcaption>
        </figure>
      </div>
    </Section>
  )
}

type StepProps = {
  step: ProcessStep
  index: number
  count: number
  progress: MotionValue<number>
  state: 'idle' | 'active' | 'done'
  reduce: boolean
}

function Step({ step, index, count, progress, state, reduce }: StepProps) {
  // Bu adımdan bir sonrakine uzanan çizgi parçasının dolumu.
  const fill = useTransform(progress, (latest) => Math.min(1, Math.max(0, latest * count - index)))
  const isLast = index === count - 1

  return (
    <li className={styles.step} data-state={state} aria-current={state === 'active' ? 'step' : undefined}>
      <div className={styles.rail} aria-hidden="true">
        <span className={styles.node}>
          <StepIcon icon={step.icon} />
        </span>
        {isLast ? null : (
          <span className={styles.track}>
            <motion.span className={styles.trackFill} style={reduce ? undefined : { scaleY: fill }} />
          </span>
        )}
      </div>
      <div className={styles.stepBody}>
        <span className={styles.stepIndex}>{pad(index + 1)}</span>
        <h3 className={styles.stepTitle}>{step.title}</h3>
        <p className={styles.stepText}>{step.description}</p>
      </div>
    </li>
  )
}

const icons: Record<ProcessStep['icon'], ReactNode> = {
  camera: (
    <>
      <rect x="3" y="7" width="13" height="10" rx="2" />
      <path d="m16 10.5 5-2.5v8l-5-2.5" />
    </>
  ),
  screen: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18M7 14.5h4" />
    </>
  ),
  barrier: (
    <>
      <path d="M5 20V10M3 20h4" />
      <circle cx="5" cy="8.5" r="1.5" />
      <path d="m6.5 8 13.5-4" />
    </>
  ),
}

function StepIcon({ icon }: { icon: ProcessStep['icon'] }) {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" focusable="false">
      {icons[icon]}
    </svg>
  )
}
