import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from '../../components/Footer/index.ts'
import Navbar from '../../components/Navbar/index.ts'
import Splash from '../../components/Splash/index.ts'
import WhatsAppButton from '../../components/WhatsAppButton/index.ts'
import styles from './MainLayout.module.css'

export default function MainLayout() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
    if (target) {
      target.scrollIntoView()
      return
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return (
    <div className={styles.app}>
      <Splash />
      <Navbar />
      <main id="main-content" className={styles.main} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
