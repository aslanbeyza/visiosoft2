import { useSyncExternalStore } from 'react'
import { isPdfRender } from './pdfMode.ts'

/*
 * Açılış perdesinin oturum başına bir kez gösterilmesi. Karar modül yüklenirken verilir; böylece ilk
 * boyamada perde zaten yerindedir (effect içinde setState yok). sessionStorage erişimi try/catch içindedir
 * (gizli mod, kısıtlı depolama). PageTransition, perde bitmeden rota perdesini çalıştırmaz.
 */
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
    // Depolama kapalıysa perde her sayfa yüklemesinde bir kez daha görünür; kabul edilebilir.
  }
}

function initialActive(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  // PDF çıktısında perde hiç açılmaz ve oturum işareti de yazılmaz.
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

/** Perde kapanınca çağrılır; oturum işaretini yazar ve dinleyicileri bilgilendirir. */
export function finishSplash() {
  writeSeen()
  if (!active) return
  active = false
  for (const listener of listeners) listener()
}

export function useSplashActive(): boolean {
  return useSyncExternalStore(subscribe, isSplashActive, () => false)
}
