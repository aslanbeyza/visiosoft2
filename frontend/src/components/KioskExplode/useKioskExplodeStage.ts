import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { useInView, useMotionValueEvent, useScroll } from 'framer-motion'
import { kioskExplodeCopy, phaseIndexAt } from './kioskExplodeCopy.ts'
import { clamp, clearPointer, mapRange, padCount, writePointer, writeStageFromProgress } from './kioskExplodeStage.ts'

function applyHeadFade(head: HTMLElement, progress: number) {
  const fade = 1 - clamp(mapRange(progress, 0.12, 0.42))
  head.style.opacity = fade.toFixed(3)
  head.style.transform = `translateY(${((1 - fade) * -32).toFixed(1)}px)`
  head.style.visibility = fade < 0.04 ? 'hidden' : 'visible'
}

/**
 * Kaydırma ilerlemesini 3B sahneye yazar; faz indeksini React’e yalnızca değişince taşır.
 * Model, bölüm yaklaşınca bir kez yüklenir.
 */
export function useKioskExplodeStage() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLElement>(null)
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
    if (headRef.current) applyHeadFade(headRef.current, progress)
    const nextPhase = phaseIndexAt(progress)
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
    headRef,
    railRef,
    counterRef,
    phase,
    isMounted,
    isInView,
    handlePointerMove,
    handlePointerLeave,
    currentPhase: kioskExplodeCopy.phases[phase],
    phaseCount: kioskExplodeCopy.phases.length,
  }
}
