import { useRef } from 'react'
import type { MouseEvent } from 'react'
import { useReducedMotion } from 'framer-motion'
import Button from '../Button/index.ts'
import VideoSlot from '../VideoSlot/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { storyFrameCopy } from './storyFrameCopy.ts'
import styles from './StoryFrame.module.css'

export default function StoryFrame() {
  const { t } = useLocale()
  const path = usePath()
  const text = storyFrameCopy
  const reduce = useReducedMotion()
  const frameRef = useRef<HTMLDivElement>(null)

  const tilt = (event: MouseEvent<HTMLDivElement>) => {
    if (reduce || !frameRef.current) return
    const rect = frameRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const rotateX = ((y - rect.height / 2) / rect.height) * -14
    const rotateY = ((x - rect.width / 2) / rect.width) * 14
    frameRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  const reset = () => {
    if (frameRef.current) frameRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)'
  }

  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.copy}>
          <img className={styles.brand} src="/img/hgspark.png" alt="HGS Park" width="220" height="80" />
          <h2>{text.title}</h2>
          <p>{text.description}</p>
          <div className={styles.actions}>
            <Button to={path('hgs-park')}>{text.primary}</Button>
            <Button to={path('quote.index')} variant="ghost">
              {t('Teklif Al')}
            </Button>
          </div>
        </div>

        <div className={styles.stage}>
          <div
            ref={frameRef}
            className={styles.frame}
            onMouseMove={tilt}
            onMouseLeave={reset}
            style={{ transition: 'transform 0.28s var(--ease-apple, cubic-bezier(0.25, 1, 0.5, 1))' }}
          >
            <VideoSlot id="hgs" />
          </div>
          <div className={styles.summary}>
            <p>3</p>
            {text.rows.map((row) => (
              <div key={row}>{row}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
