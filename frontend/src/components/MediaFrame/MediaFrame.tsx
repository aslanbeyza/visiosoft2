import { useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import styles from './MediaFrame.module.css'

/**
 * Kullanım:
 * `<MediaFrame ratio="16 / 9" caption="Zone canlı harita ekranı" chips={[{ label: 'Kamera görüntüsü' }]}>`
 * `  <Picture src="…" avif="…" width={1600} height={922} alt="…" />`
 * `</MediaFrame>`
 * Fotoğraf/ekran görüntüsü çerçevesi (M4): kırpılmamış figure görünüme girince çerçeve yukarıdan aşağı açılır,
 * görsel 1,08 → 1 ölçeğine oturur; kaydırmada ±parallax% yavaşça kayar. Hareket azaltmada tamamen statik.
 * Arayüz ekran görüntülerinde `mode="screenshot"`: ölçek yok, görüntü güvenli iç payın içinde en fazla 6 px kayar, hiç kırpılmaz.
 */
export type MediaFrameChip = { label: string; tone?: 'navy' | 'success' | 'neutral' }

export type MediaFrameProps = {
  /** Bir `<img>` ya da `<Picture>` (video da olabilir). */
  children: ReactNode
  /** CSS aspect-ratio değeri, ör. "16 / 9". Verilmezse görselin doğal oranı kullanılır. */
  ratio?: string
  /** Kaydırmaya bağlı kayma yüzdesi (±). 0 kapatır. */
  parallax?: number
  reveal?: 'clip' | 'fade' | 'none'
  caption?: string
  chips?: MediaFrameChip[]
  radius?: 'md' | 'lg'
  className?: string
  /** Koyu zeminlerde çerçeve ve alt yazı renkleri. */
  tone?: 'light' | 'dark'
  /** photo kipinde görselin çerçeveyi doldurma biçimi (varsayılan cover). screenshot kipinde her zaman contain. */
  fit?: 'cover' | 'contain'
  /** Açılış için görünmesi gereken oran. */
  amount?: number
  /**
   * photo (varsayılan): parallax'ta görsel hafifçe büyütülür, kenarlar kırpılabilir.
   * screenshot: arayüz görüntüleri için; hiç ölçeklenmez ve kırpılmaz. `ratio` iç kutuya uygulanır, görsel contain ile sığar;
   * oran tutmazsa kalan alan nötr paspartu olarak görünür. Kayma yalnızca güvenli iç pay içinde küçük bir öteleme,
   * gölge kırpma katmanının dışındadır.
   */
  mode?: 'photo' | 'screenshot'
}

/** Ekran görüntüsü kipinde kayma sınırı (px): CSS'teki 12 px iç paydan 1 px çizgi ve 5 px güvenlik payı düşülür. */
const SCREENSHOT_MAX_SHIFT = 6

export default function MediaFrame({
  children,
  ratio,
  parallax = 4,
  reveal = 'clip',
  caption,
  chips,
  radius = 'lg',
  className = '',
  tone = 'light',
  fit,
  amount = 0.25,
  mode = 'photo',
}: MediaFrameProps) {
  const reduce = Boolean(useReducedMotion())
  const frameRef = useRef<HTMLElement>(null)
  // Kırpılan katman kendi görünürlüğünü bildiremez; tetik kırpılmamış figure'dan gelir.
  const inView = useInView(frameRef, { once: true, amount })
  const screenshot = mode === 'screenshot'
  // Ekran görüntüsünde kenar yazıları hiçbir koşulda kırpılmasın.
  const effectiveFit = screenshot ? 'contain' : (fit ?? 'cover')

  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'end start'] })
  const shift = Math.max(0, parallax)
  const y = useTransform(scrollYProgress, [0, 1], [`-${shift}%`, `${shift}%`])
  const safeShift = Math.min(SCREENSHOT_MAX_SHIFT, shift * 2)
  const safeY = useTransform(scrollYProgress, [0, 1], [-safeShift, safeShift])
  const useParallax = !reduce && shift > 0
  const parallaxScale = 1 + Math.max(0.06, shift * 0.025)
  const parallaxStyle = useParallax ? (screenshot ? { y: safeY } : { y, scale: parallaxScale }) : undefined
  const ratioStyle = ratio ? { aspectRatio: ratio } : undefined

  const animateReveal = !reduce && reveal !== 'none'
  const animateZoom = animateReveal && !screenshot
  const clipInitial = reveal === 'fade' ? { opacity: 0, y: 20 } : { clipPath: 'inset(0% 0% 100% 0%)' }
  const clipTarget = reveal === 'fade' ? { opacity: 1, y: 0 } : { clipPath: 'inset(0% 0% 0% 0%)' }

  // photo kipinde etiketler görselin üstünde yüzer; screenshot kipinde görüntünün üstünde, paspartu içinde ayrı bir satırdır.
  const chipList = chips?.length ? (
    <ul className={styles.chips}>
      {chips.map((chip) => (
        <li key={chip.label} className={styles.chip} data-tone={chip.tone ?? 'neutral'}>
          {chip.label}
        </li>
      ))}
    </ul>
  ) : null

  return (
    <figure
      ref={frameRef}
      className={`${styles.frame} ${className}`.trim()}
      data-tone={tone}
      data-radius={radius}
      data-mode={mode}
      style={{ '--fit': effectiveFit } as CSSProperties}
    >
      <div className={styles.stage}>
        {/* Gölge kırpma katmanının kardeşidir; clip-path ve overflow onu kesmez, perde açılırken belirir. */}
        {screenshot ? (
          <motion.span
            className={styles.shadow}
            aria-hidden="true"
            initial={animateReveal ? { opacity: 0 } : false}
            animate={animateReveal && inView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.7, delay: 0.5, ease: revealEase }}
          />
        ) : null}

        <motion.div
          className={styles.clip}
          style={screenshot ? undefined : ratioStyle}
          initial={animateReveal ? clipInitial : false}
          animate={animateReveal && inView ? clipTarget : undefined}
          transition={{ duration: 1.1, ease: revealEase }}
        >
          {screenshot ? chipList : null}

          <motion.div className={styles.parallax} style={screenshot ? { ...ratioStyle, ...parallaxStyle } : parallaxStyle}>
            <motion.div
              className={styles.zoom}
              initial={animateZoom ? { scale: 1.08 } : false}
              animate={animateZoom && inView ? { scale: 1 } : undefined}
              transition={{ duration: 1.2, ease: revealEase }}
            >
              {children}
            </motion.div>
          </motion.div>

          {screenshot ? null : chipList}
        </motion.div>
      </div>

      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  )
}
