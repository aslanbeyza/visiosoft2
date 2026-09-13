import { useRef, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'framer-motion'

const TOP_THRESHOLD = 24
const HIDE_AFTER = 480
const DIRECTION_TOLERANCE = 6

/**
 * Sayfa kaydırmasından navbar durumunu türetir.
 * State yalnızca eşik ya da yön değiştiğinde güncellenir; her karede render yapılmaz.
 */
export function useNavbarScroll() {
  const { scrollY } = useScroll()
  const [atTop, setAtTop] = useState(() => (typeof window === 'undefined' ? true : window.scrollY < TOP_THRESHOLD))
  const [hiddenByScroll, setHiddenByScroll] = useState(false)
  const atTopRef = useRef(atTop)
  const hiddenRef = useRef(false)
  const lastY = useRef<number | null>(null)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const nextAtTop = y < TOP_THRESHOLD
    if (nextAtTop !== atTopRef.current) {
      atTopRef.current = nextAtTop
      setAtTop(nextAtTop)
    }

    const previous = lastY.current ?? y
    const delta = y - previous
    // Küçük titreşimleri biriktir; yön ancak belirgin bir hareketle değişsin.
    if (y > HIDE_AFTER && Math.abs(delta) < DIRECTION_TOLERANCE) return
    lastY.current = y

    const nextHidden = y > HIDE_AFTER && delta > 0
    if (nextHidden !== hiddenRef.current) {
      hiddenRef.current = nextHidden
      setHiddenByScroll(nextHidden)
    }
  })

  return { atTop, hiddenByScroll }
}
