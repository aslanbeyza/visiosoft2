import { useEffect } from 'react'
import type { RefObject } from 'react'
import { animate, cancelFrame, frame } from 'framer-motion'
import type { MotionValue } from 'framer-motion'

/** --ease-apple ile aynı eğri; SubNav'ın 0,45 sn'lik kaymasıyla eş zamanlı kalır. */
const EASE = [0.25, 1, 0.5, 1] as const
const DURATION = 0.45

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/**
 * Navbar gizlenince yapışmış kartları onun bıraktığı boşluğa kaydırır; henüz yapışmamış kartlar yerinde kalır.
 * Her kart için hedef konum: max(doğal konum, yapışma üstü − navbar yüksekliği × h), yapışkan konumu aşmadan.
 * Böylece kart bölüm başlığının üstüne binmez ve navbar gizliyken doğrudan yeni yapışma noktasında durur.
 * h (0 → 1) navbar durumu değişince yumuşakça değişir. Yalnızca transform yazılır.
 *
 * `progress[i]`: sıradaki kartın (i + 1) görünüm alanının altından gerçek yapışma noktasına ilerleyişi (0 → 1).
 * Gerçek nokta navbar kaymasını da içerir; böylece küçülme, sıradaki kart gerçekten yerine oturduğunda biter.
 * Ölçüm ve yazım framer-motion kare döngüsünde yapılır; MotionValue'lar aynı karede çizilir.
 */
export function useNavbarShift(
  listRef: RefObject<HTMLOListElement | null>,
  refs: RefObject<HTMLLIElement | null>[],
  enabled: boolean,
  progress?: MotionValue<number>[],
) {
  useEffect(() => {
    const list = listRef.current
    if (!enabled || !list || typeof window === 'undefined') return

    const root = document.documentElement
    const items = refs.map((ref) => ref.current)
    const applied = items.map(() => 0)
    let targets = items.map(() => 0)
    let ratios = items.map(() => 0)
    let hidden = root.dataset.navbar === 'hidden' ? 1 : 0
    let pending = false

    // Okuma adımı: tüm ölçümler; yazım adımı: transform ve MotionValue'lar. Kare başına tek yerleşim hesabı.
    const measure = () => {
      const rootPx = Number.parseFloat(getComputedStyle(root).fontSize) || 16
      const listStyle = getComputedStyle(list)
      const navPx = (Number.parseFloat(listStyle.getPropertyValue('--ss-nav')) || 0) * rootPx
      const gap = Number.parseFloat(listStyle.rowGap) || 0
      const viewport = root.clientHeight
      let natural = list.getBoundingClientRect().top + (Number.parseFloat(listStyle.paddingTop) || 0)
      const naturals: number[] = []
      const sticks: number[] = []

      targets = items.map((item, index) => {
        naturals.push(natural)
        if (!item) {
          sticks.push(Number.NaN)
          return 0
        }
        const current = item.getBoundingClientRect().top - applied[index]
        const stick = Number.parseFloat(getComputedStyle(item).top)
        sticks.push(stick)
        const target = Number.isFinite(stick) ? Math.min(0, Math.max(natural, stick - navPx * hidden) - current) : 0
        natural += item.offsetHeight + gap
        return Math.round(target * 100) / 100
      })

      ratios = items.map((_, index) => {
        const next = index + 1
        if (next >= items.length || !Number.isFinite(sticks[next])) return 0
        const settle = sticks[next] - navPx * hidden
        return clamp01((viewport - naturals[next]) / Math.max(1, viewport - settle))
      })
    }

    const write = () => {
      pending = false
      targets.forEach((target, index) => {
        const item = items[index]
        if (!item || target === applied[index]) return
        item.style.transform = target === 0 ? '' : `translate3d(0, ${target}px, 0)`
        applied[index] = target
      })
      progress?.forEach((value, index) => value.set(ratios[index] ?? 0))
    }

    const schedule = () => {
      if (pending) return
      pending = true
      frame.read(measure)
      frame.update(write)
    }

    let controls: ReturnType<typeof animate> | null = null
    const onNavbar = () => {
      const next = root.dataset.navbar === 'hidden' ? 1 : 0
      controls?.stop()
      controls = animate(hidden, next, {
        duration: DURATION,
        ease: EASE,
        onUpdate: (value) => {
          hidden = value
          schedule()
        },
      })
    }

    const mutations = new MutationObserver(onNavbar)
    mutations.observe(root, { attributes: true, attributeFilter: ['data-navbar'] })
    const resize = new ResizeObserver(schedule)
    resize.observe(list)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()

    return () => {
      cancelFrame(measure)
      cancelFrame(write)
      controls?.stop()
      mutations.disconnect()
      resize.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      for (const item of items) if (item) item.style.transform = ''
    }
  }, [listRef, refs, enabled, progress])
}
