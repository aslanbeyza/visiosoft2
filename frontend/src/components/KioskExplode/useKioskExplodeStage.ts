import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { useInView, useMotionValueEvent, useScroll } from 'framer-motion'
import type { ExplodeCopy } from './explodeVariants.ts'
import { phaseIndexAt } from './explodeVariants.ts'
import { clearPointer, padCount, writePointer, writeStageFromProgress } from './kioskExplodeStage.ts'

export function useKioskExplodeStage(copy: ExplodeCopy) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLSpanElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const phaseRef = useRef(0)
  const [phase, setPhase] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const isInView = useInView(sectionRef, { margin: '200px 0px', amount: 0.05 })
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    writeStageFromProgress(progress)
    if (railRef.current) railRef.current.style.transform = `scaleY(${progress.toFixed(3)})`
    if (counterRef.current) counterRef.current.textContent = padCount(Math.round(progress * 100))
    const nextPhase = phaseIndexAt(copy.phases, progress)
    if (nextPhase !== phaseRef.current) {
      phaseRef.current = nextPhase
      setPhase(nextPhase)
    }
  })

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsMounted(true)
          observer.disconnect()
        }
      },
      { rootMargin: '400px 0px' },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isInView) return
    writeStageFromProgress(scrollYProgress.get())
  }, [isInView, scrollYProgress])

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    writePointer(event.clientX, event.clientY, event.currentTarget.getBoundingClientRect())
  }

  const handlePointerLeave = () => {
    clearPointer()
  }

  return {
    sectionRef,
    railRef,
    counterRef,
    phase,
    isMounted,
    isInView,
    handlePointerMove,
    handlePointerLeave,
    currentPhase: copy.phases[phase],
    phaseCount: copy.phases.length,
  }
}
