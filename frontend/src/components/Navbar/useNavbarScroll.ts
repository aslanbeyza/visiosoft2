import { useRef, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'framer-motion'

const TOP_THRESHOLD = 24

/**
 * Sayfa kaydırmasından navbar üst/altı temasını türetir.
 * Navbar her zaman görünür kalır; kaydırınca gizlenmez.
 */
export function useNavbarScroll() {
  const { scrollY } = useScroll()
  const [atTop, setAtTop] = useState(() => (typeof window === 'undefined' ? true : window.scrollY < TOP_THRESHOLD))
  const atTopRef = useRef(atTop)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const nextAtTop = y < TOP_THRESHOLD
    if (nextAtTop !== atTopRef.current) {
      atTopRef.current = nextAtTop
      setAtTop(nextAtTop)
    }
  })

  return { atTop, hiddenByScroll: false }
}
