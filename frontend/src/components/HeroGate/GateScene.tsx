import { createElement, useEffect } from 'react'

export type PhaseDetail = {
  phase: string
  plate: string
  vehicle: string
  colourTr: string
  colourEn: string
  scenario: 'card' | 'hgs'
}

type Props = {
  onPhase?: (detail: PhaseDetail) => void
  className?: string
}

// Port of visiosoft.com.tr lib/three/gate-scene.js: importing it defines the <vs-gate-scene>
// custom element, which dispatches a 'vs-phase' event on window at every phase.
export default function GateScene({ onPhase, className }: Props) {
  useEffect(() => {
    void import('./gate-scene.js')
    const handler = (e: Event) => onPhase?.((e as CustomEvent<PhaseDetail>).detail)
    window.addEventListener('vs-phase', handler)
    return () => window.removeEventListener('vs-phase', handler)
  }, [onPhase])

  return createElement('vs-gate-scene', { class: className })
}
