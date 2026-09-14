import type { CSSProperties } from 'react'
import styles from './ScreenPatches.module.css'

/**
 * Ekran görüntüsü üzerinde ad değiştirme/gizleme yaması. Ölçüler kaynak pikselidir (görsel genişliği `width`).
 * - text: zemin rengiyle kapatılıp nötr metin yazılır (ör. saha adı yerine "Merkez")
 * - blank: yalnızca zemin rengiyle kapatılır
 * - blur: aynı görselin o bölgesi bulanıklaştırılarak gösterilir (telefon numarası, fiyat)
 */
export type ScreenPatch = {
  x: number
  y: number
  w: number
  h: number
  bg: string
  text?: string
  /** Metin boyutu (kaynak px). */
  size?: number
  weight?: number
  color?: string
  /** Metnin sol boşluğu (kaynak px); verilmezse ortalanır. */
  inset?: number
  /** Bulanıklık yarıçapı (kaynak px). */
  blur?: number
  /** Köşe yarıçapı (kaynak px). */
  radius?: number
}

type ScreenPatchesProps = {
  width: number
  height: number
  patches: readonly ScreenPatch[] | undefined
  /** blur yamaları için görsel yolu (uzantısız: .avif ve .webp). */
  image?: string
  /** blur kopyasının yükleme biçimi; alttaki görselle aynı olmalıdır. */
  loading?: 'lazy' | 'eager'
}

/** Yamalar kapsayıcı genişliğine (cqw) göre ölçeklenir; kapsayıcıda `container-type: inline-size` olmalıdır. */
export default function ScreenPatches({ width, height, patches, image, loading = 'lazy' }: ScreenPatchesProps) {
  if (!patches?.length) return null
  const unit = (px: number) => `${(px / width) * 100}cqw`

  return (
    <span className={styles.root} aria-hidden="true">
      {patches.map((patch) => {
        const style: CSSProperties = {
          left: unit(patch.x),
          top: unit(patch.y),
          width: unit(patch.w),
          height: unit(patch.h),
          background: patch.bg,
          borderRadius: patch.radius ? unit(patch.radius) : undefined,
          // Aynı renkte 1-2 px yumuşak kenar: sıkıştırma kaynaklı kenar izleri görünmez.
          boxShadow: `0 0 ${unit(2)} ${unit(1)} ${patch.bg}`,
        }
        if (patch.text) {
          Object.assign(style, {
            justifyContent: patch.inset === undefined ? 'center' : 'flex-start',
            paddingLeft: patch.inset === undefined ? 0 : unit(patch.inset),
            color: patch.color ?? '#fff',
            fontSize: unit(patch.size ?? 16),
            fontWeight: patch.weight ?? 600,
          })
        }
        return (
          <span key={`${patch.x}-${patch.y}`} className={styles.patch} style={style}>
            {patch.text ?? null}
            {patch.blur && image ? (
              <picture>
                <source type="image/avif" srcSet={`${image}.avif`} />
                <img
                  className={styles.blurImage}
                  src={`${image}.webp`}
                  alt=""
                  width={width}
                  height={height}
                  loading={loading}
                  decoding="async"
                  // Boyut satır içinde verilir: kapsayıcıların genel `img { width: 100% }` kuralları görseli yamaya sıkıştırmasın.
                  style={{
                    left: unit(-patch.x),
                    top: unit(-patch.y),
                    width: unit(width),
                    height: unit(height),
                    maxWidth: 'none',
                    objectFit: 'fill',
                    filter: `blur(${unit(patch.blur)})`,
                  }}
                />
              </picture>
            ) : null}
          </span>
        )
      })}
    </span>
  )
}
