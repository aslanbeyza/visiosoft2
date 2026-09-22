import { useEffect, useMemo, useRef, useState } from 'react'
import Section from '../../components/Section/index.ts'
import { hubOnStreetCopy } from './hubOnStreetCopy.ts'
import styles from './HubOnStreetSection.module.css'

const copy = hubOnStreetCopy

function labelUpper(text: string) {
  return text.toLocaleUpperCase('tr-TR')
}

export default function HubOnStreetSection() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current
        if (!video) return
        if (entry.isIntersecting) {
          if (!ready) {
            video.preload = 'auto'
            video.load()
            setReady(true)
          }
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { rootMargin: '1200px 0px', threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ready])

  const groups = useMemo(
    () =>
      copy.transactions.map((tx) => ({
        tx,
        steps: copy.chapters.filter((chapter) => chapter.group === tx.id),
      })),
    [],
  )

  const activeChapterIndex = copy.chapters.reduce((acc, chapter, index) => (time >= chapter.at ? index : acc), 0)
  const activeStep = copy.chapters[activeChapterIndex]
  const activeTx = activeStep?.group ?? copy.transactions[0].id

  const seek = (at: number) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = at
    video.play().catch(() => {})
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) video.play().catch(() => {})
    else video.pause()
  }

  return (
    <Section id="yol-ustu" tone="surface" spacing="lg" labelledBy="hub-yol-ustu-title">
      <div ref={wrapRef} className={styles.grid}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <h2 id="hub-yol-ustu-title" className={styles.title}>
            {copy.title}{' '}
            <span className={styles.titleAccent}>{copy.titleAccent}</span>
          </h2>
          <p className={styles.lede}>{copy.lede}</p>
          <ul className={styles.points}>
            {copy.points.map((point) => (
              <li key={point.title} className={styles.point}>
                <span className={styles.pointDot} aria-hidden="true" />
                <div>
                  <p className={styles.pointTitle}>{point.title}</p>
                  <p className={styles.pointDesc}>{point.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.timelineBlock}>
            <p className={styles.timelineKicker}>{copy.kayittaLabel}</p>
            <div className={styles.tabs} role="tablist" aria-label="Kayıttaki işlemler">
              {groups.map(({ tx }) => {
                const isActive = activeTx === tx.id
                return (
                  <button
                    key={tx.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`hub-islem-${tx.id}`}
                    id={`hub-sekme-${tx.id}`}
                    className={isActive ? styles.tabActive : styles.tab}
                    onClick={() => seek(tx.from)}
                  >
                    {tx.label}
                  </button>
                )
              })}
            </div>

            {groups.map(({ tx, steps }) => {
              if (activeTx !== tx.id) return null
              const liveIndex = steps.findIndex((step) => step === activeStep)
              return (
                <ol
                  key={tx.id}
                  id={`hub-islem-${tx.id}`}
                  role="tabpanel"
                  aria-labelledby={`hub-sekme-${tx.id}`}
                  className={styles.steps}
                >
                  {steps.map((step, index) => {
                    const isDone = index < liveIndex
                    const isLive = index === liveIndex
                    const isLast = index === steps.length - 1
                    return (
                      <li key={`${step.group}-${step.at}`} className={styles.step}>
                        {!isLast ? (
                          <span
                            className={styles.stepLine}
                            data-done={isDone ? '' : undefined}
                            aria-hidden="true"
                          />
                        ) : null}
                        <span
                          className={styles.stepDot}
                          data-done={isDone || isLive ? '' : undefined}
                          data-live={isLive ? '' : undefined}
                          aria-hidden="true"
                        />
                        <button
                          type="button"
                          className={styles.stepButton}
                          data-done={isDone ? '' : undefined}
                          data-live={isLive ? '' : undefined}
                          aria-current={isLive ? 'step' : undefined}
                          onClick={() => seek(step.at)}
                        >
                          {step.label}
                        </button>
                      </li>
                    )
                  })}
                </ol>
              )
            })}
          </div>
        </div>

        <figure className={styles.figure} data-onstreet>
          <div className={styles.figureHead}>
            <span className={styles.recBadge}>
              <span className={styles.recDot} aria-hidden="true" />
              Saha kaydı
            </span>
            <span className={styles.deviceLabel}>El terminali</span>
          </div>

          <div className={styles.videoWrap}>
            <video
              ref={videoRef}
              src={copy.videoSrc}
              aria-label={copy.videoAriaLabel}
              muted
              loop
              playsInline
              preload="none"
              className={styles.video}
              onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
            <span className={styles.vignette} aria-hidden="true" />
            <span className={styles.videoOverlay}>
              <span className={styles.overlayTx}>
                {labelUpper(copy.transactions.find((tx) => tx.id === activeTx)?.label ?? '')}
              </span>
              <span className={styles.overlayStep}>{labelUpper(activeStep?.label ?? '')}</span>
            </span>
            {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
              <span key={corner} className={`${styles.corner} ${styles[`corner_${corner}`]}`} aria-hidden="true" />
            ))}
            <button
              type="button"
              className={styles.playToggle}
              onClick={togglePlay}
              aria-label={playing ? 'Duraklat' : 'Oynat'}
            >
              <span className={styles.playToggleLabel}>{playing ? 'Duraklat' : 'Oynat'}</span>
            </button>
          </div>

          <div className={styles.progressRow}>
            {copy.transactions.map((tx) => {
              const span = tx.to - tx.from
              const done = Math.min(1, Math.max(0, (time - tx.from) / span))
              return (
                <div
                  key={tx.id}
                  role="progressbar"
                  aria-label={`${tx.label} · ${tx.plate}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(done * 100)}
                  className={styles.progressTrack}
                  style={{ flex: span }}
                  title={`${tx.label} · ${tx.plate}`}
                >
                  <div className={styles.progressFill} style={{ width: `${done * 100}%` }} />
                </div>
              )
            })}
          </div>
          <div className={styles.progressLabels}>
            {copy.transactions.map((tx) => (
              <span
                key={tx.id}
                className={styles.progressLabel}
                data-active={activeTx === tx.id ? '' : undefined}
                style={{ flex: tx.to - tx.from }}
              >
                {labelUpper(tx.label)}
              </span>
            ))}
          </div>

          <figcaption className={styles.caption}>{copy.note}</figcaption>
        </figure>
      </div>
    </Section>
  )
}
