import type { CSSProperties } from 'react'

type PictureProps = {
  /** WebP/PNG/JPEG yedek kaynak. */
  src: string
  /** AVIF srcset (ör. "/img/a-720.avif 720w, /img/a-1280.avif 1280w" veya tek dosya). */
  avif?: string
  /** WebP srcset; src zaten tek WebP ise gerekmez. */
  webp?: string
  sizes?: string
  alt: string
  /** CLS oluşmaması için gerçek piksel ölçüleri. */
  width: number
  height: number
  className?: string
  pictureClassName?: string
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
  style?: CSSProperties
}

/** AVIF + WebP kaynaklı, ölçüleri tanımlı görsel. Varsayılan olarak lazy yüklenir. */
export default function Picture({
  src,
  avif,
  webp,
  sizes,
  alt,
  width,
  height,
  className,
  pictureClassName,
  loading = 'lazy',
  fetchPriority,
  style,
}: PictureProps) {
  return (
    <picture className={pictureClassName}>
      {avif ? <source type="image/avif" srcSet={avif} sizes={sizes} /> : null}
      {webp ? <source type="image/webp" srcSet={webp} sizes={sizes} /> : null}
      <img
        className={className}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        sizes={sizes}
        style={style}
      />
    </picture>
  )
}
