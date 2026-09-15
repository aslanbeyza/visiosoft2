import { useLayoutEffect } from 'react'

/** useNavbarScroll: navbar yalnızca bu kaydırma değerinin üstünde ve aşağı inerken gizlenir. */
const NAVBAR_HIDE_AFTER = 480
/** Kaydırma bu kadar süre olay üretmezse bitmiş sayılır (scrollend her tarayıcıda yok). */
const SETTLE_MS = 180
/** Sayfa geçişinin (0,7 sn) ve navbar'ın (0,45 sn) hareketi bitmeden ölçülmez. */
const MIN_WAIT_MS = 800

const rem = () => Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16

/** Çubukların yerleşim yükseklikleri (transform'dan etkilenmez): navbar ve alt menü. */
function barHeights(ids: string[]) {
  const header = document.querySelector('header')
  const navbar = (header?.firstElementChild as HTMLElement | null)?.offsetHeight ?? header?.offsetHeight ?? 0
  const subnav = document.querySelector<HTMLElement>(`nav a[href="#${ids[0]}"]`)?.closest('nav')?.offsetHeight ?? 0
  return { navbar, subnav }
}

/**
 * Başlık, kaydırma bitince görünen çubukların 1rem altına oturur: bölümün üst kenarı = scroll-padding + scroll-margin,
 * başlık = üst kenar + bölümün üst boşluğu. Değerler canlı ölçülür; alt menünün CSS'i değişse de pay kaymaz.
 */
function applyMargin(section: HTMLElement, barsHidden: boolean, ids: string[]) {
  const { navbar, subnav } = barHeights(ids)
  const snap = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
  const pad = Number.parseFloat(getComputedStyle(section).paddingTop) || 0
  const bars = (barsHidden ? 0 : navbar) + subnav
  section.style.scrollMarginTop = `${Math.round(bars + rem() - snap - pad)}px`
  return snap
}

/**
 * Alt menü hedefleri (#zone, #canli-izleme …): bağlantıya tıklanınca varış anındaki navbar durumu önceden hesaplanır
 * (aşağı, 480 px'in ötesine ve hareket azaltılmamışsa gizli), scroll-margin-top buna göre yazılır. Tarayıcı hedefi
 * tıklama olayından sonra hesapladığı için değer zamanında uygulanır. Doğrudan #bağlantıyla açılışta ve güvenlik ağı
 * olarak kaydırma bitince başlık ölçülür; tahmin tutmadıysa navbar'ı yeniden açıp kapatmayan yönde düzeltilir.
 */
export function useSubNavArrival(ids: string[], reduce: boolean) {
  const key = ids.join(',')

  useLayoutEffect(() => {
    const list = key.split(',')
    const root = document.documentElement
    const sections = () => list.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el))
    let cancelWatch = () => {}

    const predict = (section: HTMLElement) => {
      // Önce "görünür" payla hedef konum bulunur; gizli tahmini yalnızca bu konum eşiği aşıyorsa yapılır.
      const snap = applyMargin(section, false, list)
      const margin = Number.parseFloat(section.style.scrollMarginTop) || 0
      const max = root.scrollHeight - innerHeight
      const target = Math.min(max, Math.max(0, scrollY + section.getBoundingClientRect().top - snap - margin))
      const forward = target - scrollY > 8 || (Math.abs(target - scrollY) <= 8 && root.dataset.navbar === 'hidden')
      applyMargin(section, forward && target > NAVBAR_HIDE_AFTER && !reduce, list)
    }

    /** Kaydırma bitince başlık çubukların 1rem altında değilse, navbar durumunu değiştirmeyen yönde düzeltir. */
    const watch = (section: HTMLElement) => {
      cancelWatch()
      const start = performance.now()
      let timer = 0
      const stop = () => {
        window.clearTimeout(timer)
        window.removeEventListener('scroll', onScroll)
        for (const type of ['wheel', 'touchstart', 'keydown', 'pointerdown']) window.removeEventListener(type, stop, true)
      }
      const check = () => {
        const elapsed = performance.now() - start
        if (elapsed < MIN_WAIT_MS) {
          timer = window.setTimeout(check, MIN_WAIT_MS - elapsed)
          return
        }
        stop()
        const { navbar, subnav } = barHeights(list)
        const hidden = root.dataset.navbar === 'hidden'
        const pad = Number.parseFloat(getComputedStyle(section).paddingTop) || 0
        const diff = section.getBoundingClientRect().top + pad - ((hidden ? 0 : navbar) + subnav + rem())
        // Gizliyken aşağı, görünürken yukarı düzeltme navbar'ı yerinde bırakır; diğer yönler çubuğu sıçratırdı.
        if (Math.abs(diff) > 400 || !((hidden && diff > 2) || (!hidden && diff < -2))) return
        window.scrollBy({ top: Math.round(diff), behavior: 'instant' })
        applyMargin(section, hidden, list)
      }
      const onScroll = () => {
        window.clearTimeout(timer)
        timer = window.setTimeout(check, SETTLE_MS)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      for (const type of ['wheel', 'touchstart', 'keydown', 'pointerdown']) window.addEventListener(type, stop, true)
      timer = window.setTimeout(check, SETTLE_MS)
      cancelWatch = stop
    }

    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href*="#"]') : null
      if (!link || link.pathname !== location.pathname) return
      const section = sections().find((el) => `#${el.id}` === decodeURI(link.hash))
      if (!section) return
      predict(section)
      // Tıklamanın kendi pointer olayları bittikten sonra izlemeye başlanır.
      window.setTimeout(() => watch(section), 0)
    }

    const reset = () => sections().forEach((section) => applyMargin(section, false, list))
    reset()
    const initial = sections().find((el) => `#${el.id}` === decodeURIComponent(location.hash))
    let frame = 0
    if (initial) {
      // PageTransition hedefe ilk kaydırmayı bağlanma efektinde (bu karede) başlatır; tahmin yalnızca o ana kadar durur.
      // useScrollSpy payları ilk ölçümünde önbelleğe aldığından sonraki karede "görünür" pay geri yazılır: daha aşağıdaki
      // okuma çizgisi her iki varışta da bölümü etkin sayar.
      predict(initial)
      frame = window.requestAnimationFrame(() => applyMargin(initial, false, list))
      watch(initial)
    }

    document.addEventListener('click', onClick, true)
    window.addEventListener('resize', reset)
    return () => {
      window.cancelAnimationFrame(frame)
      cancelWatch()
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('resize', reset)
      sections().forEach((section) => section.style.removeProperty('scroll-margin-top'))
    }
  }, [key, reduce])
}
