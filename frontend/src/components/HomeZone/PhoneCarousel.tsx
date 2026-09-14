import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent, type PointerEvent } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import { usePageVisible } from '../../hooks/usePageVisible/index.ts'
import { APP_INTERVAL, homeZoneCopy } from './homeZoneCopy.ts'
import styles from './PhoneCarousel.module.css'
import cardStyles from './DriverStrip.module.css'

const copy = homeZoneCopy.driver.app
const screens = copy.screens
const last = screens.length - 1
/** Ekran katmanının geçişte kaydığı mesafe (px); telefon çerçevesi hiç hareket etmez. */
const SHIFT = 16

type Direction = 1 | -1
type Slide = { index: number; previous: number | null; dir: Direction }

/**
 * Sabit telefon çerçevesinde üç gerçek ParkBiz ekranı. Görünürken 4 sn'de bir yalnızca ekran katmanı değişir
 * (solma + 16 px kayma); sekmeler klavyeyle gezilebilir, otomatik geçiş duraklatılabilir.
 */
export default function PhoneCarousel() {
  const ref = useRef<HTMLDivElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const id = useId()
  const reduce = useReducedMotion() ?? false
  const inView = useInView(ref, { amount: 0.4 })
  // Kart yaklaşınca üç ekran birden yüklenir; geçişte görsel çözümlemesi beklenmez.
  const near = useInView(ref, { once: true, margin: '600px 0px' })
  const loading = near ? 'eager' : 'lazy'
  const pageVisible = usePageVisible()
  const [slide, setSlide] = useState<Slide>({ index: 0, previous: null, dir: 1 })
  const [paused, setPaused] = useState(false)
  // Klavye odağı sekmelerdeyken seçim odağın altından kaymasın diye otomatik geçiş bekler.
  const [keyboardFocus, setKeyboardFocus] = useState(false)
  // Fare imleci telefonun ya da sekmelerin üzerindeyken geçiş bekler (dokunmada iz bırakmaz).
  const [hovered, setHovered] = useState(false)
  const running = !reduce && inView && pageVisible && !paused && !keyboardFocus && !hovered
  const { index, previous, dir } = slide
  const panelId = `${id}-panel`
  const metaId = `${id}-meta`

  const show = (next: number, direction: Direction) =>
    setSlide((current) => (current.index === next ? current : { index: next, previous: current.index, dir: direction }))

  useEffect(() => {
    if (!running) return
    const timer = window.setTimeout(() => show((index + 1) % screens.length, 1), APP_INTERVAL)
    return () => window.clearTimeout(timer)
  }, [index, running])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, [number, Direction]> = {
      ArrowRight: [index === last ? 0 : index + 1, 1],
      ArrowLeft: [index === 0 ? last : index - 1, -1],
      Home: [0, -1],
      End: [last, 1],
    }
    const move = moves[event.key]
    if (!move) return
    event.preventDefault()
    // Kullanıcının seçtiği ekran kalır: otomatik geçiş durur, düğme "başlat"a döner.
    setPaused(true)
    show(move[0], move[1])
    tabs.current[move[0]]?.focus()
  }

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setKeyboardFocus(false)
  }

  // Yalnızca fare: dokunmada pointerleave güvenilir gelmez, geçiş kalıcı olarak takılı kalırdı.
  const onPointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') setHovered(true)
  }
  const onPointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') setHovered(false)
  }

  return (
    <>
      <div ref={ref} className={`${cardStyles.stage} ${cardStyles.appStage} ${styles.stage}`} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
        <div className={styles.phone}>
          <span className={styles.floor} aria-hidden="true" />
          <div
            id={panelId}
            className={styles.screen}
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={`${id}-tab-${index}`}
            aria-describedby={metaId}
            aria-live={running ? 'off' : 'polite'}
          >
            {screens.map((screen, i) => {
              const state = i === index ? 'active' : i === previous ? 'previous' : 'idle'
              const animate = reduce
                ? { opacity: state === 'active' ? 1 : 0, x: 0 }
                : state === 'active'
                  ? { opacity: 1, x: [dir * SHIFT, 0] }
                  : state === 'previous'
                    ? { opacity: 0, x: -dir * SHIFT }
                    : { opacity: 0 }
              return (
                <motion.div
                  key={screen.id}
                  className={styles.slide}
                  aria-hidden={state === 'active' ? undefined : true}
                  initial={false}
                  animate={animate}
                  transition={reduce || state === 'idle' ? { duration: 0 } : { duration: 0.45, ease: revealEase }}
                >
                  <picture>
                    <source type="image/avif" srcSet={`${screen.src}.avif`} />
                    <img src={`${screen.src}.webp`} alt={screen.alt} width={780} height={1692} loading={loading} decoding="async" />
                  </picture>
                </motion.div>
              )
            })}
          </div>
          <img className={styles.frame} src="/img/home/zone/phone-frame.webp" alt="" width={726} height={1444} loading={loading} decoding="async" />
        </div>
      </div>

      <div className={cardStyles.body}>
        <h4 className={cardStyles.cardTitle}>{copy.title}</h4>
        <p className={cardStyles.text}>{copy.text}</p>
        <p id={metaId} className={cardStyles.meta}>
          {copy.meta}
        </p>
        <div className={styles.controls} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
          <div
            className={styles.labels}
            role="tablist"
            aria-label={copy.screensLabel}
            onKeyDown={onKeyDown}
            onFocus={(event) => setKeyboardFocus(event.target.matches(':focus-visible'))}
            onBlur={onBlur}
          >
            {screens.map((screen, i) => (
              <button
                key={screen.id}
                ref={(element) => {
                  tabs.current[i] = element
                }}
                id={`${id}-tab-${i}`}
                type="button"
                role="tab"
                className={styles.label}
                aria-selected={i === index}
                aria-controls={panelId}
                tabIndex={i === index ? 0 : -1}
                onClick={() => {
                  // Fare, dokunma ya da Enter/Space ile seçilen ekran kalıcıdır; otomatik geçiş duraklar.
                  setPaused(true)
                  show(i, i > index ? 1 : -1)
                }}
              >
                {screen.label}
              </button>
            ))}
          </div>
          {reduce ? null : (
            <button type="button" className={styles.toggle} onClick={() => setPaused((value) => !value)} aria-label={paused ? copy.play : copy.pause}>
              <span className={styles.toggleIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  {paused ? <path d="M8 5.5v13l10.5-6.5z" /> : <path d="M7.5 5h3v14h-3zM13.5 5h3v14h-3z" />}
                </svg>
              </span>
            </button>
          )}
        </div>
      </div>
    </>
  )
}
