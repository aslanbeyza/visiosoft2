import type { PointerEvent } from 'react'

export function spotlightMove(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse') return
  const target = event.currentTarget
  const rect = target.getBoundingClientRect()
  target.style.setProperty('--mx', `${Math.round(event.clientX - rect.left)}px`)
  target.style.setProperty('--my', `${Math.round(event.clientY - rect.top)}px`)
}

export function spotlightLeave(event: PointerEvent<HTMLElement>) {
  const target = event.currentTarget
  target.style.removeProperty('--mx')
  target.style.removeProperty('--my')
}
