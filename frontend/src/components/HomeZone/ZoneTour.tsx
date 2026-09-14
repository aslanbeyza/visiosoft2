import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { FocusEvent, PointerEvent } from 'react'
import { animate, useInView, useMotionValue, useReducedMotion } from 'framer-motion'
import Reveal from '../Reveal/index.ts'
import { useMediaQuery } from '../../hooks/useMediaQuery/index.ts'
import { usePageVisible } from '../../hooks/usePageVisible/index.ts'
import { homeZoneCopy as copy } from './homeZoneCopy.ts'
import ZoneFrame from './ZoneFrame.tsx'
import ZoneTabs from './ZoneTabs.tsx'
import { TOUR_INTERVAL, tabId, zoneTour } from './zoneTour.ts'
import styles from './ZoneTour.module.css'

/**
 * Zone turu: solda altı modül sekmesi, sağda gerçek ekran görüntüleriyle tarayıcı çerçevesi.
 * Otomatik geçiş yalnızca bölüm görünürken, sekme açıkken ve kullanıcı sekmelerle/görüntüyle etkileşimde değilken ilerler.
 */
export default function ZoneTour() {
  const idBase = `zone${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const rootRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion() ?? false
  const desktop = useMediaQuery('(min-width: 1024px)')
  // Tablette çerçeve masaüstü oranını korur; yalnızca dar telefonda daha yüksek (4:3) kırpım kullanılır.
  const wide = useMediaQuery('(min-width: 640px)')
  const pageVisible = usePageVisible()
  const inView = useInView(rootRef, { amount: 0.35 })
  const [tour, setTour] = useState<{ active: number; previous: number | null }>({ active: 0, previous: null })
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const progress = useMotionValue(0)
  const shownRef = useRef(0)
  const { active, previous } = tour

  const select = useCallback((index: number) => {
    setTour((current) => (current.active === index ? current : { active: index, previous: current.active }))
  }, [])

  const running = !reduce && inView && pageVisible && !hovered && !focused && !paused

  useEffect(() => {
    // Öğe değiştiyse ilerleme sıfırdan başlar; eski animasyon temizlikte zaten durdurulmuştur.
    if (shownRef.current !== active) {
      shownRef.current = active
      progress.set(0)
    }
    if (!running) return
    const remaining = Math.max(0.05, ((1 - progress.get()) * TOUR_INTERVAL) / 1000)
    const controls = animate(progress, 1, {
      duration: remaining,
      ease: 'linear',
      onComplete: () => select((active + 1) % zoneTour.length),
    })
    return () => controls.stop()
  }, [active, progress, running, select])

  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') setHovered(true)
  }
  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') setHovered(false)
  }
  const onFocus = () => setFocused(true)
  const onBlur = (event: FocusEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false)
  }

  const item = zoneTour[active]
  const mode = reduce ? 'still' : desktop ? 'pan' : 'fade'

  return (
    <div ref={rootRef} className={styles.tour}>
      <Reveal className={styles.tabsCol} y={24}>
        <ZoneTabs
          items={zoneTour}
          active={active}
          onSelect={select}
          progress={progress}
          showProgress={!reduce}
          idBase={idBase}
          vertical={desktop}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {/* Mobilde seçili modülün açıklaması çiplerin hemen altında, görüntünün üstünde durur. */}
        <p className={styles.mobileDesc} aria-hidden="true">
          {item.description}
        </p>
      </Reveal>

      <Reveal className={styles.frameCol} y={40} delay={0.1}>
        <ZoneFrame
          items={zoneTour}
          active={active}
          previous={previous}
          aspect={wide ? 16 / 10 : 4 / 3}
          mode={mode}
          progress={progress}
          panelId={`${idBase}-panel`}
          tabId={tabId(idBase, item.id)}
          paused={reduce ? null : paused}
          onTogglePause={() => setPaused((value) => !value)}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
        />
        <p className={styles.caption}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5M12 8h.01" />
          </svg>
          {copy.caption}
        </p>
      </Reveal>
    </div>
  )
}
