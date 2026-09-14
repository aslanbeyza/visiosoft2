import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Picture from '../../components/Picture/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import { hubImages } from './softwareHubCopy.ts'
import type { HubImage } from './softwareHubCopy.ts'
import styles from './PhoneFrame.module.css'

type PhoneFrameProps = {
  image: HubImage
  /** Görsel çevresindeki metin ekranı zaten anlatıyorsa true (alt boş kalır). */
  decorative?: boolean
  eager?: boolean
  /**
   * Açılış kipi (direction verilmediğinde):
   * undefined: ilk ekran statik, sonraki ekran değişimleri açılarak gelir.
   * null: açılış bekliyor (ekran kapalı). sayı: bu gecikmeyle yukarıdan aşağı açılır.
   */
  revealDelay?: number | null
  /**
   * Adım kipi: 1 ileri, -1 geri. Verilirse çerçeve sabit kalır, yalnızca ekran katmanı
   * 16 px kayarak ve saydamlaşarak değişir (0,45 s). Hareket azaltmada anında değişir.
   */
  direction?: 1 | -1
  /**
   * Adım kipinde tüm ekranlar (image dahil) üst üste, kalıcı katmanlar olarak çizilir. Görseller bölüme yaklaşırken
   * yüklenir ve DOM'da kalır; ilk sekme değişiminde bile ekran boş (beyaz) görünmez.
   */
  screens?: HubImage[]
  sizes?: string
  className?: string
}

// "on": sağdan/soldan 16 px kayarak belirir · "off": ters yöne kayarak saydamlaşır (görünmeyen katmanlarda iz bırakmaz).
const slide = {
  on: (dir: number) => ({ opacity: [0, 1], x: [16 * dir, 0], zIndex: 2 }),
  off: (dir: number) => ({ opacity: 0, x: -16 * dir, zIndex: 1 }),
}

const enter = {
  enter: (dir: number) => ({ opacity: 0, x: 16 * dir }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: -16 * dir }),
}

/** Gerçek telefon çerçevesi (şeffaf ekranlı görsel) içinde uygulama ekranı; çerçeve bir kez çizilir, ekran katmanı değişir. */
export default function PhoneFrame({
  image,
  decorative = false,
  eager = false,
  revealDelay,
  direction,
  screens,
  sizes = '(min-width: 1024px) 16rem, 60vw',
  className = '',
}: PhoneFrameProps) {
  const reduce = Boolean(useReducedMotion())
  const frame = hubImages.phoneFrame
  const stepMode = direction !== undefined
  const waiting = revealDelay === null
  const hidden = { clipPath: 'inset(0% 0% 100% 0%)' }
  const open = { clipPath: 'inset(0% 0% 0% 0%)' }
  const instantExit = { opacity: 0, transition: { duration: 0 } }

  const renderPicture = (item: HubImage, hide = false) => (
    <Picture
      src={item.src}
      avif={item.avif}
      width={item.width}
      height={item.height}
      alt={decorative || hide ? '' : item.alt}
      className={styles.img}
      pictureClassName={styles.picture}
      loading={eager ? 'eager' : 'lazy'}
      sizes={sizes}
    />
  )
  const picture = renderPicture(image)

  return (
    <div className={`${styles.phone} ${className}`.trim()}>
      <div className={styles.screen}>
        {stepMode && screens ? (
          screens.map((item) => {
            const current = item.src === image.src
            return (
              <motion.div
                key={item.src}
                className={styles.layer}
                custom={direction}
                variants={slide}
                initial={false}
                animate={current ? 'on' : 'off'}
                transition={reduce ? { duration: 0 } : { duration: 0.45, ease: revealEase }}
                aria-hidden={current ? undefined : true}
              >
                {renderPicture(item, !current)}
              </motion.div>
            )
          })
        ) : stepMode ? (
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={image.src}
              className={styles.layer}
              custom={direction}
              variants={enter}
              initial={reduce ? false : 'enter'}
              animate="center"
              exit={reduce ? instantExit : 'exit'}
              transition={{ duration: 0.45, ease: revealEase }}
            >
              {picture}
            </motion.div>
          </AnimatePresence>
        ) : (
          <AnimatePresence initial={revealDelay !== undefined}>
            <motion.div
              key={image.src}
              className={styles.layer}
              initial={reduce ? false : hidden}
              animate={waiting ? undefined : open}
              exit={reduce ? instantExit : { zIndex: 0, opacity: 0, transition: { duration: 0.3, delay: 0.55 } }}
              transition={{ duration: 0.85, delay: revealDelay ?? 0, ease: revealEase }}
            >
              <motion.div
                className={styles.zoom}
                initial={reduce ? false : { scale: 1.06 }}
                animate={waiting ? undefined : { scale: 1 }}
                transition={{ duration: 1.1, delay: revealDelay ?? 0, ease: revealEase }}
              >
                {picture}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      <Picture
        src={frame.src}
        webp={frame.webp}
        avif={frame.avif}
        width={frame.width}
        height={frame.height}
        alt=""
        className={styles.frame}
        pictureClassName={styles.framePicture}
        loading={eager ? 'eager' : 'lazy'}
        sizes={sizes}
      />
    </div>
  )
}
