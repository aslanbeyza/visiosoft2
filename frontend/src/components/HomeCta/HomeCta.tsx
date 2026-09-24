import { useCallback, useState } from 'react'
import Dialog from '../Dialog/index.ts'
import { homeCtaCopy as text } from './homeCtaCopy.ts'
import styles from './HomeCta.module.css'

const VIDEO = {
  src: '/img/home/cta/intro.mp4',
}

export default function HomeCta() {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <section id="baslayin" className={styles.cta} aria-label={text.play}>
      <button
        type="button"
        className={styles.media}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={text.play}
      >
        <div className={styles.backdrop} aria-hidden="true">
          <svg className={styles.circuit} viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" focusable="false">
            <g stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.55">
              <path d="M0 120 H180 L220 160 H420 L460 120 H640 L680 80 H900 L940 120 H1200" />
              <path d="M0 280 H140 L180 240 H360 L400 280 H580 L620 320 H820 L860 280 H1200" />
              <path d="M120 0 V400 M320 0 V400 M520 0 V400 M720 0 V400 M920 0 V400" opacity="0.35" />
              <path d="M80 200 H260 M340 200 H520 M600 200 H780 M860 200 H1120" opacity="0.45" />
            </g>
            <g fill="currentColor">
              <circle cx="180" cy="120" r="3.5" />
              <circle cx="420" cy="160" r="3" />
              <circle cx="640" cy="120" r="3.5" />
              <circle cx="900" cy="80" r="3" />
              <circle cx="140" cy="280" r="3" />
              <circle cx="360" cy="240" r="3.5" />
              <circle cx="580" cy="280" r="3" />
              <circle cx="820" cy="320" r="3.5" />
              <circle cx="320" cy="200" r="2.5" opacity="0.7" />
              <circle cx="520" cy="200" r="2.5" opacity="0.7" />
              <circle cx="720" cy="200" r="2.5" opacity="0.7" />
            </g>
          </svg>
        </div>
        <div className={styles.content}>
          <div className={styles.titleBlock}>
            <div className={styles.titleRow}>
              <span className={styles.titlePart}>{text.brandLeft}</span>
              <span className={styles.playMark} aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M8 5.2v13.6L19 12z" />
                </svg>
              </span>
              <span className={styles.titlePart}>{text.brandRight}</span>
            </div>
            <p className={styles.playHint}>{text.playHint}</p>
          </div>
          <p className={styles.tagline}>{text.tagline}</p>
          <p className={styles.subline}>{text.subline}</p>
        </div>
      </button>

      <Dialog open={open} onClose={close} title={text.videoTitle} hideHeader flush size="lg" className={styles.player}>
        <div className={styles.playerFrame}>
          <video className={styles.playerVideo} controls autoPlay playsInline>
            <source src={VIDEO.src} type="video/mp4" />
          </video>
        </div>
      </Dialog>
    </section>
  )
}
