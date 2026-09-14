import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import styles from './Splash.module.css'

const KEY = 'visiosoft-splash'
const HOLD_MS = 1100

export default function Splash() {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (reduce || sessionStorage.getItem(KEY)) return
    setOpen(true)
    document.body.style.overflow = 'hidden'
    const timer = window.setTimeout(() => {
      setOpen(false)
      sessionStorage.setItem(KEY, '1')
      document.body.style.overflow = ''
    }, HOLD_MS)
    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [reduce])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className={styles.overlay}
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
          aria-hidden="true"
        >
          <div>
            <motion.img
              className={styles.mark}
              src="/img/visiosoft_logo.svg"
              alt=""
              width="220"
              height="52"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            />
            <motion.div
              className={styles.line}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.22, duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
