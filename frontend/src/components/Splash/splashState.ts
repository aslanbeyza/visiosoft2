import { useSyncExternalStore } from 'react'
import { isPdfRender } from './pdfMode.ts'

const KEY = 'visiosoft-splash'

function readSeen(): boolean {
  try {
    return window.sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

function writeSeen() {
  try {
    window.sessionStorage.setItem(KEY, '1')
  } catch {

  }
}

function initialActive(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false

  if (isPdfRender()) return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  return !readSeen()
}

let active = initialActive()
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function isSplashActive() {
  return active
}

export function finishSplash() {
  writeSeen()
  if (!active) return
  active = false
  for (const listener of listeners) listener()
}

export function useSplashActive(): boolean {
  return useSyncExternalStore(subscribe, isSplashActive, () => false)
}
