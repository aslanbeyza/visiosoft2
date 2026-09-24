import { useEffect, useRef, useState } from 'react'
import { MobileScreen } from '../panel/MobileApp.tsx'
import { PanelProvider } from '../panel/PanelProvider.tsx'
import styles from './ParkBizPhoneApp.module.css'

// The ParkBiz mobile app is 390px wide; it is scaled to the mockup screen's width and its height stretches to fill the rest,
// so the app always covers the screen edge to edge (its layout is a flex column).
const appWidth = 390

/** ParkBiz mobile app screen for the homepage phone mockup (the mockup image supplies bezel and notch). */
export default function ParkBizPhoneApp() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState({ scale: 0, height: 0 })

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const fitToScreen = () => {
      const scale = host.clientWidth / appWidth
      setFit({ scale, height: scale > 0 ? host.clientHeight / scale : 0 })
    }
    fitToScreen()
    const observer = new ResizeObserver(fitToScreen)
    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={hostRef} className={styles.host}>
      <div className={styles.app} style={{ width: appWidth, height: fit.height, transform: `scale(${fit.scale})` }}>
        <PanelProvider>
          <MobileScreen />
        </PanelProvider>
      </div>
    </div>
  )
}
