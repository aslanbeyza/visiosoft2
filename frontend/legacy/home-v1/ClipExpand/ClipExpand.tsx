import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import AnimatedTitle from '../AnimatedTitle/index.ts'
import VideoSlot from '../VideoSlot/index.ts'
import { clipExpandCopy } from './clipExpandCopy.ts'
import styles from './ClipExpand.module.css'

export default function ClipExpand() {
  const text = clipExpandCopy
  const reduce = useReducedMotion()
  const pinRef = useRef<HTMLElement>(null)
  const [wide, setWide] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)')
    const apply = () => setWide(query.matches)
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ['start start', 'end end'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 22, restDelta: 0.001 })

  const width = useTransform(progress, [0, 0.85], wide ? ['32vw', '100vw'] : ['78vw', '100vw'])
  const height = useTransform(progress, [0, 0.85], wide ? ['58vh', '100vh'] : ['42vh', '100vh'])
  const radius = useTransform(progress, [0, 0.85], ['28px', '0px'])
  const copyOpacity = useTransform(progress, [0, 0.28], [1, 0])
  const captionOpacity = useTransform(progress, [0.55, 0.85], [0, 1])

  return (
    <section ref={pinRef} className={styles.pin} aria-label={text.kicker}>
      <div className={styles.sticky}>
        <motion.div className={styles.copy} style={reduce ? undefined : { opacity: copyOpacity }}>
          <p className={styles.kicker}>{text.kicker}</p>
          <AnimatedTitle lines={text.title} align="center" className={styles.title} />
          <p className={styles.sub}>{text.sub}</p>
        </motion.div>

        <motion.div
          className={styles.mask}
          style={reduce ? undefined : { width, height, borderRadius: radius }}
        >
          <VideoSlot id="world" />
        </motion.div>

        <motion.p className={styles.caption} style={reduce ? undefined : { opacity: captionOpacity }}>
          {text.caption}
        </motion.p>
      </div>
    </section>
  )
}
