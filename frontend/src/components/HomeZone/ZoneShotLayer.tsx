import { useEffect } from 'react'
import { animate, motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import { shotSize, startPose, targetPose, usesMobileCrop } from './camera.ts'
import ZoneRedactions from './ZoneRedactions.tsx'
import type { ZoneTourItem } from './zoneTour.ts'
import styles from './ZoneFrame.module.css'

export type LayerState = 'active' | 'previous' | 'idle'

type ZoneShotLayerProps = {
  item: ZoneTourItem
  state: LayerState
  aspect: number
  /** Ölçülen çerçeve genişliği (CSS px); 0 = henüz ölçülmedi. */
  frameWidth: number
  /** pan: masaüstü kamera hareketi + silme geçişi · fade: mobil sabit kırpım + yumuşak geçiş · still: azaltılmış hareket */
  mode: 'pan' | 'fade' | 'still'
}

const cameraEase = [0.42, 0, 0.18, 1] as const

/** Tek bir Zone ekran görüntüsü katmanı: etkinleşince kendi odak bölgesine yavaşça yaklaşır. */
export default function ZoneShotLayer({ item, state, aspect, frameWidth, mode }: ZoneShotLayerProps) {
  const mobileCrop = usesMobileCrop(item, aspect, frameWidth)
  // Masaüstü pozu genişliğe bağlı değildir; kamera hareketi yalnızca telefon kırpımında genişlik değişince yenilenir.
  const cropWidth = mobileCrop ? frameWidth : 0
  const initial = targetPose(item, aspect, cropWidth)
  const x = useMotionValue(initial.x)
  const y = useMotionValue(initial.y)
  const s = useMotionValue(initial.s)
  const transform = useMotionTemplate`translate3d(${x}%, ${y}%, 0) scale(${s})`
  const active = state === 'active'

  useEffect(() => {
    const target = targetPose(item, aspect, cropWidth)
    if (!active || mode !== 'pan') {
      // Etkin olmayan katman ya da sabit kırpım: hedef poz anında uygulanır.
      if (!active && mode === 'pan') return
      x.jump(target.x)
      y.jump(target.y)
      s.jump(target.s)
      return
    }
    const start = startPose(item, aspect, cropWidth)
    x.jump(start.x)
    y.jump(start.y)
    s.jump(start.s)
    const options = { duration: 3.2, ease: cameraEase }
    const controls = [animate(x, target.x, options), animate(y, target.y, options), animate(s, target.s, options)]
    return () => controls.forEach((control) => control.stop())
  }, [active, aspect, cropWidth, item, mode, s, x, y])

  const wipe = mode === 'pan'
  const visible = state !== 'idle'
  const { crop } = item.shot
  const size = shotSize(item.shot)
  // Kırpımda tam görsel kırpımdan geniştir; kaynak katmanı kırpımın solundan ve üstünden taşar, tuval taşanı gizler.
  const sourceScale = crop ? item.shot.width / crop.w : 1
  const sourceStyle = crop
    ? { width: `${sourceScale * 100}%`, left: `${(-crop.x / crop.w) * 100}%`, top: `${(-crop.y / crop.h) * 100}%` }
    : undefined
  // Tarayıcı, görselin çerçevede kaplayacağı genişliğe göre 1200 ya da 1896 px sürümü seçer.
  const sizes = frameWidth > 0 ? `${Math.ceil(frameWidth * initial.s * sourceScale)}px` : '100vw'
  const showRing = item.region.w < 0.9 && !mobileCrop

  return (
    <motion.div
      className={styles.layer}
      style={{ background: item.shot.ground, zIndex: active ? 2 : state === 'previous' ? 1 : 0 }}
      aria-hidden={active ? undefined : true}
      initial={false}
      animate={
        active
          ? wipe
            ? { clipPath: ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)'], opacity: 1 }
            : { clipPath: 'inset(0% 0% 0% 0%)', opacity: mode === 'fade' ? [0, 1] : 1 }
          : { clipPath: 'inset(0% 0% 0% 0%)', opacity: visible ? 1 : 0 }
      }
      transition={
        mode === 'still' || !active
          ? { duration: 0 }
          : { duration: wipe ? 0.95 : 0.5, ease: revealEase }
      }
    >
      <motion.div
        className={styles.canvas}
        style={{ transform, aspectRatio: `${size.width} / ${size.height}` }}
        data-active={active ? 'true' : 'false'}
        data-crop={crop ? 'true' : undefined}
      >
        <div className={styles.source} style={sourceStyle}>
          <picture>
            <source type="image/avif" srcSet={item.shot.avifSrcSet} sizes={sizes} />
            <img
              className={styles.shot}
              src={item.shot.src}
              srcSet={item.shot.srcSet}
              sizes={sizes}
              alt={item.alt}
              width={item.shot.width}
              height={item.shot.height}
              loading="lazy"
              decoding="async"
            />
          </picture>
          <ZoneRedactions shot={item.shot.key} />
        </div>
        {showRing ? (
          // Odak halkası: açıklamada anlatılan bölgeyi işaretler; kamera yerleştikten sonra belirir.
          <motion.span
            className={styles.ring}
            aria-hidden="true"
            style={{
              left: `${item.region.x * 100}%`,
              top: `${item.region.y * 100}%`,
              width: `${item.region.w * 100}%`,
              height: `${item.region.h * 100}%`,
              ['--ring' as string]: `${2 / initial.s}px`,
            }}
            initial={false}
            animate={{ opacity: active ? 1 : 0 }}
            transition={active && mode !== 'still' ? { duration: 0.7, delay: mode === 'pan' ? 1.9 : 0.5, ease: revealEase } : { duration: 0 }}
          />
        ) : null}
      </motion.div>
    </motion.div>
  )
}
