import { useEffect, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import Button from '../Button/index.ts'
import Magnetic from '../Magnetic/index.ts'
import Reveal, { revealEase } from '../Reveal/index.ts'
import TextReveal from '../TextReveal/index.ts'
import { useMediaQuery } from '../../hooks/useMediaQuery/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { homeCtaCopy as text } from './homeCtaCopy.ts'
import styles from './HomeCta.module.css'

/** Işık halkasının çapı (px); CSS'teki .spot ile aynı olmalı. */
const SPOT = 560
const spring = { stiffness: 140, damping: 24, mass: 0.6 }
const actionsReveal = { duration: 0.8, delay: 0.4, ease: revealEase }

/**
 * Ana sayfa 4.8 — Son çağrı: lacivert bant, sabit ızgara ve yalnızca farede imleci izleyen yumuşak ışık.
 * Işık katmanı transform ile taşınır; içindeki parlak ızgara ters yönde kaydırılarak zemin ızgarasıyla hizalı kalır.
 * Düğmeler klavye odağı geldiği anda tam görünür olur (yarı saydam düğmeye odak halkası çizilmez).
 * `data-page-cta`: bu bant varken Footer aynı iki düğmeyi tekrar göstermez (Footer.module.css).
 */
export default function HomeCta() {
  const path = usePath()
  const reduce = useReducedMotion()
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)')
  const active = fine && !reduce

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, spring)
  const sy = useSpring(y, spring)
  const spotX = useTransform(sx, (value) => value - SPOT / 2)
  const spotY = useTransform(sy, (value) => value - SPOT / 2)
  const gridX = useTransform(spotX, (value) => -value)
  const gridY = useTransform(spotY, (value) => -value)
  const opacity = useMotionValue(0)

  const actionsRef = useRef<HTMLDivElement>(null)
  const actionsInView = useInView(actionsRef, { once: true, amount: 0.25 })
  const actionsOpacity = useMotionValue(reduce ? 1 : 0)
  const actionsY = useMotionValue(reduce ? 0 : 16)

  useEffect(() => {
    if (reduce) {
      actionsOpacity.jump(1)
      actionsY.jump(0)
      return
    }
    if (!actionsInView) return
    const fade = animate(actionsOpacity, 1, actionsReveal)
    const rise = animate(actionsY, 0, actionsReveal)
    return () => {
      fade.stop()
      rise.stop()
    }
  }, [reduce, actionsInView, actionsOpacity, actionsY])

  /** Odak düğmelere girerse süren/bekleyen giriş hareketi durur ve son duruma atlanır. */
  const settleActions = () => {
    actionsOpacity.jump(1)
    actionsY.jump(0)
  }

  const place = (event: ReactPointerEvent<HTMLElement>, jump: boolean) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const px = event.clientX - rect.left
    const py = event.clientY - rect.top
    x.set(px)
    y.set(py)
    if (jump) {
      sx.jump(px)
      sy.jump(py)
    }
  }

  const onEnter = (event: ReactPointerEvent<HTMLElement>) => {
    if (!active || event.pointerType !== 'mouse') return
    place(event, opacity.get() < 0.05)
    animate(opacity, 1, { duration: 0.6, ease: 'easeOut' })
  }

  const onMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!active || event.pointerType !== 'mouse') return
    place(event, false)
    if (opacity.get() < 1) animate(opacity, 1, { duration: 0.6, ease: 'easeOut' })
  }

  const onLeave = () => {
    if (!active) return
    animate(opacity, 0, { duration: 0.8, ease: 'easeOut' })
  }

  return (
    <section
      id="baslayin"
      className={styles.cta}
      aria-labelledby="home-cta-title"
      data-page-cta=""
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onFocusCapture={settleActions}
    >
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.horizon} aria-hidden="true" />
      {active ? (
        <motion.div className={styles.spot} style={{ x: spotX, y: spotY, opacity }} aria-hidden="true">
          <motion.div className={styles.spotGrid} style={{ x: gridX, y: gridY }} />
        </motion.div>
      ) : null}

      <div className={styles.inner}>
        <TextReveal as="h2" id="home-cta-title" className={styles.title} text={text.title} />
        <Reveal as="p" className={styles.lead} delay={0.25} y={16}>
          {text.lead}
        </Reveal>
        <motion.div ref={actionsRef} className={styles.actions} style={{ opacity: actionsOpacity, y: actionsY }}>
          <Magnetic>
            <Button to={path('quote.index')} variant="light" size="lg" arrow className={styles.button}>
              {text.primary}
            </Button>
          </Magnetic>
          <Button to={path('discovery.show')} variant="outlineLight" size="lg" className={styles.button}>
            {text.secondary}
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
