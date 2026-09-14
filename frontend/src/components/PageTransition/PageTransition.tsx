import { Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import { isPdfSearch, useSplashActive } from '../Splash/index.ts'
import RouteErrorBoundary from './RouteErrorBoundary.tsx'
import RouteFallback from './RouteFallback.tsx'
import styles from './PageTransition.module.css'

/**
 * Kullanım: MainLayout içinde `<main><PageTransition /></main>` — `useOutlet` ile rota içeriğini kendisi alır.
 * Rota perdesi (M1): yol değişince lacivert perde alttan yukarı sayfayı örter (0,45 sn), eski sayfa kaldırılır,
 * yeni sayfa perdenin altında bağlanır ve o anda başa/#bağlantıya kaydırılır; parça indiyse perde yukarı sıyrılır,
 * yeni sayfa hafifçe yükselerek belirir (toplam ≤ 0,9 sn). Navbar/Footer hiç yeniden bağlanmaz.
 * Hareket azaltma ve açılış perdesi sırasında: perde yok, anında geçiş. Parça indirilemezse hata sınırı düz çizer.
 */

type Phase = 'idle' | 'cover' | 'covered' | 'reveal'

const COVER = 0.45
const REVEAL = 0.45
/** Perde örtüldükten sonra sayfa parçası bu süre içinde gelmezse perde yine de açılır. */
const STALL_MS = 5000

const curtainVariants: Variants = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)', transition: { duration: 0 } },
  cover: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: COVER, ease: revealEase } },
  reveal: { clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: REVEAL, ease: revealEase } },
}

const markVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0, transition: { duration: 0 } },
  cover: { pathLength: 1, opacity: 1, transition: { duration: 0.5, delay: 0.12, ease: revealEase } },
  reveal: { pathLength: 1, opacity: 1, transition: { duration: 0 } },
}

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.06, ease: revealEase } },
  exit: { opacity: 0.6, y: -14, transition: { duration: COVER, ease: revealEase } },
  exitInstant: { opacity: 1, y: 0, transition: { duration: 0 } },
}

/** Yeni sayfa içeriği (tembel parça dahil) bağlandığında haber verir; #bağlantı değişimini de izler. */
function MountSignal({ hash, onMount, onHashChange }: { hash: string; onMount: () => void; onHashChange: (hash: string) => void }) {
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      onMount()
      return
    }
    onHashChange(hash)
  }, [hash, onMount, onHashChange])
  return null
}

function scrollToTarget(hash: string, behavior?: ScrollBehavior) {
  const id = hash ? decodeURIComponent(hash.slice(1)) : ''
  const target = id ? document.getElementById(id) : null
  if (target) {
    // Davranış verilmezse html'deki scroll-behavior (tercihe göre yumuşak) geçerlidir.
    if (behavior) target.scrollIntoView({ behavior, block: 'start' })
    else target.scrollIntoView()
    return
  }
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
}

export default function PageTransition() {
  const outlet = useOutlet()
  const { pathname, hash, search } = useLocation()
  const reduce = Boolean(useReducedMotion())
  const splashActive = useSplashActive()
  // ?pdf=1 (arka uç PDF çıktısı): rota perdesi ve sayfa giriş hareketi yok.
  const animated = !reduce && !splashActive && !isPdfSearch(search)

  const [seen, setSeen] = useState(pathname)
  const [phase, setPhase] = useState<Phase>('idle')
  /** Bu sayfa perdeyle mi geldi? İlk yükleme ve anlık geçişlerde giriş animasyonu yoktur. */
  const [entrance, setEntrance] = useState(false)

  // Yol değişimi render sırasında türetilir (effect içinde setState yok).
  if (seen !== pathname) {
    setSeen(pathname)
    setEntrance(animated)
    setPhase(animated ? 'cover' : 'idle')
  }

  // Alt bileşenlerden çağrılan geri çağrılar kararlı kalsın; güncel değerler ref üzerinden okunur.
  const latest = useRef({ phase, hash })
  useLayoutEffect(() => {
    latest.current = { phase, hash }
  })

  const handleExitComplete = useCallback(() => {
    // Eski sayfa kalktı, yeni sayfa perde altında bağlanacak; belge başa alınır.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    setPhase((current) => (current === 'cover' ? 'covered' : current))
  }, [])

  const handleMount = useCallback(() => {
    const { phase: current, hash: currentHash } = latest.current
    if (current === 'covered' || current === 'cover') {
      scrollToTarget(currentHash, 'instant')
      setPhase('reveal')
      return
    }
    scrollToTarget(currentHash)
  }, [])

  const handleHashChange = useCallback((nextHash: string) => {
    scrollToTarget(nextHash)
  }, [])

  // Parça takılırsa perde açık kalmasın.
  useEffect(() => {
    if (phase !== 'covered') return
    const id = window.setTimeout(() => setPhase('reveal'), STALL_MS)
    return () => window.clearTimeout(id)
  }, [phase])

  const curtainState = phase === 'idle' ? 'hidden' : phase === 'reveal' ? 'reveal' : 'cover'
  const pageState = phase === 'cover' || phase === 'covered' ? 'hidden' : 'visible'

  return (
    <div className={styles.root}>
      {/*
        initial={false} burada VERİLMEZ: framer-motion bu değeri PresenceContext'te saklar ve doğrudan açılan sayfada
        (PageTransition yeniden çizilmediği için) sayfanın ömrü boyunca tüm alt motion öğelerinin başlangıç durumunu
        atlatır; Reveal/whileInView girişleri ve sonradan bağlanan öğeler (ör. ParkingFlow vurgu etiketi) hareketsiz
        kalırdı. İlk yüklemede sayfa girişini zaten aşağıdaki `initial={entrance ? 'hidden' : false}` kapatır.
      */}
      <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
        <motion.div
          key={pathname}
          className={styles.page}
          variants={pageVariants}
          initial={entrance ? 'hidden' : false}
          animate={entrance ? pageState : 'visible'}
          exit={animated ? 'exit' : 'exitInstant'}
        >
          <Suspense fallback={<RouteFallback />}>
            <RouteErrorBoundary>{outlet}</RouteErrorBoundary>
            <MountSignal hash={hash} onMount={handleMount} onHashChange={handleHashChange} />
          </Suspense>
        </motion.div>
      </AnimatePresence>

      <motion.div
        className={styles.curtain}
        data-phase={phase}
        variants={curtainVariants}
        initial="hidden"
        animate={curtainState}
        onAnimationComplete={(definition) => {
          if (definition === 'reveal') setPhase((current) => (current === 'reveal' ? 'idle' : current))
        }}
        aria-hidden="true"
      >
        <div className={styles.mark}>
          <svg viewBox="0 0 32 32" className={styles.markSvg} focusable="false">
            <rect x="1" y="1" width="30" height="30" rx="8" className={styles.markFrame} />
            <motion.path d="M9.5 9.5 16 23l6.5-13.5" className={styles.markV} variants={markVariants} />
          </svg>
          <span className={styles.markLine} />
        </div>
      </motion.div>
    </div>
  )
}
