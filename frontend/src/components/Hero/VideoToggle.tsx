import styles from './Hero.module.css'

type VideoToggleProps = {
  paused: boolean
  onToggle: () => void
  playLabel: string
  pauseLabel: string
}

/** Arka plan videosu için 44 px duraklat/oynat düğmesi; durum kartını da dondurur. */
export default function VideoToggle({ paused, onToggle, playLabel, pauseLabel }: VideoToggleProps) {
  return (
    <button type="button" className={styles.toggle} onClick={onToggle} aria-label={paused ? playLabel : pauseLabel}>
      <svg viewBox="0 0 20 20" className={styles.toggleIcon} aria-hidden="true">
        {paused ? (
          <path d="M6.5 4.6v10.8a.6.6 0 0 0 .92.5l8.2-5.4a.6.6 0 0 0 0-1l-8.2-5.4a.6.6 0 0 0-.92.5Z" fill="currentColor" />
        ) : (
          <>
            <rect x="5.5" y="4.5" width="3" height="11" rx="0.8" fill="currentColor" />
            <rect x="11.5" y="4.5" width="3" height="11" rx="0.8" fill="currentColor" />
          </>
        )}
      </svg>
    </button>
  )
}
