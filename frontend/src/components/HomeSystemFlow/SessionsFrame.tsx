import Picture from '../Picture/index.ts'
import { homeSystemFlowCopy as text } from './homeSystemFlowCopy.ts'
import styles from './SessionsFrame.module.css'

type SessionsFrameProps = {
  className?: string
}

/** Adım 6: gerçek Zone oturumlar ekranı, ince tarayıcı çerçevesinde; başlık çubuğu aynı zamanda alt yazıdır. */
export default function SessionsFrame({ className = '' }: SessionsFrameProps) {
  const image = text.sessions

  return (
    <figure className={`${styles.frame} ${className}`.trim()}>
      <figcaption className={styles.bar}>
        <span className={styles.dots} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className={styles.caption}>{image.caption}</span>
      </figcaption>
      <Picture
        src={image.src}
        avif={image.avif}
        width={image.width}
        height={image.height}
        alt={image.alt}
        className={styles.image}
        pictureClassName={styles.picture}
      />
    </figure>
  )
}
