import { useEffect } from 'react'
import type { RefObject } from 'react'
import { cancelFrame, frame } from 'framer-motion'

/** Navbar'ın 0,45 sn'lik geçişi + pay; transitionend gelmezse kare kare izleme bu sürede kendiliğinden biter. */
const FOLLOW_MS = 700

/**
 * Navbar gizlenince yapışmış çubuğu onun bıraktığı boşluğa kaydırır; akıştaki (henüz yapışmamış) çubuk yerinde kalır.
 * Hedef üst konum: max(doğal konum, min(yapışma üstü, navbar'ın canlı alt kenarı)). Navbar geçişi sürerken her karede
 * navbar'ın o anki alt kenarı okunur; çubuk ayrı bir animasyon çalıştırmadığı için aynı karede izler ve arada boşluk
 * kalmaz. Hareketi azaltma tercihinde navbar'ın geçişi yoktur, çubuk da aynı karede atlar.
 * Doğal konum çubuğun hemen önündeki sıfır yükseklikli işaretçiden okunur; yalnızca transform yazılır.
 */
export function useStickyShift(
  sentinelRef: RefObject<HTMLElement | null>,
  stickyRef: RefObject<HTMLElement | null>,
  reduce: boolean,
) {
  useEffect(() => {
    const sentinel = sentinelRef.current
    const sticky = stickyRef.current
    if (!sentinel || !sticky || typeof window === 'undefined') return

    const root = document.documentElement
    let header: HTMLElement | null = null
    let stick = Number.NaN
    let applied = 0
    let target = 0
    let pending = false
    let followUntil = 0

    // Navbar'ın canlı alt kenarı; navbar yoksa (ör. PDF kipi) html[data-navbar] durumuna göre davranılır.
    const navbarBottom = () => {
      if (!header) return root.dataset.navbar === 'hidden' ? 0 : stick
      return Math.max(0, header.getBoundingClientRect().bottom)
    }

    const measure = () => {
      if (Number.isNaN(stick)) stick = Number.parseFloat(getComputedStyle(sticky).top) || 0
      const natural = sentinel.getBoundingClientRect().top
      // Uygulanmış kayma çıkarılınca çubuğun yapışkan konumu (akışta: doğal konum; yapışmışken: stick) kalır.
      const current = sticky.getBoundingClientRect().top - applied
      const desired = Math.max(natural, Math.min(stick, navbarBottom()))
      target = Math.round(Math.min(0, desired - current) * 100) / 100
    }

    const write = () => {
      pending = false
      if (target !== applied) {
        sticky.style.transform = target === 0 ? '' : `translate3d(0, ${target}px, 0)`
        applied = target
      }
      if (performance.now() < followUntil) schedule()
    }

    function schedule() {
      if (pending) return
      pending = true
      frame.read(measure)
      frame.update(write)
    }

    // Navbar durumu değişince ya da geçişi başlayınca çubuk birkaç yüz milisaniye boyunca her karede izler.
    const follow = () => {
      if (!reduce) followUntil = performance.now() + FOLLOW_MS
      schedule()
    }

    // Yalnızca navbar'ın kendi transform geçişi sayılır (tema/gölge katmanlarının opaklık geçişleri değil).
    const isShift = (event: TransitionEvent) =>
      event.target === header && !event.pseudoElement && event.propertyName === 'transform'

    const onTransitionRun = (event: TransitionEvent) => {
      if (isShift(event)) follow()
    }

    const onTransitionEnd = (event: TransitionEvent) => {
      if (!isShift(event)) return
      followUntil = 0
      schedule()
    }

    const mutations = new MutationObserver(() => {
      bindHeader()
      follow()
    })

    // Navbar sonradan takılır ya da yeniden oluşturulursa dinleyiciler yeni öğeye taşınır.
    function bindHeader() {
      const next = document.querySelector<HTMLElement>('header[data-hidden]')
      if (next === header) return
      if (header) {
        header.removeEventListener('transitionrun', onTransitionRun)
        header.removeEventListener('transitionend', onTransitionEnd)
        header.removeEventListener('transitioncancel', onTransitionEnd)
      }
      header = next
      if (!header) return
      header.addEventListener('transitionrun', onTransitionRun)
      header.addEventListener('transitionend', onTransitionEnd)
      header.addEventListener('transitioncancel', onTransitionEnd)
      mutations.observe(header, { attributes: true, attributeFilter: ['data-hidden'] })
    }

    const onResize = () => {
      stick = Number.NaN
      schedule()
    }

    bindHeader()
    mutations.observe(root, { attributes: true, attributeFilter: ['data-navbar'] })
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize)
    schedule()

    return () => {
      cancelFrame(measure)
      cancelFrame(write)
      mutations.disconnect()
      header?.removeEventListener('transitionrun', onTransitionRun)
      header?.removeEventListener('transitionend', onTransitionEnd)
      header?.removeEventListener('transitioncancel', onTransitionEnd)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
      sticky.style.transform = ''
    }
  }, [sentinelRef, stickyRef, reduce])
}
