import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import { finishSplash, useSplashActive } from './splashState.ts'
import styles from './Splash.module.css'

const HOLD_MS = 1100

export default function Splash() {
  const open = useSplashActive()

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const timer = window.setTimeout(finishSplash, HOLD_MS)
    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className={styles.overlay}
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.55, ease: revealEase }}
          aria-hidden="true"
        >
          <div className={styles.center}>
            <motion.img
              className={styles.mark}
              src="/img/visiosoft_logo.svg"
              alt=""
              width="220"
              height="52"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }}
              transition={{ duration: 0.45, ease: revealEase }}
            />
            <motion.span
              className={styles.line}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ delay: 0.25, duration: 0.6, ease: revealEase }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
