import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/figtree/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
import { useCallback, useState } from 'react'
import GateScene, { type PhaseDetail } from './GateScene.tsx'
import styles from './HeroGate.module.css'

const copy = {
  eyebrow: 'Yazılım · Yapay zekâ · Donanım · Operasyon',
  title: ['Plakayı okur.', 'Ödemeyi alır.', 'Bariyeri açar.'],
  lead: "Plaka tanıma, temassız ödeme, HGS, bariyer kontrolü ve raporlama tek sistemde. 2018'den beri, 7/24 uzaktan destek.",
}

export default function HeroGate() {
  const [revealed, setRevealed] = useState(false)

  const onPhase = useCallback((d: PhaseDetail) => {
    if (d.phase !== 'init') setRevealed(true)
  }, [])

  const shown = revealed ? styles.shown : ''

  return (
    <section data-hero className={styles.hero}>
      <div className={styles.stage}>
        <GateScene onPhase={onPhase} className={styles.scene} />
        <div aria-hidden className={styles.shade} />
      </div>
      <div className={styles.content}>
        <div className={styles.copy}>
          <h1 className={styles.heading}>
            <span className={styles.eyebrow}>
              <span lang="en">Visiosoft</span>
              <span aria-hidden className={styles.eyebrowRule} />
              <span className={styles.eyebrowText}>{copy.eyebrow}</span>
            </span>
            <span className={`${styles.title} ${shown}`}>
              {copy.title.flatMap((line, i) => (i === 0 ? [line] : [<br key={i} />, line]))}
            </span>
          </h1>
          <div className={`${styles.leadRow} ${shown}`}>
            <p className={styles.lead}>{copy.lead}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
