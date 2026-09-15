import { useCallback, useState } from 'react'
import Dialog from '../Dialog/index.ts'
import { homeCtaCopy as text } from './homeCtaCopy.ts'
import styles from './HomeCta.module.css'

const VIDEO = {
  src: '/img/home/cta/intro.mp4',
  poster: '/img/home/cta/intro.jpg',
}

/**
 * Ana sayfa tanıtım bandı: durağan kare, üçgen oynatıcı açar.
 * Dönüşüm düğmeleri burada yok — Hero, Navbar ve Footer'da durur.
 */
export default function HomeCta() {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <section id="baslayin" className={styles.cta} aria-label={text.play}>
      <div className={styles.media} aria-hidden="true">
        <img className={styles.still} src={VIDEO.poster} alt="" />
        <div className={styles.shade} />
      </div>

      <div className={styles.inner}>
        <button type="button" className={styles.play} onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={text.play}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M8 5.2v13.6L19 12z" />
          </svg>
        </button>
      </div>

      <Dialog open={open} onClose={close} title={text.videoTitle} hideHeader flush size="lg" className={styles.player}>
        <div className={styles.playerFrame}>
          <video className={styles.playerVideo} poster={VIDEO.poster} controls autoPlay playsInline>
            <source src={VIDEO.src} type="video/mp4" />
          </video>
        </div>
      </Dialog>
    </section>
  )
}
