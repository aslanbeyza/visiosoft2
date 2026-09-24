import { useId, useRef, useState } from 'react'
import type { CSSProperties, FormEvent, ReactNode } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import { parkBizDemoCopy as copy, type ParkBizScreenId } from './parkBizDemoCopy.ts'
import fan from './PhoneFan.module.css'
import styles from './ParkBizPhoneDemo.module.css'

const FRAME = { src: '/img/pages/phone-frame-crop.webp', avif: '/img/pages/phone-frame-crop.avif', width: 726, height: 1444 }

const poses = [
  { x: '-72%', rotate: -6, y: 16, scale: 0.9, z: 1 },
  { x: '0%', rotate: 0, y: 0, scale: 1, z: 2 },
  { x: '72%', rotate: 6, y: 16, scale: 0.9, z: 1 },
]

function sanitizePlate(value: string) {
  return value
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, '')
    .slice(0, 8)
}

function formatPlate(value: string) {
  const clean = sanitizePlate(value)
  if (clean.length <= 2) return clean
  if (clean.length <= 5) return `${clean.slice(0, 2)} ${clean.slice(2)}`
  return `${clean.slice(0, 2)} ${clean.slice(2, 5)} ${clean.slice(5)}`
}

function StatusBar() {
  return (
    <div className={styles.status} aria-hidden="true">
      <span>9:41</span>
      <span className={styles.statusIcons}>
        <i />
        <i />
        <i />
      </span>
    </div>
  )
}

function BrandBar() {
  return (
    <div className={styles.brandBar}>
      <img src="/img/parkbiz/logo-header.jpg" alt="" width={28} height={28} className={styles.brandLogo} />
      <span className={styles.brandName}>{copy.brand}</span>
    </div>
  )
}

function VehiclesScreen() {
  const v = copy.vehicles
  return (
    <div className={styles.ui}>
      <StatusBar />
      <BrandBar />
      <div className={styles.body}>
        <p className={styles.screenTitle}>{v.title}</p>
        <p className={styles.screenSub}>{copy.parking}</p>

        <div className={styles.rights}>
          <p className={styles.rightsTitle}>{v.rightsTitle}</p>
          <div className={styles.rightsRow}>
            <span>
              {v.free}
              <strong>{v.freeValue}</strong>
            </span>
            <span>
              {v.sub}
              <strong>{v.subValue}</strong>
            </span>
          </div>
        </div>

        <div className={styles.segment} aria-hidden="true">
          <span data-active="true">{copy.tabs.vehicles}</span>
          <span>{copy.tabs.subscriptions}</span>
        </div>

        <ul className={styles.vehicleList}>
          {v.items.map((item) => (
            <li key={item.plate} className={styles.vehicleCard}>
              <span className={styles.carThumb} data-tone={item.tone} aria-hidden="true" />
              <span className={styles.vehicleMeta}>
                <strong className={styles.plate}>{item.plate}</strong>
                <em>{item.model}</em>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.footer}>
        <span className={styles.cta}>{v.add}</span>
      </div>
    </div>
  )
}

function AddPlateScreen({
  interactive,
  plate,
  onPlate,
  saved,
  onSave,
}: {
  interactive: boolean
  plate: string
  onPlate: (value: string) => void
  saved: boolean
  onSave: () => void
}) {
  const inputId = useId()
  const a = copy.addPlate
  const display = formatPlate(plate) || a.placeholder

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (sanitizePlate(plate).length >= 6) onSave()
  }

  return (
    <div className={styles.ui}>
      <StatusBar />
      <div className={styles.stackHead}>
        <p className={styles.stackTitle}>{a.title}</p>
      </div>
      <div className={styles.body}>
        <div className={styles.platePreview} aria-hidden={!interactive}>
          <span className={styles.trStrip}>TR</span>
          <span className={styles.platePreviewText} data-empty={!plate}>
            {display}
          </span>
        </div>

        {interactive ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <label htmlFor={inputId} className={styles.fieldLabel}>
              {a.label}
            </label>
            <input
              id={inputId}
              className={styles.input}
              value={formatPlate(plate)}
              onChange={(event) => onPlate(sanitizePlate(event.target.value))}
              placeholder={a.placeholder}
              autoComplete="off"
              spellCheck={false}
              maxLength={11}
            />
            <p className={styles.hint}>{a.hint}</p>
            <button type="submit" className={styles.cta} disabled={sanitizePlate(plate).length < 6}>
              {saved ? a.saved : a.save}
            </button>
          </form>
        ) : (
          <div className={styles.form}>
            <p className={styles.fieldLabel}>{a.label}</p>
            <p className={styles.inputStatic}>{a.placeholder}</p>
            <p className={styles.hint}>{a.hint}</p>
            <span className={styles.cta}>{a.save}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function SubscribeScreen({ plate, done }: { plate: string; done: boolean }) {
  const s = copy.subscribe
  const shown = formatPlate(plate) || copy.vehicles.items[0].plate

  return (
    <div className={styles.ui}>
      <StatusBar />
      <BrandBar />
      <div className={styles.body}>
        <p className={styles.screenTitle}>{s.title}</p>

        <div className={styles.context}>
          <span className={styles.contextLabel}>{s.parkingLabel}</span>
          <strong>{copy.parking}</strong>
        </div>

        <div className={styles.context}>
          <span className={styles.contextLabel}>{s.vehicleLabel}</span>
          <strong className={styles.plate}>{shown}</strong>
        </div>

        <article className={styles.package} data-active="true">
          <div>
            <p className={styles.packageTitle}>{s.packageTitle}</p>
            <p className={styles.packageMeta}>{s.packageMeta}</p>
          </div>
          <p className={styles.price}>
            <strong>{s.price}</strong>
            <span>{s.currency}</span>
          </p>
        </article>

        <div className={styles.metaRow}>
          <span>{s.start}</span>
          <strong>{s.startValue}</strong>
        </div>
      </div>
      <div className={styles.footer}>
        <span className={styles.cta} data-done={done ? 'true' : 'false'}>
          {done ? s.done : s.cta}
        </span>
      </div>
    </div>
  )
}

export default function ParkBizPhoneDemo() {
  const reduce = Boolean(useReducedMotion())
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { once: true, amount: 0.35 })
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ['start end', 'end start'] })
  const sideY = useTransform(scrollYProgress, [0, 1], [14, -22])
  const centerY = useTransform(scrollYProgress, [0, 1], [6, -10])
  const play = !reduce && inView

  const [plate, setPlate] = useState('34PBZ001')
  const [saved, setSaved] = useState(false)
  const [done, setDone] = useState(false)
  const [active, setActive] = useState<ParkBizScreenId>('add-plate')

  const screens: { id: ParkBizScreenId; step: string; label: string; node: ReactNode }[] = [
    {
      id: 'vehicles',
      step: copy.screens[0].step,
      label: copy.screens[0].label,
      node: <VehiclesScreen />,
    },
    {
      id: 'add-plate',
      step: copy.screens[1].step,
      label: copy.screens[1].label,
      node: (
        <AddPlateScreen
          interactive
          plate={plate}
          onPlate={(value) => {
            setPlate(value)
            setSaved(false)
            setDone(false)
          }}
          saved={saved}
          onSave={() => {
            setSaved(true)
            setActive('subscribe')
            setDone(true)
          }}
        />
      ),
    },
    {
      id: 'subscribe',
      step: copy.screens[2].step,
      label: copy.screens[2].label,
      node: <SubscribeScreen plate={plate} done={done} />,
    },
  ]

  return (
    <div ref={rootRef} className={fan.root}>
      <svg className={fan.arc} viewBox="0 0 1000 420" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <motion.path
          d="M 30 400 C 220 40, 780 40, 970 400"
          className={fan.arcPath}
          initial={reduce ? false : { pathLength: 0 }}
          animate={play ? { pathLength: 1 } : undefined}
          transition={{ duration: 1.6, delay: 0.2, ease: revealEase }}
        />
      </svg>

      <ol className={fan.fan} aria-label={copy.label}>
        {screens.map((screen, index) => {
          const pose = poses[index]
          const center = index === 1
          const selected = active === screen.id
          return (
            <motion.li
              key={screen.id}
              className={fan.item}
              style={{ zIndex: selected ? 3 : pose.z } as CSSProperties}
              initial={reduce ? false : { x: '0%' }}
              animate={play || reduce ? { x: pose.x } : undefined}
              transition={{ duration: 1.1, delay: center ? 0 : 0.45, ease: revealEase }}
            >
              <motion.div className={fan.lift} style={reduce ? undefined : { y: center ? centerY : sideY }}>
                <motion.div
                  className={fan.device}
                  initial={reduce ? false : { rotate: 0, scale: 0.9, y: 64, opacity: 0 }}
                  animate={play || reduce ? { rotate: pose.rotate, scale: pose.scale, y: pose.y, opacity: 1 } : undefined}
                  transition={{ duration: 1.1, delay: center ? 0 : 0.45, ease: revealEase }}
                >
                  <div className={`${fan.screen} ${styles.screenLive}`} data-active={selected ? 'true' : 'false'}>
                    <button
                      type="button"
                      className={styles.focusHit}
                      aria-label={`${screen.label} ekranını öne getir`}
                      onClick={() => setActive(screen.id)}
                      tabIndex={center ? -1 : 0}
                    />
                    {screen.node}
                  </div>
                  <picture className={fan.frame} aria-hidden="true">
                    <source type="image/avif" srcSet={FRAME.avif} />
                    <img src={FRAME.src} alt="" width={FRAME.width} height={FRAME.height} loading="lazy" decoding="async" />
                  </picture>
                </motion.div>
              </motion.div>

              <motion.p
                className={fan.label}
                data-center={center || selected}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={play ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.7, delay: 1 + index * 0.08, ease: revealEase }}
              >
                <span className={fan.step}>{screen.step}</span>
                {screen.label}
              </motion.p>
            </motion.li>
          )
        })}
      </ol>

      <p className={fan.caption}>{copy.caption}</p>
    </div>
  )
}
