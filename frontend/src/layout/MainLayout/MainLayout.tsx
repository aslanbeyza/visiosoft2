import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Footer from '../../components/Footer/index.ts'
import Navbar from '../../components/Navbar/index.ts'
import PageTransition from '../../components/PageTransition/index.ts'
import Splash, { isPdfSearch } from '../../components/Splash/index.ts'
import WhatsAppButton from '../../components/WhatsAppButton/index.ts'
import { routeNameFromPath } from '../../lib/index.ts'
import { preloadRoute } from '../../pages/registry.ts'
import styles from './MainLayout.module.css'

/**
 * Site iskeleti: açılış perdesi, navbar, rota perdesiyle değişen sayfa içeriği, footer ve WhatsApp düğmesi.
 * Sayfa değişiminde başa dönme / #bağlantıya gitme PageTransition içinde, perde sayfayı örterken yapılır.
 * `?pdf=1` (arka uç PDF çıktısı): açılış perdesi, navbar (gizlenme davranışıyla birlikte) ve WhatsApp düğmesi çizilmez;
 * rota perdesini PageTransition kendisi atlar.
 */
export default function MainLayout() {
  const { search } = useLocation()
  const pdf = isPdfSearch(search)

  // Niyet anında ön yükleme: iç bağlantının üzerine gelince, odaklanınca ya da dokununca parçası indirilir.
  useEffect(() => {
    const requested = new Set<string>()

    const onIntent = (event: Event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest('a[href]')
      if (!(anchor instanceof HTMLAnchorElement)) return
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return

      let url: URL
      try {
        url = new URL(anchor.href, window.location.href)
      } catch {
        return
      }
      if (url.origin !== window.location.origin) return

      const normalized = url.pathname.replace(/\/+$/, '') || '/'
      const name = routeNameFromPath(normalized)
      // routeNameFromPath bilinmeyen yollar için 'home' döner; gerçek ana sayfa değilse 404 parçası için yükleme yapılmaz.
      if (name === 'home' && normalized !== '/') return
      if (requested.has(name)) return
      requested.add(name)
      preloadRoute(name).catch(() => {
        requested.delete(name)
      })
    }

    document.addEventListener('mouseover', onIntent, { passive: true })
    document.addEventListener('focusin', onIntent)
    document.addEventListener('touchstart', onIntent, { passive: true })
    return () => {
      document.removeEventListener('mouseover', onIntent)
      document.removeEventListener('focusin', onIntent)
      document.removeEventListener('touchstart', onIntent)
    }
  }, [])

  return (
    <div className={styles.app} data-pdf={pdf ? 'true' : undefined}>
      {pdf ? null : <Splash />}
      {pdf ? null : <Navbar />}
      <main id="main-content" className={styles.main} tabIndex={-1}>
        <PageTransition />
      </main>
      <Footer />
      {pdf ? null : <WhatsAppButton />}
    </div>
  )
}
