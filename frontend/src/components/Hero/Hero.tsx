import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { revealEase } from '../Reveal/motion.ts'
import { STATIC_PHASE, heroVideo } from './heroTimeline.ts'
import HeroIntro from './HeroIntro.tsx'
import HeroStatus from './HeroStatus.tsx'
import { useHeroPlayback } from './useHeroPlayback.ts'
import { usePrefersReducedMotion } from './usePrefersReducedMotion.ts'
import { useVideoPhase } from './useVideoPhase.ts'
import styles from './Hero.module.css'

export default function Hero() {
  const reduce = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mobile] = useState(() => window.matchMedia('(max-width: 640px)').matches)
  const [playing, setPlaying] = useState(false)

  useHeroPlayback(videoRef, sectionRef, reduce)
  const { phase: livePhase, progress } = useVideoPhase(videoRef, !reduce)
  const phase = reduce ? STATIC_PHASE : livePhase
  const sources = mobile ? heroVideo.mobile : heroVideo.desktop

  return (
    <section ref={sectionRef} className={styles.hero}>
      <div className={styles.media} aria-hidden="true">
        <video
          ref={videoRef}
          className={styles.video}
          poster={heroVideo.poster}
          muted
          playsInline
          loop
          autoPlay={!reduce}
          preload={reduce ? 'none' : mobile ? 'metadata' : 'auto'}
          disablePictureInPicture
          tabIndex={-1}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          {}
          {reduce
            ? null
            : sources.map((source) => <source key={source.src} src={source.src} type={source.type} />)}
        </video>
        <div className={`${styles.shade} ${styles.shadeStack}`} />
        <div className={`${styles.shade} ${styles.shadeSide}`} />
        <div className={`${styles.shade} ${styles.shadeCorner}`} />
        <div className={`${styles.shade} ${styles.shadeBottom}`} />
        <div className={`${styles.shade} ${styles.shadeTop}`} />
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          <HeroIntro reduce={reduce} />

          <motion.div
            className={styles.aside}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: revealEase, delay: 0.9 }}
          >
            <HeroStatus phase={phase} progress={progress} reduce={reduce} playing={playing} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
