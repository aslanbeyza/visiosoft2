import type { CSSProperties } from 'react'

type PictureProps = {

  src: string

  avif?: string

  webp?: string
  sizes?: string
  alt: string

  width: number
  height: number
  className?: string
  pictureClassName?: string
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
  style?: CSSProperties
}

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
