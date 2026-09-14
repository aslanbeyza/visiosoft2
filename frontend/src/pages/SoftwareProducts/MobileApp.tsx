import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { AnimatePresence, LayoutGroup, motion, useInView, useReducedMotion } from 'framer-motion'
import Button from '../../components/Button/index.ts'
import Picture from '../../components/Picture/index.ts'
import Reveal, { revealEase } from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import PhoneFrame from './PhoneFrame.tsx'
import { parkbizBrand as brand, mobileCopy as text } from './softwareHubCopy.ts'
import type { MobileFeatureIcon } from './softwareHubCopy.ts'
import styles from './MobileApp.module.css'

const pad = (value: number) => String(value).padStart(2, '0')
const RINGS = [150, 215, 280]
const ICONS: Record<MobileFeatureIcon | 'phone' | 'play', string> = {
  debt: 'M6 3h12v18l-3-2-3 2-3-2-3 2V3z M9.5 8h5 M9.5 12h5 M9.5 16h2.5',
  subscription: 'M4 6h16v14H4z M4 10h16 M8 3.5v4 M16 3.5v4 M9 15l2 2 4-4',
  card: 'M3 6h18v12H3z M3 10h18 M7 14.5h4',
  status: 'M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z M12 7.5v3 M12 12.5v.5',
  phone: 'M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z M11 18h2',
  play: 'M7.5 4.5l12 7.5-12 7.5z',
}

/**
 * Yeni ekran görseli henüz yüklenmediyse yüklenene (ya da hata verene) kadar beklenir; eski ekran bu sürede görünür
 * kalır, sekme ve metin paneli ise hemen değişir. Süre yalnızca takılı kalan bir isteğe karşı güvenlik sınırıdır.
 */
const SWAP_WAIT_MS = 4000
const SCREENS = text.steps.map((item) => item.image)

/** Telefondaki (kalıcı katman) görsel yüklenip çözüldüyse hemen, değilse çözülünce ya da süre dolunca döner. */
function whenScreenReady(img: HTMLImageElement | null | undefined): Promise<void> | null {
  if (!img || (img.complete && img.naturalWidth > 0)) return null
  const decoded = img.decode().catch(() => undefined)
  return Promise.race([decoded, new Promise<void>((resolve) => window.setTimeout(resolve, SWAP_WAIT_MS))])
}

/** Dar ekranda kaydırılabilir sekme satırının kenar geçişleri (data özniteliği; React state'i yok). */
function syncEdges(list: HTMLElement | null, wrap: HTMLElement | null) {
  if (!list || !wrap) return
  const max = list.scrollWidth - list.clientWidth
  wrap.dataset.fadeStart = String(list.scrollLeft > 4)
  wrap.dataset.fadeEnd = String(max - list.scrollLeft > 4)
}

function Icon({ name, className }: { name: keyof typeof ICONS; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  )
}

/** Mobil uygulama: gerçek ParkBiz ekranları sabit telefon çerçevesinde; sekme değişince yalnızca ekran katmanı kayar. */
export default function MobileApp() {
  const reduce = Boolean(useReducedMotion())
  const path = usePath()
  const uid = useId()
  // index: seçili sekme ve metin paneli (anında) · screen: telefondaki ekran (görsel hazır olunca) · dir: kayma yönü.
  const [{ index: active, screen, dir }, setView] = useState<{ index: number; screen: number; dir: 1 | -1 }>({ index: 0, screen: 0, dir: 1 })
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const listRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const request = useRef(0)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const observer = new ResizeObserver(() => syncEdges(list, scrollerRef.current))
    observer.observe(list)
    return () => observer.disconnect()
  }, [])

  // Kaydırılabilir satırda seçili sekme kenar geçişinin altında kalmaz; sayfa dikeyde kaydırılmaz.
  useEffect(() => {
    const list = listRef.current
    const tab = tabRefs.current[active]
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return
    const edge = 36
    const start = tab.offsetLeft
    const end = start + tab.offsetWidth
    let left = list.scrollLeft
    if (start - edge < left) left = Math.max(0, start - edge)
    else if (end + edge > left + list.clientWidth) left = end + edge - list.clientWidth
    if (left !== list.scrollLeft) list.scrollTo({ left, behavior: reduce ? 'auto' : 'smooth' })
  }, [active, reduce])
  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stageRef, { once: true, amount: 0.25 })
  const count = text.steps.length
  const step = text.steps[active]
  const panelId = `${uid}-panel`
  const tabId = (id: string) => `${uid}-tab-${id}`

  const select = (next: number) => {
    const token = ++request.current
    const src = text.steps[next].image.src
    const show = (current: { index: number; screen: number; dir: 1 | -1 }) =>
      current.index === next && current.screen === next
        ? current
        : { index: next, screen: next, dir: next === current.screen ? current.dir : next > current.screen ? (1 as const) : (-1 as const) }
    const img = [...(stageRef.current?.querySelectorAll('img') ?? [])].find((el) => el.getAttribute('src') === src)
    const wait = whenScreenReady(img)
    if (!wait) {
      setView(show)
      return
    }
    // Görsel henüz yüklenmediyse sekme hemen seçilir; telefonda eski ekran, yenisi hazır olana dek kalır.
    setView((current) => (current.index === next ? current : { ...current, index: next }))
    void wait.then(() => {
      if (request.current === token) setView(show)
    })
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const targets: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: count - 1 }
    if (!(event.key in targets)) return
    event.preventDefault()
    const next = (targets[event.key] + count) % count
    select(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <Section id="mobile-app" tone="paper" spacing="md" labelledBy="hub-mobile-title">
      <div className={styles.layout}>
        <div className={styles.head}>
          <SectionHeading eyebrow={text.eyebrow} title={text.title} lead={text.lead} id="hub-mobile-title" className={styles.heading} />
          <Reveal as="p" className={styles.brand} delay={0.25} y={12}>
            <Picture src={brand.mark.src} webp={brand.mark.webp} width={brand.mark.width} height={brand.mark.height} alt="" className={styles.brandMark} />
            {text.brandLine}
          </Reveal>
        </div>

        <Reveal className={styles.tabs} delay={0.1} amount={0.2}>
          <LayoutGroup id={uid}>
            {/* Dar ekranda tek satır, yatay kaydırılır; kenar geçişleri devam eden sekmeleri gösterir. */}
            <div ref={scrollerRef} className={styles.tabScroller} data-fade-start="false" data-fade-end="false">
              <div
                ref={listRef}
                role="tablist"
                aria-label={text.tablistLabel}
                className={styles.tablist}
                onScroll={() => syncEdges(listRef.current, scrollerRef.current)}
              >
                {text.steps.map((item, index) => {
                  const selected = index === active
                  return (
                    <button
                      key={item.id}
                      ref={(el) => {
                        tabRefs.current[index] = el
                      }}
                      type="button"
                      role="tab"
                      id={tabId(item.id)}
                      // Görsel sıra numarası adın parçası değil: sekme ve panel "Borç öde" diye okunur.
                      aria-label={item.label}
                      aria-selected={selected}
                      aria-controls={panelId}
                      tabIndex={selected ? 0 : -1}
                      className={styles.tab}
                      onClick={() => select(index)}
                      onKeyDown={onKeyDown}
                    >
                      <span className={styles.tabIndex} aria-hidden="true">
                        {pad(index + 1)}
                      </span>
                      <span className={styles.tabLabel}>
                        {item.label}
                        {selected ? (
                          <motion.span
                            layoutId="hub-mobile-tab"
                            className={styles.tabLine}
                            style={{ borderRadius: 3 }}
                            aria-hidden="true"
                            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 44 }}
                          />
                        ) : null}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </LayoutGroup>
        </Reveal>

        <div ref={stageRef} className={styles.stage}>
          {/* Halkalar telefonun merkezine sabitlenir; sağ sütunun yüksekliği değişse de telefon yerinden oynamaz. */}
          <div className={styles.phoneSlot}>
            <svg className={styles.rings} viewBox="0 0 600 600" aria-hidden="true">
              {RINGS.map((r) => (
                <circle key={r} cx="300" cy="300" r={r} />
              ))}
            </svg>
            <motion.div
              className={styles.phoneWrap}
              initial={reduce ? false : { opacity: 0, y: 40 }}
              animate={inView || reduce ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 1, delay: 0.1, ease: revealEase }}
            >
              <span className={styles.floor} aria-hidden="true" />
              <PhoneFrame
                image={SCREENS[screen]}
                screens={SCREENS}
                direction={dir}
                sizes="(min-width: 1024px) 16rem, (min-width: 768px) 17rem, (min-width: 480px) 16rem, 58vw"
              />
            </motion.div>
          </div>
          <p className={styles.caption}>{text.note}</p>
        </div>

        <Reveal className={styles.panelWrap} delay={0.12} amount={0.2}>
          <div role="tabpanel" id={panelId} aria-labelledby={tabId(step.id)} className={styles.panel} tabIndex={0}>
            {/*
             * Tüm adım metinleri aynı hücrede görünmez olarak durur: panel her genişlikte en uzun açıklama kadar olur.
             * Sekme değişince alttaki kartlar ve telefon oynamaz, kısa metinlerde de fazladan boşluk kalmaz.
             */}
            {text.steps.map((item) => (
              <div key={item.id} className={styles.panelSizer} aria-hidden="true">
                <p className={styles.stepTitle}>{item.title}</p>
                <p className={styles.stepText}>{item.description}</p>
              </div>
            ))}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step.id}
                className={styles.panelCurrent}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.4, ease: revealEase }}
              >
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        <Reveal className={styles.featuresWrap} delay={0.15} amount={0.2}>
          <ul className={styles.features} aria-label={text.featuresLabel}>
            {text.features.map((feature) => (
              <li key={feature.title} className={styles.feature}>
                <span className={styles.featureIcon}>
                  <Icon name={feature.icon} />
                </span>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureText}>{feature.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className={styles.actions} delay={0.2} amount={0.2}>
          <Button to={path(text.cta.primary.route)} arrow>
            {text.cta.primary.label}
          </Button>
          <div className={styles.stores} role="group" aria-label={text.cta.storesLabel}>
            <Button href={brand.appStoreUrl} external variant="secondary">
              <Icon name="phone" className={styles.storeIcon} />
              <span className="sr-only">{text.cta.storeContext} </span>
              {text.cta.appStore}
            </Button>
            <Button href={brand.playStoreUrl} external variant="secondary">
              <Icon name="play" className={styles.storeIcon} />
              <span className="sr-only">{text.cta.storeContext} </span>
              {text.cta.googlePlay}
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
