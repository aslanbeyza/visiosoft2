
let depth = 0
let saved: { overflow: string; paddingRight: string } | null = null
let inertRoot: Element | null = null

export function lockPage(): () => void {
  if (typeof document === 'undefined') return () => {}

  if (depth === 0) {
    const { body, documentElement } = document
    saved = { overflow: body.style.overflow, paddingRight: body.style.paddingRight }
    const scrollbar = window.innerWidth - documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`

    const root = document.getElementById('root')
    if (root && !root.hasAttribute('inert')) {
      root.setAttribute('inert', '')
      inertRoot = root
    }
  }

  depth += 1
  let released = false

  return () => {
    if (released) return
    released = true
    depth = Math.max(0, depth - 1)
    if (depth > 0) return

    document.body.style.overflow = saved?.overflow ?? ''
    document.body.style.paddingRight = saved?.paddingRight ?? ''
    inertRoot?.removeAttribute('inert')
    inertRoot = null
    saved = null
  }
}
