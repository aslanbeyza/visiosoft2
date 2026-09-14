import { AnimatePresence, motion } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import type { ReactNode } from 'react'
import { revealEase } from '../Reveal/motion.ts'
import { heroCopy } from './heroCopy.ts'
import { stageOf, stages } from './heroTimeline.ts'
import type { Phase } from './heroTimeline.ts'
import PlateChip from './PlateChip.tsx'
import StatusSteps from './StatusSteps.tsx'
import styles from './HeroStatus.module.css'
import parts from './StatusParts.module.css'

type HeroStatusProps = {
  phase: Phase
  /** "Plaka okunuyor…" rayı (0–1), videonun zamanından. */
  progress: MotionValue<number>
  reduce: boolean
  playing: boolean
  /** Başlık satırının sağ ucundaki denetim (video duraklat/oynat). */
  control?: ReactNode
}

const hud = heroCopy.hud

/**
 * Videoyla eşzamanlı geçiş kartı. Görsel içerik ekran okuyuculardan gizlidir;
 * yerine sabit bir özet okunur (otomatik değişen içerikte aria-live yok).
 */
export default function HeroStatus({ phase, progress, reduce, playing, control }: HeroStatusProps) {
  const stage = stageOf(phase)
  const swap = { duration: reduce ? 0 : 0.35, ease: revealEase }
  const layer = (visible: boolean) => ({
    initial: false as const,
    animate: { opacity: visible ? 1 : 0, y: visible ? 0 : 4 },
    transition: swap,
  })

  return (
    <div className={styles.card} role="group" aria-label={hud.label} data-playing={playing && !reduce}>
      <p className="sr-only">{hud.summary}</p>

      <div className={styles.header}>
        <span className={styles.live} aria-hidden="true">
          <span className={styles.liveDot} />
          {hud.live}
        </span>
        <span className={styles.headerEnd}>
          <span className={styles.camera} aria-hidden="true">
            {hud.camera}
          </span>
          {control}
        </span>
      </div>

      <div aria-hidden="true">
        <div className={styles.headline}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={stage}
              className={styles.headlineText}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4, transition: { duration: reduce ? 0 : 0.18 } }}
              transition={swap}
            >
              {hud.stages[stage].headline}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className={styles.detail}>
          {/* Plaka yuvası: algılamada okuma rayı, doğrulamadan sonra plaka (bariyer açılınca da kalır). */}
          <div className={`${styles.slot} ${styles.slotPlate}`}>
            <motion.div className={styles.layer} {...layer(stage === 'detect')}>
              <motion.span className={styles.note} {...layer(phase === 'reading')}>
                {hud.reading}
              </motion.span>
              <span className={parts.rail}>
                <motion.span className={parts.railFill} style={{ scaleX: progress }} />
              </span>
            </motion.div>
            <motion.div className={styles.layer} {...layer(stage !== 'detect')}>
              <PlateChip plate={hud.plate} band={hud.plateLabel} active={stage !== 'detect'} reduce={reduce} />
            </motion.div>
          </div>

          <div className={`${styles.slot} ${styles.slotNote}`}>
            <motion.span className={styles.note} {...layer(phase === 'paid')}>
              {hud.paid}
            </motion.span>
            <motion.span className={styles.farewell} {...layer(stage === 'open')}>
              {hud.farewell}
            </motion.span>
          </div>
        </div>

        <StatusSteps
          labels={stages.map((id) => hud.stages[id].step)}
          reached={stages.indexOf(stage)}
          reduce={reduce}
        />
      </div>
    </div>
  )
}
