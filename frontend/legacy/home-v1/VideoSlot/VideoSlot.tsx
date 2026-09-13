import { useEffect, useRef, useState } from 'react'
import styles from './VideoSlot.module.css'
import { slotUi, videoSlots } from './videoSlots.ts'
import type { SlotId } from './videoSlots.ts'

type VideoSlotProps = {
  id: SlotId
  className?: string
  poster?: string
}

export default function VideoSlot({ id, className = '', poster }: VideoSlotProps) {
  const slot = videoSlots[id]
  const ui = slotUi
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
  const [copied, setCopied] = useState(false)
  const [brokenImage, setBrokenImage] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.load()
  }, [id])

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(slot.prompt)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const fileName = slot.file.split('/').pop() ?? slot.file
  const posterSrc = poster ?? slot.poster
  const showFallback = Boolean(slot.fallbackImage) && !ready && !brokenImage

  return (
    <div className={`${styles.slot} ${ready ? styles.ready : ''} ${className}`.trim()}>
      <video
        ref={videoRef}
        className={styles.media}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        poster={posterSrc}
        onCanPlay={() => {
          setReady(true)
          videoRef.current?.play().catch(() => undefined)
        }}
        onError={() => setReady(false)}
      >
        {slot.sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </video>

      {showFallback ? (
        <img
          className={styles.fallback}
          src={slot.fallbackImage}
          alt=""
          onError={() => setBrokenImage(true)}
        />
      ) : null}

      <div className={styles.placeholder} aria-hidden={ready}>
        <div className={styles.grid} />
        <div className={styles.scan} />
        <div className={styles.top}>
          <span>{ui.missing}</span>
          <span className={styles.dot} />
        </div>
        <p className={styles.file}>{fileName}</p>
        <p className={styles.meta}>
          {ui.drop} · {slot.aspect} · {slot.duration}
          {slot.startImage ? ` · ${ui.start}: ${slot.startImage.split('/').pop()}` : ''}
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.copy}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              void copyPrompt()
            }}
          >
            {copied ? ui.copied : ui.copy}
          </button>
          <span className={styles.engine}>{ui.engine}</span>
        </div>
      </div>
    </div>
  )
}
