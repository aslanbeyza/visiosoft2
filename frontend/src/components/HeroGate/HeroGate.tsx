import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/figtree/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
import { useCallback, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import GateScene, { type PhaseDetail } from './GateScene.tsx'
import styles from './HeroGate.module.css'

const title = ['Plakayı okur.', 'Ödemeyi alır.', 'Bariyeri açar.']

export default function HeroGate() {
  const [revealed, setRevealed] = useState(false)

  const onPhase = useCallback((d: PhaseDetail) => {
    if (d.phase !== 'init') setRevealed(true)
  }, [])

  const reduce = Boolean(useReducedMotion())

  return (
    <section data-hero className={styles.hero}>
      <div className={styles.stage}>
        <GateScene onPhase={onPhase} className={styles.scene} />
        <div aria-hidden className={styles.shade} />
      </div>
      <div className={styles.content}>
        <div className={styles.copy}>
          <h1 className={styles.title}>
            {title.map((line, index) => (
              <motion.span
                key={line}
                className={styles.line}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={revealed || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ type: 'spring', delay: 0.2 + index * 0.2 }}
              >
                {line}
              </motion.span>
            ))}
          </h1>
        </div>
      </div>
    </section>
  )
}
