import type { PointerEvent as ReactPointerEvent, ReactElement } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useMediaQuery } from '../../hooks/useMediaQuery/index.ts'
import styles from './Magnetic.module.css'

/**
 * Kullanım: `<Magnetic><Button to={path('quote.index')}>Teklif Al</Button></Magnetic>`
 * Birincil düğmeler işaretçiye doğru en fazla `strength` px kayar, ayrılınca yayla geri döner (M11).
 * Yalnızca hassas işaretçide (fare) çalışır; dokunmatik ve hareket azaltmada etkisizdir.
 */
export type MagneticProps = {
  children: ReactElement
  /** Azami kayma (px). */
  strength?: number
  className?: string
  /**
   * Doldurma kipi: sarmalayıcı flex/grid hücresinde uzar ve içindeki düğme onu doldurur.
   * Satırı dolduran düğmeler için sayfada `> span > a` gibi seçicilere gerek bırakmaz: `<Magnetic fill>`.
   */
  fill?: boolean
}

const clamp = (value: number) => Math.min(1, Math.max(-1, value))

export default function Magnetic({ children, strength = 6, className = '', fill = false }: MagneticProps) {
  const reduce = Boolean(useReducedMotion())
  const fine = useMediaQuery('(pointer: fine)')
  const active = fine && !reduce

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 220, damping: 20, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 220, damping: 20, mass: 0.5 })

  const onPointerMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (!active || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    x.set(clamp(dx) * strength)
    y.set(clamp(dy) * strength)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      className={`${styles.magnetic} ${fill ? styles.fill : ''} ${className}`.replace(/\s+/g, ' ').trim()}
      style={active ? { x: springX, y: springY } : undefined}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </motion.span>
  )
}
