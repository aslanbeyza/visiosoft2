import { lazy, Suspense, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import DeviceFrame from '../DeviceFrame/index.ts'
import type { DeviceKind } from '../DeviceFrame/index.ts'
import { revealEase } from '../Reveal/index.ts'
import PartnerPanelTour from './PartnerPanelTour.tsx'
import { homeSoftwareCopy as text } from './homeSoftwareCopy.ts'
import styles from './HomeSoftware.module.css'

// The ParkBiz app is large (~160 KB); load it only when the section renders.
const ParkBizPhoneApp = lazy(() => import('./ParkBizPhoneApp.tsx'))

export default function ZoneStage() {
  const reduce = useReducedMotion()
  const mediaRef = useRef<HTMLDivElement>(null)
  const mediaInView = useInView(mediaRef, { once: true, amount: 0.2 })
  const [onboard, setOnboard] = useState(true)

  return (
    <>
      <div
        ref={mediaRef}
        className={styles.stage}
        aria-label={text.devicesLabel}
        onPointerDown={() => setOnboard(false)}
      >
        <DeviceChrome kind="phone" title={text.phoneLabel} visible={mediaInView} reduce={Boolean(reduce)}>
          <Suspense fallback={null}>
            <ParkBizPhoneApp />
          </Suspense>
        </DeviceChrome>
        <DeviceChrome
          kind="laptop"
          title={text.laptopLabel}
          visible={mediaInView}
          reduce={Boolean(reduce)}
          onboard={onboard && mediaInView}
        >
          <PartnerPanelTour />
        </DeviceChrome>
      </div>
      <p className={styles.caption}>{text.note}</p>
    </>
  )
}

function DeviceChrome({
  kind,
  title,
  visible,
  reduce,
  onboard = false,
  children,
}: {
  kind: DeviceKind
  title: string
  visible: boolean
  reduce: boolean
  onboard?: boolean
  children: ReactNode
}) {
  return (
    <motion.figure
      className={styles.device}
      data-kind={kind}
      aria-label={title}
      initial={reduce ? false : { clipPath: 'inset(0% 0% 100% 0%)' }}
      animate={visible || reduce ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
      transition={{ duration: 1.2, ease: revealEase }}
    >
      <DeviceFrame kind={kind} overlay={<AnimatePresence>{onboard && !reduce ? <OnboardCursor /> : null}</AnimatePresence>}>
        {children}
      </DeviceFrame>
    </motion.figure>
  )
}

function OnboardCursor() {
  return (
    <motion.div
      className={styles.onboard}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.span
        className={styles.ripple}
        animate={{ scale: [0.3, 1.7], opacity: [0.5, 0] }}
        transition={{ duration: 0.85, repeat: Infinity, repeatDelay: 1.55, delay: 1.15, ease: 'easeOut' }}
      />
      <motion.span
        className={styles.cursor}
        animate={{
          x: [18, 0, 0, 0, 6],
          y: [-28, 0, 0, 0, 4],
          scale: [1, 1, 0.86, 1, 1],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg viewBox="0 0 24 24" className={styles.cursorIcon} aria-hidden="true">
          <path d="M5.2 3.4 18 13.1l-6.2.4 3.4 7.3-2.4 1.1-3.4-7.2-4.2 3.6z" />
        </svg>
      </motion.span>
    </motion.div>
  )
}
