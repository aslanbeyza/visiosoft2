import { useCallback, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'
import styles from './BentoTilt.module.css'

type BentoTiltProps = {
  children: ReactNode
  className?: string
}

export default function BentoTilt({ children, className = '' }: BentoTiltProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('')

  const onMove = useCallback(
      (event: MouseEvent<HTMLDivElement>) => {
      if (reduce || !ref.current) return
      const { left, top, width, height } = ref.current.getBoundingClientRect()
      const relativeX = (event.clientX - left) / width
      const relativeY = (event.clientY - top) / height
      const tiltX = (relativeY - 0.5) * 12
      const tiltY = (relativeX - 0.5) * -12
      setTransform(`perspective(760px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(0.97, 0.97, 0.97)`)
    },
    [reduce],
  )

  return (
    <div
      ref={ref}
      className={`${styles.tilt} ${className}`.trim()}
      onMouseMove={onMove}
      onMouseLeave={() => setTransform('')}
      style={{ transform } as CSSProperties}
    >
      {children}
    </div>
  )
}
